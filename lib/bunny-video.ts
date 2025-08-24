interface BunnyVideoUploadResponse {
  success: boolean
  videoId?: string
  videoUrl?: string
  error?: string
}

interface BunnyVideoMetadata {
  title: string
  description: string
  tags: string[]
  category: string
}

export class BunnyVideoService {
  private apiKey: string
  private libraryId: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.BUNNY_STREAM_API_KEY || ''
    this.libraryId = process.env.BUNNY_LIBRARY_ID || ''
    this.baseUrl = 'https://video.bunnycdn.com'
    
    if (!this.apiKey || !this.libraryId) {
      console.warn('Bunny.net credentials not configured. Video uploads will fail.')
    }
  }

  async uploadVideo(file: File, metadata: BunnyVideoMetadata): Promise<BunnyVideoUploadResponse> {
    try {
      if (!this.apiKey || !this.libraryId) {
        console.error('Missing credentials:', { 
          hasApiKey: !!this.apiKey, 
          hasLibraryId: !!this.libraryId,
          apiKeyLength: this.apiKey?.length,
          libraryId: this.libraryId
        })
        return {
          success: false,
          error: 'Bunny.net credentials not configured'
        }
      }

      console.log('Starting Bunny.net upload with credentials:', {
        hasApiKey: !!this.apiKey,
        libraryId: this.libraryId,
        baseUrl: this.baseUrl
      })

      // Step 1: Create video entry in Bunny.net
      const createResponse = await fetch(`${this.baseUrl}/library/${this.libraryId}/videos`, {
        method: 'POST',
        headers: {
          'AccessKey': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          category: metadata.category
        })
      })

      if (!createResponse.ok) {
        const error = await createResponse.text()
        console.error('Failed to create video entry:', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          error
        })
        throw new Error(`Failed to create video entry: ${error}`)
      }

      const videoData = await createResponse.json()
      const videoId = videoData.guid

      console.log('Video entry created successfully:', { videoId, videoData })

      // Step 2: Upload video file
      const uploadResponse = await fetch(`${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          'AccessKey': this.apiKey,
          'Content-Type': 'application/octet-stream'
        },
        body: file
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.text()
        console.error('Failed to upload video file:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error
        })
        throw new Error(`Failed to upload video file: ${error}`)
      }

      console.log('Video file uploaded successfully')

      // Step 3: Generate video URL
      const videoUrl = `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}`
      
      console.log('Upload completed:', { videoId, videoUrl })
      
      return {
        success: true,
        videoId,
        videoUrl
      }
    } catch (error) {
      console.error('Bunny.net video upload failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getVideoInfo(videoId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`, {
        headers: {
          'AccessKey': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get video info: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get video info:', error)
      throw error
    }
  }

  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/library/${this.libraryId}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'AccessKey': this.apiKey
        }
      })

      return response.ok
    } catch (error) {
      console.error('Failed to delete video:', error)
      return false
    }
  }
}

export const bunnyVideoService = new BunnyVideoService()
