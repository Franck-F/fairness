import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/api-utils'

export async function POST(request) {
  try {
    const { error } = await supabaseServer.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
