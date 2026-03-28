import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/api-utils'
import { signinSchema, validate } from '@/lib/validations'
import { rateLimit } from '@/lib/security'

export async function POST(request) {
  try {
    const body = await request.json()
    const { success, errors, data: validated } = validate(signinSchema, body)
    if (!success) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    const { email, password } = validated

    // Rate limiting: 10 login attempts per minute per email (anti brute-force)
    const rl = rateLimit(`signin:${email.toLowerCase()}`, { maxRequests: 10, windowMs: 60000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Trop de tentatives de connexion. Reessayez dans une minute.' }, { status: 429 })
    }

    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
