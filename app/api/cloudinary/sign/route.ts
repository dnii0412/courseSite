import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cloudinaryUtils } from '@/lib/utils/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const allowPublic = (process.env.ALLOW_PUBLIC_UPLOADS === 'true' || process.env.ALLOW_PUBLIC_SIGN === 'true') && process.env.NODE_ENV !== 'production'
    let isAuthorized = false
    if (allowPublic) {
      isAuthorized = true
    } else {
      try {
        const decoded = await verifyToken(request)
        const role = String((decoded as any)?.role || '').toUpperCase()
        const allowNonAdmin = process.env.ALLOW_NON_ADMIN_UPLOADS === 'true'
        if (decoded && (role === 'admin' || allowNonAdmin)) {
          isAuthorized = true
        }
      } catch (authError) {
        console.warn('Auth error in cloudinary sign:', authError)
        // Continue with public access if auth fails
        if (allowPublic) {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({})) as { folder?: string }
    const folder = body.folder || 'media-grid'

    try {
      const params = cloudinaryUtils.getSignedUploadParams(folder)

      return NextResponse.json({
        success: true,
        data: {
          timestamp: params.timestamp,
          signature: params.signature,
          apiKey: params.apiKey,
          cloudName: params.cloudName,
          folder: params.folder,
          uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default',
        },
      })
    } catch (signatureError) {
      console.error('Error generating signature:', signatureError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate upload signature' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error in cloudinary sign:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


