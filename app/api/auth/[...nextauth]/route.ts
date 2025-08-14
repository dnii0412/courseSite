import { authOptions } from '@/lib/auth-config'
import NextAuth from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

const handler = NextAuth(authOptions)

// Wrap the handler with error handling
async function wrappedHandler(req: NextRequest, context: any) {
    try {
        console.log('NextAuth route called:', req.url)
        const result = await handler(req, context)
        console.log('NextAuth route completed successfully')
        return result
    } catch (error) {
        console.error('NextAuth route error:', error)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
}

export { wrappedHandler as GET, wrappedHandler as POST }