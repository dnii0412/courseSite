import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Media } from '@/lib/models/media';
import { cloudinaryUtils } from '@/lib/utils/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type' },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'File too large (max 10MB)' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const cloudinary = require('cloudinary').v2;

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'media-grid',
                    resource_type: file.type.startsWith('video/') ? 'video' : 'image',
                    transformation: file.type.startsWith('video/') ? undefined : [
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error: any, result: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        // Extract upload result
        const { public_id, secure_url, width, height, duration, format } = uploadResult as any;

        // Connect to database
        await connectDB();

        // Create media record
        const mediaData = {
            type: file.type.startsWith('video/') ? 'video' : 'image',
            cloudinaryPublicId: public_id,
            url: secure_url,
            posterUrl: file.type.startsWith('video/') ?
                cloudinaryUtils.getVideoPoster(public_id, width, height) : undefined,
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            width: width || 0,
            height: height || 0
        };

        const media = new Media(mediaData);
        await media.save();

        return NextResponse.json({
            success: true,
            data: media,
            message: 'Media uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Upload failed'
            },
            { status: 500 }
        );
    }
}
