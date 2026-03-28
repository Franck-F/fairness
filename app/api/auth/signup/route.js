import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/api-utils'
import { signupSchema, validate } from '@/lib/validations'

export async function POST(request) {
  try {
    const body = await request.json()
    const { success, errors, data: validated } = validate(signupSchema, body)
    if (!success) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    const { email, password, fullName } = validated

    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
