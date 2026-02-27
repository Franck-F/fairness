import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const isPlaceholderKey = !process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your-service-role-key'
const authClient = isPlaceholderKey
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : supabase

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await authClient.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
    }

    const dbClient = isPlaceholderKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      })
      : supabase

    const formData = await request.formData()
    const file = formData.get('avatar')

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format non supporte. Utilisez JPG, PNG, WebP ou GIF.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image trop volumineuse (max 5 Mo)' }, { status: 400 })
    }

    // Ensure avatars bucket exists (service role only)
    if (!isPlaceholderKey) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        allowedMimeTypes: ALLOWED_TYPES,
        fileSizeLimit: MAX_SIZE,
      }).catch(() => {
        // Bucket may already exist, ignore error
      })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `${user.id}/avatar_${Date.now()}.${ext}`

    // Delete old avatar if exists
    const oldAvatarUrl = user.user_metadata?.avatar_url
    if (oldAvatarUrl && oldAvatarUrl.includes('/avatars/')) {
      const oldPath = oldAvatarUrl.split('/avatars/').pop()
      if (oldPath) {
        await dbClient.storage.from('avatars').remove([decodeURIComponent(oldPath)]).catch(() => {})
      }
    }

    // Upload new avatar
    const fileBuffer = await file.arrayBuffer()
    const { error: uploadError } = await dbClient.storage
      .from('avatars')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Avatar upload error:', uploadError)
      return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = dbClient.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update user metadata with avatar URL
    const adminClient = isPlaceholderKey
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      })
      : supabase

    const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, avatar_url: publicUrl }
    })

    // Fallback: if admin update fails (no service key), try client-side update
    if (updateError) {
      const userClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      })
      const { error: clientUpdateError } = await userClient.auth.updateUser({
        data: { avatar_url: publicUrl }
      })
      if (clientUpdateError) {
        console.error('Avatar metadata update error:', clientUpdateError)
        // Still return success since the file was uploaded
      }
    }

    return NextResponse.json({
      success: true,
      avatar_url: publicUrl,
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
