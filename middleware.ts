import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // Check for NextAuth session cookies
  const hasNextAuthSession = !!req.cookies.get('next-auth.session-token')?.value || 
                            !!req.cookies.get('__Secure-next-auth.session-token')?.value

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!hasNextAuthSession) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Protect learn routes
  if (pathname.startsWith('/learn')) {
    if (!hasNextAuthSession) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Allow admin login page to be accessed without session
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/learn/:path*'],
}


