'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FloatingPathsBackground } from '@/components/ui/floating-paths'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { GLSLHills } from '@/components/ui/glsl-hills'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Brain, Shield, TrendingUp, Users, CheckCircle2, ArrowRight,
  BarChart3, FileText, Sparkles, Upload, Settings, FileCheck,
  Zap, Lock, Globe, HeadphonesIcon, Award, Clock, Play,
  ChevronRight, Activity, Cpu, Layers
} from 'lucide-react'

// Technology logos data
const technologies = [
  { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'TailwindCSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'scikit-learn', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg' },
  { name: 'Pandas', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
  { name: 'NumPy', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
  { name: 'XGBoost', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/XGBoost_logo.png' },
  { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Google Gemini', logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
]

// Steps data
const steps = [
  {
    number: '01',
    title: 'Ingestion de Données',
    description: 'Connectez vos sources de données sécurisées. AuditIQ analyse automatiquement la structure et la qualité de vos datasets.',
    icon: Upload,
    color: 'from-brand-primary to-brand-cotton',
  },
  {
    number: '02',
    title: 'Configuration',
    description: 'Sélectionnez vos modèles cibles et définissez les attributs protégés (genre, âge ...) pour l\'analyse de conformité.',
    icon: Settings,
    color: 'from-blue-500 to-brand-primary',
  },
  {
    number: '03',
    title: 'Analyse et Audit',
    description: 'Notre moteur lance une batterie de tests statistiques et d\'équité algorithmique (Fairness Metrics).',
    icon: Brain,
    color: 'from-brand-cotton to-purple-500',
  },
  {
    number: '04',
    title: 'Rapport de Conformité',
    description: 'Obtenez un rapport détaillé certifiable, avec scores de risques et recommandations d\'atténuation des biais.',
    icon: FileCheck,
    color: 'from-brand-primary to-orange-500',
  },
]

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-brand-primary selection:text-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#0A0A0B]/50 backdrop-blur-3xl">
        <div className="container mx-auto px-6 h-24 flex justify-between items-center">
          <Link href="/" className="relative group">
            <div className="absolute -inset-2 bg-brand-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={140}
              height={56}
              style={{ width: 'auto', height: 'auto' }}
              className="relative z-10 brightness-200 contrast-125"
            />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Services', href: '/pricing' },
              { label: 'Assistant IA', href: '/dashboard/chat' },
              { label: 'Conformité', href: '/dashboard/compliance' },
              { label: 'Expertise', href: '/about' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-brand-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/5 px-6 rounded-xl"
            >
              Connexion
            </Button>
            <Button
              onClick={() => router.push('/signup')}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8 rounded-xl shadow-[0_0_20px_#FF1493] ring-1 ring-white/20"
            >
              COMMENCER
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <GLSLHills width="100%" height="100%" speed={0.3} />
        </div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-cotton/10 rounded-full blur-[150px] pointer-events-none animate-pulse delay-700" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border-white/5 bg-white/5 backdrop-blur-3xl"
            >
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Plateforme de Confiance IA</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-none italic uppercase"
            >
              Auditez vos <br />
              <span className="text-brand-primary drop-shadow-[0_0_30px_#FF1493]">Algorithmes.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/40 font-display font-medium max-w-3xl mx-auto leading-tight"
            >
              La plateforme de référence pour l'audit de vos systèmes d'IA. Gérez la conformité AI Act avec précision et des recommandations de remédiation automatisées.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
            >
              <Button
                size="xl"
                onClick={() => router.push('/signup')}
                className="h-16 px-12 rounded-2xl bg-brand-primary text-white font-display font-black text-lg uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(255,20,147,0.3)] hover:scale-105 transition-all group"
              >
                DÉMARRER UN AUDIT
                <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="h-16 px-12 rounded-2xl bg-white/5 border-white/10 text-white font-display font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                DEMANDER UNE DÉMO
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Floating Decal */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden lg:block opacity-20 hover:opacity-100 transition-opacity duration-1000">
          <div className="glass-card p-4 rounded-2xl border-white/5 space-y-2">
            <div className="w-12 h-1 bg-brand-primary rounded-full" />
            <div className="w-8 h-1 bg-white/20 rounded-full" />
            <div className="text-[8px] font-black text-white/40">AUDIT EN COURS</div>
          </div>
        </div>
      </section>

      {/* Tech Pulse - Automated Carousel */}
      <section className="py-24 border-y border-white/5 bg-[#0A0A0B] overflow-hidden">
        <div className="container mx-auto px-6 mb-16 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Technologies & Intégrations</h3>
          <div className="h-px flex-1 mx-12 bg-white/5" />
          <Sparkles className="h-5 w-5 text-brand-primary animate-pulse" />
        </div>

        <div className="flex animate-scroll whitespace-nowrap gap-12">
          {[...technologies, ...technologies].map((tech, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-4 glass-card px-8 py-5 rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer group">
              <div className="w-10 h-10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                <img src={tech.logo} alt={tech.name} className="h-7 w-7 object-contain" />
              </div>
              <span className="text-xs font-display font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em]">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Notre Méthodologie */}
      <section className="py-32 relative overflow-hidden bg-[#0A0A0B]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">Notre Méthodologie</span>
            <h2 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase italic">Audit de Performance</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="glass-card h-full p-10 rounded-[3rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
                  <div className="text-8xl font-black text-white/5 absolute -top-4 -right-4 italic group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>

                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 shadow-2xl group-hover:rotate-3 transition-transform`}>
                    <step.icon className="h-8 w-8 text-black" />
                  </div>

                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight mb-4">{step.title}</h3>
                  <p className="text-sm text-white/40 font-medium leading-relaxed font-display">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Matrix */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-cotton">Conformité Totale</span>
                <h2 className="text-4xl md:text-7xl font-display font-black text-white tracking-tighter uppercase italic leading-none">Sécurisez vos IA.</h2>
              </div>
              <p className="text-xl text-white/40 font-display font-medium leading-relaxed">
                AuditIQ transforme les exigences floues du AI Act en métriques d'ingénierie concrètes. Ne craignez plus l'audit, automatisez-le.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { t: '16 Métriques', d: 'Le spectre le plus large du marché.' },
                  { t: 'Zéro Biais', d: 'Algorithmes de dé-biaisage Fairlearn intégrés.' },
                  { t: 'PDF Intelligence', d: 'Génération de rapports pour les régulateurs.' },
                  { t: 'Support Prime', d: 'Expertise humaine disponible H24.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                      <h4 className="font-display font-black text-white uppercase tracking-widest text-[10px]">{item.t}</h4>
                    </div>
                    <p className="text-xs text-white/30 font-display">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-[100px] animate-pulse" />
              <div className="glass-card rounded-[4rem] border-white/5 bg-white/5 p-12 relative z-10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/5 to-transparent" />
                <div className="relative space-y-8">
                  <div className="flex justify-between items-center">
                    <Activity className="h-8 w-8 text-brand-primary" />
                    <Badge className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary font-black uppercase tracking-widest text-[9px] px-4">EN TEMPS RÉEL</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-[84%] animate-shimmer" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-white/40 tracking-[0.2em]">
                      <span>INDICE D'ÉQUITÉ</span>
                      <span>84.2%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-10">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <TrendingUp className="h-5 w-5 text-brand-cotton mb-3" />
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Efficacité</p>
                      <p className="text-2xl font-display font-black text-white">96.4%</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <Shield className="h-5 w-5 text-brand-primary mb-3" />
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Protection</p>
                      <p className="text-2xl font-display font-black text-white">ACTIF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Pulsating CTA */}
      <section className="py-48 relative overflow-hidden bg-[#0A0A0B]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto glass-card p-16 md:p-24 rounded-[5rem] border-white/5 bg-gradient-to-tr from-brand-primary/10 to-transparent backdrop-blur-3xl text-center space-y-12 relative overflow-hidden group">
            <div className="absolute -inset-20 bg-brand-primary/5 rounded-full blur-[100px] animate-pulse" />

            <div className="relative z-10 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">Prêt à commencer ?</span>
              <h2 className="text-5xl md:text-8xl font-display font-black text-white uppercase italic tracking-tighter leading-none">
                Lancez votre <br />
                <span className="text-brand-primary">premier audit.</span>
              </h2>
              <p className="text-xl text-white/40 font-display font-medium max-w-2xl mx-auto leading-tight pt-4">
                Rejoignez les leaders de l'IA éthique. AuditIQ synchronise vos modèles avec les standards du futur, dès aujourd'hui.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Button
                size="xl"
                onClick={() => router.push('/signup')}
                className="h-20 px-16 rounded-3xl bg-brand-primary text-white font-display font-black text-xl uppercase tracking-[0.3em] shadow-[0_25px_50px_rgba(255,20,147,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                CRÉER UN COMPTE
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => router.push('/contact')}
                className="h-20 px-12 rounded-3xl bg-white/5 border-white/10 text-white font-display font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                CONTACTER L'ÉQUIPE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Futuristic Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#0A0A0B]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2 space-y-8">
              <Image
                src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
                alt="AuditIQ Logo"
                width={180}
                height={72}
                style={{ width: 'auto', height: 'auto' }}
                className="brightness-200"
              />
              <p className="text-white/30 font-display font-medium max-w-sm leading-relaxed">
                Souveraineté éthique et conformité IA automatisée. L'infrastructure critique pour une intelligence artificielle responsable.
              </p>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Fonctionnalités</h5>
              <ul className="space-y-4">
                {['Audit Fairness', 'Analyse What-If', 'Dé-biaisage', 'Assistant IA'].map((l) => (
                  <li key={l}><Link href="#" className="text-sm font-display font-medium text-white/40 hover:text-brand-primary transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Ressources</h5>
              <ul className="space-y-4">
                {['Documentation', 'API Alpha', 'Status', 'Sécurité'].map((l) => (
                  <li key={l}><Link href="#" className="text-sm font-display font-medium text-white/40 hover:text-brand-primary transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/10">
            <span>© 2026 AuditIQ SAS. Tous droits réservés.</span>
            <div className="flex gap-10">
              <Link href="/legal/privacy" className="hover:text-brand-primary">Politique de confidentialité</Link>
              <Link href="/legal/terms" className="hover:text-brand-primary">Conditions générales</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Aesthetic Styles */}
      <style jsx global>{`
        /* Font loaded via next/font in layout.js */
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 20, 147, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite linear;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  )
}
