import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET() {
  const frontend = { status: 'healthy', timestamp: new Date().toISOString() }

  let backend = { status: 'unknown' }
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { next: { revalidate: 0 } })
    if (res.ok) {
      backend = await res.json()
    } else {
      backend = { status: 'unhealthy', code: res.status }
    }
  } catch {
    backend = { status: 'unreachable' }
  }

  return NextResponse.json({
    status: backend.status === 'healthy' ? 'healthy' : 'degraded',
    frontend,
    backend,
  })
}
