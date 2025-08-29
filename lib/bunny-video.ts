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
    // Use the working API key (stream library API key has video management permissions)
    this.apiKey = process.env.BUNNY_STREAM_LIBRARY_API_KEY || process.env.BUNNY_API_KEY || ''
    this.libraryId = process.env.BUNNY_VIDEO_LIBRARY_ID || process.env.BUNNY_STREAM_LIBRARY_ID || ''
    this.baseUrl = 'https://video.bunnycdn.com'
    
    if (!this.apiKey || !this.libraryId) {
      console.warn('Bunny.net credentials not configured. Check BUNNY_STREAM_LIBRARY_API_KEY and BUNNY_VIDEO_LIBRARY_ID environment variables.')
    } else {
      console.log('Bunny.net video service initialized successfully')
      console.log(`  API Key: ${this.apiKey.substring(0, 8)}...`)
      console.log(`  Library ID: ${this.libraryId}`)
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

      console.log('Starting video upload to Bunny.net...')
      console.log('Using API key:', this.apiKey.substring(0, 8) + '...')
      console.log('Library ID:', this.libraryId)
      console.log('File size:', file.size, 'bytes')
      console.log('File type:', file.type)

      // Step 1: Create video entry in Bunny.net
      console.log('Step 1: Creating video entry...')
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
        console.error('Failed to create video entry:', createResponse.status, createResponse.statusText)
        console.error('Error response:', error)
        throw new Error(`Failed to create video entry: ${error}`)
      }

      const videoData = await createResponse.json()
      const videoId = videoData.guid
      console.log('✅ Video entry created successfully:', videoId)

      // Step 2: Upload video file
      console.log('Step 2: Uploading video file...')
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
        console.error('Failed to upload video file:', uploadResponse.status, uploadResponse.statusText)
        console.error('Error response:', error)
        throw new Error(`Failed to upload video file: ${error}`)
      }

      console.log('✅ Video file uploaded successfully')

      // Step 3: Generate video URL
      const videoUrl = `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}`
      console.log('✅ Video URL generated:', videoUrl)
      
      return {
        success: true,
        videoId,
        videoUrl
      }
    } catch (error) {
      console.error('Bunny.net upload error:', error)
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

  // Test method to verify API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/library/${this.libraryId}`, {
        method: 'GET',
        headers: {
          'AccessKey': this.apiKey,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log('✅ Bunny.net API connection test successful')
        return true
      } else {
        console.error('❌ Bunny.net API connection test failed:', response.status, response.statusText)
        return false
      }
    } catch (error) {
      console.error('❌ Bunny.net API connection test error:', error)
      return false
    }
  }
}

export const bunnyVideoService = new BunnyVideoService()
