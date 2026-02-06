'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Eye, EyeOff, User } from 'lucide-react'
import { auth } from '@/lib/supabase'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

// Animated Eye Components
const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "#1e1e2e", forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const pupilRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY }
    }
    const pupil = pupilRef.current.getBoundingClientRect()
    const pupilCenterX = pupil.left + pupil.width / 2
    const pupilCenterY = pupil.top + pupil.height / 2
    const deltaX = mouseX - pupilCenterX
    const deltaY = mouseY - pupilCenterY
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
    const angle = Math.atan2(deltaY, deltaX)
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
  }

  const pupilPosition = calculatePupilPosition()

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "#1e1e2e", isBlinking = false, forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const eyeRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY }
    }
    const eye = eyeRef.current.getBoundingClientRect()
    const eyeCenterX = eye.left + eye.width / 2
    const eyeCenterY = eye.top + eye.height / 2
    const deltaX = mouseX - eyeCenterX
    const deltaY = mouseY - eyeCenterY
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
    const angle = Math.atan2(deltaY, deltaX)
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance }
  }

  const pupilPosition = calculatePupilPosition()

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  )
}

function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
  const [isBlueBlinking, setIsBlueBlinking] = useState(false)

  // Blinking effects
  useEffect(() => {
    const scheduleBlink = (setBlink) => {
      const blinkTimeout = setTimeout(() => {
        setBlink(true)
        setTimeout(() => {
          setBlink(false)
          scheduleBlink(setBlink)
        }, 150)
      }, Math.random() * 4000 + 3000)
      return blinkTimeout
    }
    const t1 = scheduleBlink(setIsPurpleBlinking)
    const t2 = scheduleBlink(setIsBlueBlinking)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Looking at each other when typing
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true)
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800)
      return () => clearTimeout(timer)
    }
  }, [isTyping])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await auth.signUp(email, password, fullName)
      if (error) throw error
      toast.success('Compte cree avec succes ! Verifiez votre email.')
      router.push('/login')
    } catch (err) {
      setError(err.message || 'Erreur lors de la creation du compte')
      toast.error('Erreur lors de l\'inscription')
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
      if (!response.ok) throw new Error('Erreur Google')
      toast.success('Inscription Google reussie !')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erreur lors de l\'inscription avec Google')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Section - Animated Characters */}
      <div className="relative hidden lg:flex flex-col justify-between bg-muted dark:bg-[#1a1a1a] p-12 text-foreground">
        <div className="relative z-20">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={150}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          {/* Cartoon Characters */}
          <div className="relative" style={{ width: '550px', height: '400px' }}>
            {/* Purple character */}
            <div
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px',
                width: '180px',
                height: isTyping ? '420px' : '380px',
                backgroundColor: '#7C3AED',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: isTyping ? `skewX(-8deg) translateX(30px)` : `skewX(0deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div className="absolute flex gap-8 transition-all duration-700 ease-in-out" style={{ left: isLookingAtEachOther ? '55px' : '45px', top: isLookingAtEachOther ? '55px' : '40px' }}>
                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking} forceLookX={isLookingAtEachOther ? 3 : undefined} forceLookY={isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isPurpleBlinking} forceLookX={isLookingAtEachOther ? 3 : undefined} forceLookY={isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Blue character */}
            <div
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2563EB',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: isLookingAtEachOther ? `skewX(8deg) translateX(15px)` : `skewX(0deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div className="absolute flex gap-6 transition-all duration-700 ease-in-out" style={{ left: isLookingAtEachOther ? '28px' : '26px', top: isLookingAtEachOther ? '20px' : '32px' }}>
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlueBlinking} forceLookX={isLookingAtEachOther ? -2 : undefined} forceLookY={isLookingAtEachOther ? -3 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isBlueBlinking} forceLookX={isLookingAtEachOther ? -2 : undefined} forceLookY={isLookingAtEachOther ? -3 : undefined} />
              </div>
            </div>

            {/* Cyan semi-circle */}
            <div className="absolute bottom-0" style={{ left: '0px', width: '240px', height: '200px', zIndex: 3, backgroundColor: '#06B6D4', borderRadius: '120px 120px 0 0' }}>
              <div className="absolute flex gap-8" style={{ left: '82px', top: '90px' }}>
                <Pupil size={12} maxDistance={5} />
                <Pupil size={12} maxDistance={5} />
              </div>
            </div>

            {/* Pink character */}
            <div className="absolute bottom-0" style={{ left: '310px', width: '140px', height: '230px', backgroundColor: '#EC4899', borderRadius: '70px 70px 0 0', zIndex: 4 }}>
              <div className="absolute flex gap-6" style={{ left: '52px', top: '40px' }}>
                <Pupil size={12} maxDistance={5} />
                <Pupil size={12} maxDistance={5} />
              </div>
              <div className="absolute w-20 h-[4px] bg-[#1e1e2e] rounded-full" style={{ left: '40px', top: '88px' }} />
            </div>
          </div>
        </div>

        <div className="relative z-20 text-center">
          <h2 className="text-2xl font-bold mb-2">Rejoignez AuditIQ</h2>
          <p className="text-muted-foreground">Auditez la fairness de vos modeles IA en quelques clics</p>
        </div>

        {/* Decorative */}
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.03] bg-[size:20px_20px]" />
      </div>

      {/* Right Section - Signup Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={180}
              height={72}
              className="object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Creer un compte</h1>
            <p className="text-muted-foreground text-sm">Commencez a auditer vos modeles gratuitement</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                  className="h-12 pl-10 bg-background border-border/60 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="h-12 bg-background border-border/60 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Au moins 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10 bg-background border-border/60 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 bg-background border-border/60 focus:border-primary"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                J'accepte les <Link href="/legal/terms" className="text-primary hover:underline">CGU</Link> et la <Link href="/legal/privacy" className="text-primary hover:underline">politique de confidentialite</Link>
              </Label>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-medium" size="lg" disabled={loading}>
              {loading ? "Creation..." : "Creer mon compte"}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Erreur Google')}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="350"
            />
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-muted-foreground mt-8">
            Deja un compte ?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
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
