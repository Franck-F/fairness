'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Mail, Lock, ChevronRight, Activity, ArrowLeft, ShieldCheck } from 'lucide-react'
import { auth } from '@/lib/supabase'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await auth.signIn(email, password)
      if (error) throw error
      toast.success('Connexion réussie.')
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentification échouée.')
      toast.error('Accès refusé.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      })
      if (!response.ok) throw new Error('Auth Failed')
      toast.success('Connexion Google réussie.')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erreur de connexion Google.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-brand-primary">

      {/* Left Section: Professional Visual */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-between p-20 relative border-r border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#0A0A0B] to-transparent"></div>
        </div>

        <div className="relative z-10">
          <Link href="/" className="group flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-primary transition-colors">
              <ArrowLeft className="h-4 w-4 text-white/40 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">Retour à l'accueil</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-xl">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-brand-primary" />
          </div>
          <h1 className="text-5xl font-display font-bold leading-tight">
            L'Audit IA <span className="text-brand-primary">Nouvelle Génération</span>.
          </h1>
          <p className="text-xl text-white/40 leading-relaxed">
            Garantissez la conformité et l'équité de vos algorithmes avec la plateforme AuditIQ.
            Détectez, analysez et corrigez les biais en temps réel.
          </p>

          <div className="flex gap-4 pt-4">
            {['Conformité AI Act', 'Analyses de Biais', 'Rapports PDF'].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/20">
          © 2026 AuditIQ Inc. Tous droits réservés.
        </div>
      </div>

      {/* Right Section: Form Container */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-50 bg-[#0A0A0B]">
        <div className="w-full max-w-[420px] space-y-10">

          <div className="space-y-2 text-center lg:text-left">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={140}
              height={56}
              className="brightness-200 mb-6 lg:mx-0 mx-auto"
            />
            <h2 className="text-2xl font-semibold tracking-tight">Bienvenue sur AuditIQ</h2>
            <p className="text-white/40">Connectez-vous pour accéder à votre tableau de bord.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-white/40 ml-1">Email Professionnel</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                    placeholder="nom@entreprise.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-xs font-medium uppercase tracking-wider text-white/40">Mot de passe</Label>
                  <Link href="/forgot-password" size="sm" className="text-xs text-brand-primary/80 hover:text-brand-primary transition-colors">Mot de passe oublié ?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 pr-12 bg-white/5 border-white/10 rounded-xl focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {/* Simple toggle text or icon if preferred, using text for clean look or icon imports from visual */}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{showPassword ? 'CACHER' : 'VOIR'}</span>
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  CONNEXION...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  SE CONNECTER
                  <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0A0B] px-4 text-white/20">Ou continuer avec</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Erreur Google.')}
              theme="filled_black"
              shape="circle"
              text="continue_with"
              width="320"
            />
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-white/40">
              Pas encore de compte ? {" "}
              <Link href="/signup" className="text-brand-primary hover:text-white transition-colors font-medium">Créer un compte</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <LoginForm />
    </GoogleOAuthProvider>
  )
}
