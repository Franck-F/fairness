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
import { Mail, Lock, User, ChevronRight, Activity, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { auth } from '@/lib/supabase'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await auth.signUp(email, password, fullName)
      if (error) throw error
      toast.success('Compte créé avec succès ! Vérifiez vos emails.')
      router.push('/login')
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'inscription.')
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
      <div className="hidden lg:flex flex-[1] flex-col justify-between p-20 relative border-r border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
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
          <h1 className="text-4xl font-display font-bold leading-tight">
            Rejoignez les experts de la <span className="text-brand-primary">Confiance IA</span>.
          </h1>
          <div className="space-y-4">
            {[
              'Audit automatisé de vos modèles ML',
              'Génération de rapports de conformité',
              'Détection et mitigation des biais',
              'Collaboration sécurisée en équipe'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                <span className="text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/20">
          © 2026 AuditIQ Inc. Tous droits réservés.
        </div>
      </div>

      {/* Right Section: Form Container */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-50 bg-[#0A0A0B]">
        <div className="w-full max-w-[500px] space-y-10">

          <div className="space-y-2 text-center lg:text-left">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={140}
              height={56}
              className="brightness-200 mb-6 lg:mx-0 mx-auto"
            />
            <h2 className="text-2xl font-semibold tracking-tight">Créer un compte AuditIQ</h2>
            <p className="text-white/40">Démarrez votre essai gratuit de 14 jours. Aucune CB requise.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-white/40 ml-1">Nom complet</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
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
              <Label className="text-xs font-medium uppercase tracking-wider text-white/40 ml-1">Mot de passe</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-white/40 ml-1">Confirmation</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="col-span-2 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox id="terms" required className="mt-1 rounded border-white/20 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary" />
                <Label htmlFor="terms" className="text-xs text-white/60 leading-relaxed cursor-pointer">
                  J'accepte les <Link href="/legal/terms" className="text-brand-primary hover:underline">Conditions Générales d'Utilisation</Link> et la <Link href="/legal/privacy" className="text-brand-primary hover:underline">Politique de Confidentialité</Link> d'AuditIQ.
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="col-span-2 w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-95 mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-spin" />
                  INSCRIPTION...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  CRÉER MON COMPTE
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
              <span className="bg-[#0A0A0B] px-4 text-white/20">Ou s'inscrire avec</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Erreur Google.')}
              theme="filled_black"
              shape="circle"
              text="signup_with"
              width="320"
            />
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-white/40">
              Déjà un compte ? {" "}
              <Link href="/login" className="text-brand-primary hover:text-white transition-colors font-medium">Se connecter</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <SignupForm />
    </GoogleOAuthProvider>
  )
}
