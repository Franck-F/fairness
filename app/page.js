'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FloatingPathsBackground } from '@/components/ui/floating-paths'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Brain, Shield, TrendingUp, Users, CheckCircle2, ArrowRight, 
  BarChart3, FileText, Sparkles, Upload, Settings, FileCheck,
  Zap, Lock, Globe, HeadphonesIcon, Award, Clock, Play
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
    title: 'Uploadez vos donnees',
    description: 'Importez votre dataset CSV ou Excel en quelques clics. Notre systeme detecte automatiquement les types de colonnes.',
    icon: Upload,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    title: 'Configurez l\'audit',
    description: 'Selectionnez la variable cible, les attributs sensibles (genre, age, etc.) et les metriques de fairness a calculer.',
    icon: Settings,
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    title: 'Entrainement ML',
    description: 'Notre backend Python entraine automatiquement un modele (LogisticRegression ou XGBoost) sur vos donnees.',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
  },
  {
    number: '04',
    title: 'Analysez les resultats',
    description: 'Visualisez les 16 metriques de fairness, le score global, et recevez des recommandations personnalisees.',
    icon: FileCheck,
    color: 'from-green-500 to-teal-500',
  },
]

// Why AuditIQ data
const whyAuditIQ = [
  {
    icon: Shield,
    title: 'Conformite AI Act',
    description: 'Preparez-vous aux exigences du reglement europeen sur l\'IA avec des audits complets et des rapports detailles.',
  },
  {
    icon: Zap,
    title: 'Rapide et Simple',
    description: 'Obtenez des resultats en quelques minutes, pas en semaines. Interface intuitive, aucune expertise technique requise.',
  },
  {
    icon: Lock,
    title: 'Securite des Donnees',
    description: 'Vos donnees restent les votres. Hebergement europeen, chiffrement de bout en bout, conformite RGPD.',
  },
  {
    icon: Globe,
    title: '16 Metriques Standards',
    description: 'Demographic Parity, Equal Opportunity, Equalized Odds et 13 autres metriques basees sur les standards academiques.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Expert',
    description: 'Une equipe d\'experts en IA ethique disponible pour vous accompagner dans vos demarches de conformite.',
  },
  {
    icon: Award,
    title: 'Recommandations Actionnables',
    description: 'Recevez des recommandations concretes avec du code Python Fairlearn pour corriger les biais detectes.',
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={140}
              height={56}
              priority
              className="object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">A Propos</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tarifs</Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => router.push('/login')}>Connexion</Button>
            <Button onClick={() => router.push('/signup')}>Commencer</Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Floating Paths */}
      <FloatingPathsBackground position={1} className="min-h-screen pt-20">
        <section className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              Detectez les Biais dans
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Vos Systemes d'IA
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Plateforme SaaS d'audit de fairness pour garantir l'équite et la conformité
              de vos modèles de Machine Learning. Conforme AI Act 2024.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Button size="lg" onClick={() => router.push('/signup')} className="text-lg px-8 h-14">
                Demarrer l'Audit Gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/contact')} className="text-lg px-8 h-14">
                Demander une Demo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Conforme AI Act</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>16 Metriques</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>XGBoost & LogReg</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Rapports PDF</span>
              </div>
            </motion.div>
          </div>
        </section>
      </FloatingPathsBackground>

      {/* Tech Stack Carousel */}
      <section className="py-16 bg-muted/30 overflow-hidden border-y border-border">
        <div className="container mx-auto px-4 mb-8">
          <p className="text-center text-sm text-muted-foreground uppercase tracking-wider">
            Construit avec les meilleures technologies
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />
          
          <div className="flex animate-scroll">
            {[...technologies, ...technologies].map((tech, index) => (
              <div key={`${tech.name}-${index}`} className="flex-shrink-0 mx-8 flex flex-col items-center gap-2">
                <div className="w-16 h-16 flex items-center justify-center bg-background rounded-xl shadow-sm border border-border p-3">
                  <img src={tech.logo} alt={tech.name} className="w-10 h-10 object-contain dark:invert-0" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
                <span className="text-xs text-muted-foreground">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Comment ca marche ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              En 4 etapes simples, auditez la fairness de vos modeles d'IA
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300 bg-card">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`} />
                  <div className="text-6xl font-bold text-muted/20 absolute -top-2 -right-2">
                    {step.number}
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AuditIQ Section */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Pourquoi choisir AuditIQ ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plateforme complete pour une IA responsable et conforme
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyAuditIQ.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow bg-card">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Fonctionnalites Completes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour auditer vos modeles d'IA
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: '16 Metriques de Fairness', desc: 'Demographic Parity, Equal Opportunity, Equalized Odds et plus' },
              { icon: TrendingUp, title: 'ML Training Automatique', desc: 'LogisticRegression et XGBoost via FastAPI/Python' },
              { icon: Brain, title: 'Assistant IA Gemini', desc: 'Chat intelligent pour interpreter vos resultats' },
              { icon: FileText, title: 'Rapports PDF/TXT', desc: 'Generation automatique de rapports professionnels' },
              { icon: BarChart3, title: 'EDA Complet', desc: 'Statistiques, correlations, valeurs manquantes' },
              { icon: Sparkles, title: 'WhatIf Analysis', desc: 'Scenarios contrefactuels pour comprendre les predictions' },
              { icon: Users, title: 'Gestion d\'Equipe', desc: 'Invitez des collaborateurs avec differents roles' },
              { icon: Clock, title: 'Notifications Temps Reel', desc: 'Restez informe de l\'avancement de vos audits' },
              { icon: Lock, title: 'Securite Enterprise', desc: 'Chiffrement, RGPD, hebergement UE' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Improved */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 md:p-16 bg-card border-2 border-border relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Essai gratuit - Sans carte bancaire</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Pret a garantir l'equite de vos modeles IA ?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Rejoignez les entreprises qui font confiance a AuditIQ pour leurs audits de fairness et leur conformite AI Act. 
                  Commencez votre premier audit en moins de 5 minutes.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => router.push('/signup')}
                    className="text-lg px-8 h-14"
                  >
                    Commencer Gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => router.push('/contact')}
                    className="text-lg px-8 h-14"
                  >
                    Parler a un Expert
                  </Button>
                </div>

                {/* Additional trust elements */}
                <div className="mt-10 pt-8 border-t border-border">
                  <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Setup en 2 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Support francophone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Donnees hebergees en UE</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <AuditIQFooter />

      {/* Custom CSS for animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
