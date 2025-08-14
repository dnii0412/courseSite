import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const hasToken = !!req.cookies.get('token')?.value
    if (!hasToken) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      // preserve the original path as next param
      redirectUrl.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (pathname.startsWith('/learn')) {
    const hasToken = !!req.cookies.get('token')?.value
    if (!hasToken) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''))
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/learn/:path*'],
}


