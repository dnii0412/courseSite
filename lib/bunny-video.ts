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
    this.apiKey = process.env.BUNNY_API_KEY || ''
    this.libraryId = process.env.BUNNY_VIDEO_LIBRARY_ID || ''
    this.baseUrl = 'https://video.bunnycdn.com'
    
    if (!this.apiKey || !this.libraryId) {
      console.warn('Bunny.net credentials not configured. Check BUNNY_API_KEY and BUNNY_VIDEO_LIBRARY_ID environment variables.')
    }
  }

  async uploadVideo(file: File, metadata: BunnyVideoMetadata): Promise<BunnyVideoUploadResponse> {
    try {
      if (!this.apiKey || !this.libraryId) {
        return {
          success: false,
          error: 'Bunny.net credentials not configured'
        }
      }



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

        throw new Error(`Failed to create video entry: ${error}`)
      }

      const videoData = await createResponse.json()
      const videoId = videoData.guid



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

        throw new Error(`Failed to upload video file: ${error}`)
      }



      // Step 3: Generate video URL
      const videoUrl = `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}`
      

      
      return {
        success: true,
        videoId,
        videoUrl
      }
    } catch (error) {

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
      
      return false
    }
  }
}

export const bunnyVideoService = new BunnyVideoService()
