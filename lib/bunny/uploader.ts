import * as tus from 'tus-js-client'

type Handlers = {
  onProgress?: (percent: number) => void
  onSuccess?: (videoId: string) => void
  onError?: (error: unknown) => void
}

declare global {
  // eslint-disable-next-line no-var
  var __bunnyUploads: Map<string, tus.Upload> | undefined
}

function getGlobalStore(): Map<string, tus.Upload> {
  if (!globalThis.__bunnyUploads) {
    globalThis.__bunnyUploads = new Map()
  }
  return globalThis.__bunnyUploads
}

export async function startBunnyUpload(
  file: File,
  title: string,
  handlers: Handlers = {}
): Promise<string> {
  const res = await fetch('/api/bunny/create-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`create-upload failed: ${res.status} ${msg}`)
  }
  const { libraryId, videoId, authorizationSignature, authorizationExpire, tusEndpoint } = await res.json()

  const upload = new tus.Upload(file, {
    endpoint: tusEndpoint,
    retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
    headers: {
      AuthorizationSignature: authorizationSignature,
      AuthorizationExpire: authorizationExpire,
      LibraryId: String(libraryId),
      VideoId: videoId,
    },
    metadata: { filetype: file.type, title },
    onError: (e) => handlers.onError?.(e),
    onProgress: (sent, total) => {
      if (total > 0) handlers.onProgress?.(Math.round((sent / total) * 100))
    },
    onSuccess: () => handlers.onSuccess?.(videoId),
  })

  // Persist the upload instance globally so it continues across route changes
  getGlobalStore().set(videoId, upload)

  // Resume if there is any previous state
  const previous = await upload.findPreviousUploads()
  if (previous.length) {
    upload.resumeFromPreviousUpload(previous[0])
  }
  upload.start()

  return videoId
}


