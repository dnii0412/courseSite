import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { Media } from '@/lib/models/media'
import { cloudinaryUtils } from '@/lib/utils/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename, contentType } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Create media record
    const media = await Media.create({
      filename,
      contentType,
      uploadedBy: session.user.id,
      status: 'uploading'
    })

    // Get signed upload parameters
    const signedParams = cloudinaryUtils.getSignedUploadParams('media-grid')

    return NextResponse.json({
      uploadParams: signedParams,
      mediaId: media._id
    })
  } catch (error) {
    console.error('Error creating upload URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
