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
import { Mail, Lock, User, ChevronRight, Activity, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { auth } from '@/lib/supabase'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { AnimatedCharacters } from '@/components/ui/animated-characters'

function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isTypingEmail, setIsTypingEmail] = useState(false)
  const [isTypingPassword, setIsTypingPassword] = useState(false)

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

      {/* Left Section: Animated Characters */}
      <div className="hidden lg:flex flex-[1] flex-col justify-between p-12 relative bg-[#111113] border-r border-white/5 text-white">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-cotton/5 rounded-full blur-3xl" />

        <div className="relative z-20">
          <Link href="/" className="group flex items-center gap-3 w-fit">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={120}
              height={48}
              style={{ width: 'auto', height: 'auto' }}
              className="brightness-200"
            />
          </Link>
        </div>

        <div className="relative z-20 flex items-end justify-center">
          <AnimatedCharacters
            isTyping={isTypingEmail || isTypingPassword}
            showPassword={showPassword}
            passwordLength={password.length}
          />
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-white/60">
          <Link href="/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
          <Link href="/legal/terms" className="hover:text-white transition-colors">CGU</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
              style={{ width: 'auto', height: 'auto' }}
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
                  onFocus={() => setIsTypingEmail(true)}
                  onBlur={() => setIsTypingEmail(false)}
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  className="h-12 pl-12 pr-12 bg-white/5 border-white/10 rounded-xl focus:ring-brand-primary focus:border-brand-primary transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
