import { v2 as cloudinary } from 'cloudinary'

// Check if Cloudinary credentials are available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// Log configuration status (without exposing secrets)
console.log('Cloudinary Config Status:', {
  cloudName: cloudName ? 'Set' : 'Missing',
  apiKey: apiKey ? 'Set' : 'Missing',
  apiSecret: apiSecret ? 'Set' : 'Missing'
})

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary credentials missing! Please set:')
  console.error('   CLOUDINARY_CLOUD_NAME')
  console.error('   CLOUDINARY_API_KEY')
  console.error('   CLOUDINARY_API_SECRET')
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export default cloudinary

// Helper function to upload file to Cloudinary
export async function uploadToCloudinary(file: File, folder: string = 'media-grid') {
  try {
    // Check if credentials are available
    if (!cloudName || !apiKey || !apiSecret) {
      console.warn('⚠️ Cloudinary not configured, using local fallback')
      return await uploadToLocalStorage(file)
    }

    console.log('Starting Cloudinary upload for file:', file.name)
    console.log('File size:', file.size, 'bytes')
    console.log('File type:', file.type)

    // Convert File to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create a unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
    const filename = `${originalName}_${timestamp}`
    
    console.log('Uploading to Cloudinary with filename:', filename)
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: filename,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [
            { quality: 'auto:good' }, // Optimize quality
            { fetch_format: 'auto' }  // Auto-format
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload_stream error:', error)
            reject(error)
          } else {
            console.log('Cloudinary upload successful:', result)
            resolve(result)
          }
        }
      ).end(buffer)
    })
    
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    let errorMessage = 'Unknown error'
    
    if (error && typeof error === 'object') {
      if ('message' in error) {
        errorMessage = String(error.message)
      } else if ('http_code' in error) {
        errorMessage = `HTTP ${error.http_code}`
      }
    }
    
    throw new Error(`Failed to upload file to Cloudinary: ${errorMessage}`)
  }
}

// Fallback function for local storage when Cloudinary is not configured
export async function uploadToLocalStorage(file: File) {
  try {
    console.log('Using local storage fallback for:', file.name)
    
    // Create a unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\.[^/.]+$/, '') // Remove extension
    const filename = `${originalName}_${timestamp}`
    
    // Convert file to buffer and then to base64 for local storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    // Return a mock Cloudinary result structure
    return {
      public_id: `local_${filename}`,
      url: dataUrl,
      secure_url: dataUrl,
      format: file.type.split('/')[1],
      width: 0,
      height: 0,
      resource_type: 'image',
      created_at: new Date().toISOString(),
      bytes: file.size,
      etag: `local_${timestamp}`,
      placeholder: false,
      version_id: `local_${timestamp}`,
      tags: ['local-storage'],
      folder: 'local-fallback'
    }
  } catch (error) {
    console.error('Local storage fallback error:', error)
    throw new Error('Failed to store file locally')
  }
}

// Helper function to delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string) {
  try {
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials not configured')
    }
    
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}
