import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

// Get user from auth header
export async function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing or invalid authorization header' }
  }

  const token = authHeader.replace('Bearer ', '')
  
  const { data: { user }, error } = await supabaseServer.auth.getUser(token)
  
  return { user, error }
}

export function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status })
}
