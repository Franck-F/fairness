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
  '/onboarding',
  '/legal',
  '/legal/cgu',
  '/legal/privacy',
  '/legal/terms',
]

const PUBLIC_API_ROUTES = [
  '/api/auth',
  '/api/health',
]

// Allowed origins for CSRF check
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://ai-auditiq.netlify.app',
]

function isAllowedOrigin(origin) {
  if (!origin) return true // same-origin requests don't send Origin header
  if (ALLOWED_ORIGINS.includes(origin)) return true
  // Allow all *.vercel.app subdomains
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true
  // Allow custom domain from env
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl && origin === appUrl) return true
  return false
}

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
  const method = request.method

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // ── CSRF Protection ──
  // Block state-changing requests (POST/PUT/DELETE) from unknown origins
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')

    // API v1 routes use X-API-Key, not origin-based auth - skip CSRF for them
    if (!pathname.startsWith('/api/v1/')) {
      if (origin && !isAllowedOrigin(origin)) {
        return NextResponse.json(
          { error: 'Forbidden: invalid origin' },
          { status: 403 }
        )
      }
      // If no origin header, check referer as fallback
      if (!origin && referer) {
        try {
          const refererOrigin = new URL(referer).origin
          if (!isAllowedOrigin(refererOrigin)) {
            return NextResponse.json(
              { error: 'Forbidden: invalid referer' },
              { status: 403 }
            )
          }
        } catch {
          // malformed referer - block
          return NextResponse.json(
            { error: 'Forbidden: invalid referer' },
            { status: 403 }
          )
        }
      }
    }
  }

  // Public API v1 routes - authenticated via X-API-Key (handled in route handlers)
  if (pathname.startsWith('/api/v1/')) {
    return NextResponse.next()
  }

  // Token extraction: Authorization header first, then cookies
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
