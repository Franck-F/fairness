import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/blog',
  '/careers',
  '/contact',
  '/pricing',
  '/legal',
]

const PUBLIC_API_ROUTES = [
  '/api/auth',
  '/api/health',
]

function isPublicRoute(pathname) {
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return true
  }
  if (pathname.startsWith('/api/')) {
    return PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))
  }
  return false
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')
  let token = null

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '')
  }

  if (!token) {
    const supabaseAuthToken = request.cookies.get('sb-access-token')?.value
      || request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`)?.value

    if (supabaseAuthToken) {
      try {
        const parsed = JSON.parse(supabaseAuthToken)
        token = parsed?.access_token || parsed?.[0]?.access_token
      } catch {
        token = supabaseAuthToken
      }
    }
  }

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const response = NextResponse.next()
    response.headers.set('x-user-id', user.id)
    return response
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/((?!auth|health).*)',
    '/onboarding/:path*',
  ],
}
