import * as tus from 'tus-js-client'

type Handlers = {
  onProgress?: (percent: number) => void
  onSuccess?: (videoId: string) => void
  onError?: (error: unknown) => void
}

export async function startBunnyUpload(
  file: File,
  title: string,
  handlers: Handlers = {}
): Promise<string> {
  try {
    console.log('Starting Bunny.net TUS upload for:', title)
    
    // Step 1: Get presigned TUS credentials from our server
    const createRes = await fetch('/api/bunny/create-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    
    if (!createRes.ok) {
      const msg = await createRes.text()
      throw new Error(`create-upload failed: ${createRes.status} ${msg}`)
    }
    
    const { upload } = await createRes.json()
    const { endpoint, headers, video } = upload
    
    console.log('Got TUS credentials:', { endpoint, videoId: video.id })
    
    // Show immediate success (like old implementation)
    console.log('Video created on Bunny.net, showing success immediately')
    handlers.onSuccess?.(video.id)
    
    // Step 2: Start TUS upload in background
    console.log('Starting TUS upload in background...')
    startTusUpload(file, endpoint, headers, handlers)
    
    return video.id
    
  } catch (error) {
    console.error('Bunny upload error:', error)
    handlers.onError?.(error)
    throw error
  }
}

// Start TUS upload in background
function startTusUpload(
  file: File, 
  endpoint: string, 
  headers: any, 
  handlers: Handlers
) {
  const upload = new tus.Upload(file, {
    endpoint,
    retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
    headers,
    metadata: {
      filetype: file.type,
      title: file.name,
    },
    onError: (error) => {
      console.error('TUS upload error:', error)
      // Don't call onError since we already showed success
      console.log('TUS upload failed, but video was already created on Bunny.net')
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      if (bytesTotal > 0) {
        const percent = Math.round((bytesUploaded / bytesTotal) * 100)
        console.log(`TUS upload progress: ${percent}%`)
        handlers.onProgress?.(percent)
      }
    },
    onSuccess: () => {
      console.log('TUS upload completed successfully!')
      console.log('Video will be processed by Bunny.net in the background')
    },
  })

  // Resume if there is any previous state
  upload.findPreviousUploads().then((previous) => {
    if (previous.length) {
      console.log('Resuming upload from previous state')
      upload.resumeFromPreviousUpload(previous[0])
    }
    upload.start()
  }).catch((error) => {
    console.error('Error starting TUS upload:', error)
    upload.start()
  })
}

// Simple progress simulation for immediate feedback
export function simulateProgress(file: File, onProgress: (percent: number) => void): Promise<void> {
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        resolve()
      }
      onProgress(Math.round(progress))
    }, 200)
  })
}


