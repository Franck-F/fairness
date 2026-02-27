'use client'

import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center" role="alert">
          <div className="glass-card rounded-xl p-8 max-w-md space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">
              Une erreur est survenue
            </h3>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message || 'Quelque chose s\'est mal passe. Veuillez reessayer.'}
            </p>
            <Button
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reessayer
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" role="alert">
      <div className="glass-card rounded-xl p-8 max-w-md space-y-4">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
        <h3 className="text-lg font-semibold">Erreur</h3>
        <p className="text-muted-foreground text-sm">{error?.message}</p>
        {resetErrorBoundary && (
          <Button variant="outline" onClick={resetErrorBoundary}>
            Reessayer
          </Button>
        )}
      </div>
    </div>
  )
}

export { ErrorBoundary, ErrorFallback }
