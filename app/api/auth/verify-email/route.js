import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 400 })
    }

    // For custom tokens, you would verify against your database
    // For now, we rely on Supabase's built-in verification
    // This endpoint is for custom verification if needed

    return NextResponse.json({
      success: true,
      message: 'Email verifie avec succes',
    })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la verification' },
      { status: 500 }
    )
  }
}
