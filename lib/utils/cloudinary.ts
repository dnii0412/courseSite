import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export interface CloudinaryVideoResult extends CloudinaryUploadResult {
  duration: number;
  poster_url?: string;
}

export const cloudinaryUtils = {
  // Generate signed upload preset
  getUploadPreset: () => {
    return process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';
  },

  // Get optimized URL for grid display
  getOptimizedUrl: (publicId: string, width: number, height: number, format: 'image' | 'video' = 'image') => {
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;

    if (format === 'video') {
      return `${baseUrl}/video/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${publicId}`;
    }

    return `${baseUrl}/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${publicId}`;
  },

  // Get thumbnail URL for admin preview
  getThumbnailUrl: (publicId: string, width: number = 200, height: number = 200) => {
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;
    return `${baseUrl}/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${publicId}`;
  },

  // Delete media from Cloudinary
  deleteMedia: async (publicId: string) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  },

  // Get video poster frame
  getVideoPoster: (publicId: string, width: number = 400, height: number = 300) => {
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;
    return `${baseUrl}/video/upload/f_jpg,w_${width},h_${height},c_fill,so_0/${publicId}`;
  },

  // Generate signed upload parameters
  getSignedUploadParams: (folder: string = 'media-grid') => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder
    };
  }
};
