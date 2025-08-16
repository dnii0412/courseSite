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
    const { endpoint, headers, video, uploadMethod } = upload
    
    console.log('Got upload credentials:', { endpoint, videoId: video.id, uploadMethod })
    
    // Show immediate success (like old implementation)
    console.log('Video created on Bunny.net, showing success immediately')
    handlers.onSuccess?.(video.id)
    
    // Step 2: Start upload in background
    if (uploadMethod === 'direct') {
      console.log('Starting direct upload in background...')
      startDirectUpload(file, endpoint, headers, handlers)
    } else {
      console.log('Starting TUS upload in background...')
      startTusUpload(file, endpoint, headers, handlers)
    }
    
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
  console.log('TUS upload config:', { endpoint, headers, fileSize: file.size })
  
  const upload = new tus.Upload(file, {
    endpoint,
    retryDelays: [0, 3000, 5000, 10000, 20000, 60000, 60000],
    headers,
    removeFingerprintOnSuccess: true,
    metadata: {
      filetype: file.type,
      title: file.name,
    },
    onError: (error) => {
      console.error('TUS upload error:', error)
      console.log('TUS upload failed, but video was already created on Bunny.net')
      // Don't update lesson status from here
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
      // Don't update lesson status from here
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

// Direct upload function
async function startDirectUpload(
  file: File,
  uploadUrl: string,
  headers: any,
  handlers: Handlers
) {
  try {
    console.log('Starting direct upload to:', uploadUrl)
    
    // Simulate progress for better UX
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 90) {
        progress = 90
        clearInterval(progressInterval)
      }
      handlers.onProgress?.(Math.min(progress, 90))
    }, 200)
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: headers,
      body: file
    })
    
    clearInterval(progressInterval)
    
    if (response.ok) {
      console.log('Direct upload completed successfully!')
      handlers.onProgress?.(100)
      // Don't update lesson status from here
    } else {
      console.error('Direct upload failed:', response.status, await response.text())
      // Don't update lesson status from here
    }
  } catch (error) {
    console.error('Direct upload error:', error)
    // Don't update lesson status from here
  }
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


