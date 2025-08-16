import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { hash, compare } from 'bcryptjs'
import { verify } from 'jsonwebtoken'

// Helper function to check admin authentication
async function checkAdminAuth(request: NextRequest) {
  try {
    // First check NextAuth session
    const session = await getServerSession(authOptions)
    if (session?.user) {
      // Check if user has admin role
      await connectDB()
      const user = await User.findById(session.user.id).select('role')
      if (user?.role === 'admin') {
        return { isAdmin: true, userId: session.user.id }
      }
    }

    // Check custom admin session
    const adminSession = request.cookies.get('admin-session')?.value
    if (adminSession) {
      const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
      if (decoded?.isAdmin) {
        return { isAdmin: true, userId: decoded.userId }
      }
    }

    return { isAdmin: false, userId: null }
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return { isAdmin: false, userId: null }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication first
    const { isAdmin, userId } = await checkAdminAuth(request)

    if (isAdmin) {
      // Admins can access any user profile
      await connectDB()
      const user = await User.findById(params.id).select('-password')

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json(user)
    }

    // For non-admin users, check NextAuth session and allow access to own profile
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only access their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const user = await User.findById(params.id).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const { isAdmin, userId } = await checkAdminAuth(request)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Admins can update any user profile
    // No need to check if the user is updating their own profile

    const body = await request.json()
    const { name, email, phone, currentPassword, newPassword, ...otherFields } = body

    await connectDB()

    const user = await User.findById(params.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For admin users, allow MongoDB update operations
    if (isAdmin && Object.keys(otherFields).length > 0) {
      // Use findByIdAndUpdate for MongoDB operations like $addToSet
      const updateResult = await User.findByIdAndUpdate(
        params.id,
        otherFields,
        { new: true, runValidators: true }
      ).select('-password')

      if (!updateResult) {
        return NextResponse.json({ error: 'User update failed' }, { status: 500 })
      }

      return NextResponse.json(updateResult)
    }

    // Handle basic field updates for non-admin or basic updates
    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email
    if (phone !== undefined) user.phone = phone

    // Handle password change
    if (newPassword && currentPassword) {
      // Verify current password
      const isCurrentPasswordValid = await compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      // Hash new password
      user.password = await hash(newPassword, 12)
    }

    await user.save()

    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const { isAdmin } = await checkAdminAuth(request)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await connectDB()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json(
        { error: 'Хэрэглэгч олдсонгүй' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Хэрэглэгч амжилттай устгагдлаа' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Серверийн алдаа' },
      { status: 500 }
    )
  }
}
