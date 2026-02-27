'use client'

import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="bg-card border border-border rounded-xl p-8 max-w-lg space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            Une erreur est survenue
          </h2>
          <p className="text-muted-foreground text-sm">
            {error?.message || 'Le chargement de cette page a echoue. Veuillez reessayer.'}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reessayer
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="gap-2">
              <Home className="w-4 h-4" />
              Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
