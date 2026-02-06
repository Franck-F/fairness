import { NextResponse } from 'next/server'

export function middleware(request) {
  // This is a placeholder - client-side auth protection will be handled in page components
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
}
