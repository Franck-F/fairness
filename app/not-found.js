'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl text-center">
            {/* Logo */}
            <Link href="/" className="inline-block mb-8">
              <Image
                src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
                alt="AuditIQ Logo"
                width={180}
                height={72}
                className="object-contain mx-auto"
              />
            </Link>

            {/* 404 Animation */}
            <div 
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-white text-7xl sm:text-8xl md:text-9xl font-bold pt-6 sm:pt-8 drop-shadow-lg">
                404
              </h1>
            </div>

            <div className="mt-[-30px] bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                Page introuvable
              </h2>
              <p className="mb-8 text-white/80 text-lg">
                Oups ! La page que vous recherchez n'existe pas ou a ete deplacee.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Page precedente
                </Button>
                <Button
                  size="lg"
                  onClick={() => router.push('/')}
                  className="gap-2 bg-white text-primary hover:bg-white/90"
                >
                  <Home className="h-5 w-5" />
                  Retour a l'accueil
                </Button>
              </div>

              {/* Suggested links */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-white/60 text-sm mb-4">Pages populaires :</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/dashboard" className="text-white/80 hover:text-white text-sm underline underline-offset-4">
                    Dashboard
                  </Link>
                  <Link href="/pricing" className="text-white/80 hover:text-white text-sm underline underline-offset-4">
                    Tarifs
                  </Link>
                  <Link href="/about" className="text-white/80 hover:text-white text-sm underline underline-offset-4">
                    A propos
                  </Link>
                  <Link href="/contact" className="text-white/80 hover:text-white text-sm underline underline-offset-4">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
