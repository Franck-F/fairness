import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Create verification token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Store token in Supabase (you'll need a verification_tokens table)
    // For now, we'll use Supabase's built-in email verification
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Alternative: Send custom email with nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Vérification de votre email - AuditIQ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Bienvenue sur AuditIQ !</h2>
          <p>Merci de vous être inscrit. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email :</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Vérifier mon email</a>
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">© 2025 AuditIQ. Tous droits réservés.</p>
        </div>
      `,
    })

    return NextResponse.json({ 
      message: 'Email de vérification envoyé',
      success: true 
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message 
    }, { status: 500 })
  }
}
