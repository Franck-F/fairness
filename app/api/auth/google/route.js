import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { googleAuthSchema, validate } from '@/lib/validations'

// POST /api/auth/google - Google OAuth sign in
export async function POST(request) {
  try {
    const body = await request.json()
    const { success, errors, data: validated } = validate(googleAuthSchema, body)
    if (!success) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    const { idToken } = validated

    // Verify Google token with Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET /api/auth/google/callback - OAuth callback
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error.message}`)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
}
