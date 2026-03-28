import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Routes that don't require authentication
const PUBLIC_API_ROUTES = [
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/google',
  '/api/auth/forgot-password',
  '/api/auth/send-verification',
  '/api/auth/verify-email',
  '/api/auth/signout',
]

const PUBLIC_PAGES = [
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
  '/legal/cgu',
  '/legal/privacy',
  '/legal/terms',
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

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const method = request.method

  // Allow public pages
  if (PUBLIC_PAGES.some(route => pathname === route)) {
    return NextResponse.next()
  }

  // Allow public API routes (still subject to CSRF check below)
  const isPublicApi = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))

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

  // Public API routes pass CSRF but skip auth
  if (isPublicApi) {
    return NextResponse.next()
  }

  // Public API v1 routes - authenticated via X-API-Key (handled in route handlers)
  if (pathname.startsWith('/api/v1/')) {
    return NextResponse.next()
  }

  // Protected API routes - verify Bearer token
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token || token.length < 20) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify token with Supabase
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
      }

      // Add user info to headers for downstream routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.id)
      requestHeaders.set('x-user-email', user.email)

      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    } catch {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }

  // Protected dashboard pages
  if (pathname.startsWith('/dashboard')) {
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
}
