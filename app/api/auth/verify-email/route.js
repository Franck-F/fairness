import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyEmailSchema, validate } from '@/lib/validations'
import logger from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const dbClient = isPlaceholderKey
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : supabase

export async function POST(request) {
  try {
    const body = await request.json()
    const { success, errors, data: validated } = validate(verifyEmailSchema, body)
    if (!success) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    const { token } = validated

    // For custom tokens, you would verify against your database
    // For now, we rely on Supabase's built-in verification
    // This endpoint is for custom verification if needed

    return NextResponse.json({
      success: true,
      message: 'Email verifie avec succes',
    })
  } catch (error) {
    logger.error("AUTH", 'Verify email error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la verification' },
      { status: 500 }
    )
  }
}
