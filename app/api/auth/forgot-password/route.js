import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Use Supabase's built-in password reset
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) {
      console.error('Supabase reset error:', error)
      // Don't reveal if email exists or not for security
    }

    // Also send a custom email notification
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        port: parseInt(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"AuditIQ" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Reinitialisation de votre mot de passe - AuditIQ',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #1a1a1a; border-radius: 12px; padding: 40px; border: 1px solid #333;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png" alt="AuditIQ" style="height: 50px;">
              </div>
              
              <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 20px; text-align: center;">Reinitialisation du mot de passe</h1>
              
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Vous avez demande la reinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
              </p>
              
              <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                <strong style="color: #E606B6;">Note:</strong> Vous allez recevoir un email de Supabase avec le lien de reinitialisation. Verifiez votre boite de reception et vos spams.
              </p>
              
              <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">
              
              <p style="color: #666; font-size: 12px; text-align: center;">
                Si vous n'avez pas demande cette reinitialisation, ignorez cet email.
              </p>
              
              <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
                &copy; 2025 AuditIQ. Tous droits reserves.
              </p>
            </div>
          </body>
          </html>
        `,
      })
    } catch (emailError) {
      console.error('Custom email error:', emailError)
      // Continue even if custom email fails - Supabase will send the actual reset link
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, vous recevrez un lien de reinitialisation.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
