import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Media } from '@/lib/models/media';
import { cloudinaryUtils } from '@/lib/utils/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - List all media
export async function GET() {
  try {
    await connectDB();
    
    const media = await Media.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

// POST - Upload new media
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { type, cloudinaryPublicId, url, posterUrl, alt, width, height } = body;

    // Validate required fields
    if (!type || !cloudinaryPublicId || !url || !alt || !width || !height) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if media already exists
    const existingMedia = await Media.findOne({ cloudinaryPublicId });
    if (existingMedia) {
      return NextResponse.json(
        { success: false, error: 'Media already exists' },
        { status: 409 }
      );
    }

    // Create new media
    const media = new Media({
      type,
      cloudinaryPublicId,
      url,
      posterUrl,
      alt,
      width,
      height
    });

    await media.save();

    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create media' },
      { status: 500 }
    );
  }
}

// DELETE - Delete media
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Media ID required' },
        { status: 400 }
      );
    }

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await cloudinaryUtils.deleteMedia(media.cloudinaryPublicId);
    
    // Delete from database
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
