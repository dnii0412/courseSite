import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        await connectDB()

        // Get user from database
        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            oauthProvider: user.oauthProvider,
            oauthId: user.oauthId,
            hasPassword: !!user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })

    } catch (error) {
        console.error('Error in /api/auth/me:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
