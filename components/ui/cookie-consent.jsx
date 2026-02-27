'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('auditiq-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('auditiq-cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('auditiq-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/20 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Nous utilisons des cookies
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic.
                Consultez notre{' '}
                <Link href="/legal/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  politique de confidentialité
                </Link>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={decline}
              className="flex-1 sm:flex-none text-sm"
            >
              Refuser
            </Button>
            <Button
              size="sm"
              onClick={accept}
              className="flex-1 sm:flex-none text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
