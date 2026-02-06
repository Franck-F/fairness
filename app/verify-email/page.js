'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check URL hash for Supabase confirmation
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (type === 'signup' || type === 'email_change') {
      if (accessToken) {
        setStatus('success')
        setMessage('Votre email a ete verifie avec succes !')
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setStatus('error')
        setMessage('Le lien de verification est invalide ou a expire.')
      }
    } else if (type === 'recovery') {
      // Redirect to reset password page
      router.push(`/reset-password${window.location.hash}`)
    } else {
      // Check for token in query params (custom verification)
      const token = searchParams.get('token')
      if (token) {
        verifyToken(token)
      } else {
        setStatus('error')
        setMessage('Aucun token de verification trouve.')
      }
    }
  }, [searchParams, router])

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setMessage('Votre email a ete verifie avec succes !')
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'La verification a echoue.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Une erreur est survenue lors de la verification.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={180}
              height={72}
              className="object-contain"
            />
          </Link>
        </div>

        <Card className="bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {status === 'verifying' && 'Verification en cours...'}
              {status === 'success' && 'Email verifie !'}
              {status === 'error' && 'Erreur de verification'}
            </CardTitle>
            <CardDescription>
              {status === 'verifying' && 'Veuillez patienter'}
              {status === 'success' && 'Redirection vers le dashboard...'}
              {status === 'error' && 'Un probleme est survenu'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {status === 'verifying' && (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-muted-foreground">{message}</p>
                <Button onClick={() => router.push('/dashboard')} className="w-full">
                  Acceder au Dashboard
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-muted-foreground">{message}</p>
                <div className="space-y-3">
                  <Button onClick={() => router.push('/signup')} variant="outline" className="w-full">
                    Creer un nouveau compte
                  </Button>
                  <Button onClick={() => router.push('/login')} className="w-full">
                    Se connecter
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
