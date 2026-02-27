'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Animated gradient orbs - CSS only */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #e208a1 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
          animation: 'orb-float-1 8s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #EA60D1 0%, transparent 70%)',
          bottom: '-5%',
          right: '-5%',
          animation: 'orb-float-2 10s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-15 blur-[80px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #e208a1 0%, #EA60D1 50%, transparent 70%)',
          top: '50%',
          left: '60%',
          animation: 'orb-float-3 12s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* Large 404 with gradient */}
        <h1
          className="text-[10rem] sm:text-[12rem] md:text-[14rem] font-extrabold leading-none select-none tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #e208a1 0%, #EA60D1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 mb-3">
          Page introuvable
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          La page que vous recherchez n&apos;existe pas ou a&nbsp;été déplacée.
        </p>

        {/* Button */}
        <Button
          size="lg"
          onClick={() => router.push('/')}
          className="gap-2"
          asChild
        >
          <Link href="/">
            <Home className="h-5 w-5" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>

      {/* Keyframes for animated orbs */}
      <style jsx global>{`
        @keyframes orb-float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(60px, 40px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 60px) scale(0.95);
          }
        }

        @keyframes orb-float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-50px, -30px) scale(1.05);
          }
          66% {
            transform: translate(40px, -50px) scale(0.9);
          }
        }

        @keyframes orb-float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-70px, 40px) scale(1.15);
          }
        }
      `}</style>
    </div>
  )
}
