'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  ChevronRight,
  Clock3,
  FileCheck2,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { GLSLHills } from '@/components/ui/glsl-hills'
import { MarketingFooter } from '@/components/ui/marketing-footer'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

const trustSignals = ['AI Act articles 10 et 11', 'Code du travail L.1132-1', 'CNIL et RGPD', 'Pensé pour les PME', 'Sans data scientist']

const services = [
  {
    eyebrow: 'Module 1 — Audit supervisé',
    title: 'Mesurez les biais de vos modèles avec les métriques de référence',
    description:
      'Lancez un audit classique inspiré de Fairlearn sur vos jeux de données étiquetés : Parité Démographique, Égalité des Chances, Odds Égalisés, règle des 4/5. Trois rapports clairs, sans jargon, calibrés pour les équipes non techniques.',
    bullets: ['Parité Démographique (DP)', 'Égalité des Chances (EO)', 'Règle des 4/5 (80%)'],
    panelTitle: 'Audit supervisé',
    panelRows: ['Parité Démographique', 'Égalité des Chances', 'Règle des 4/5'],
  },
  {
    eyebrow: 'Module 2 — Détection non supervisée',
    title: 'Détectez des biais sans collecter d’attributs sensibles',
    description:
      'Quand la loi vous empêche de collecter genre, origine ou âge (AI Act art. 10(5), RGPD), notre clustering KMeans couplé à un test du Khi² révèle les écarts de décision entre groupes similaires. Une voie légale pour auditer sans labels démographiques.',
    bullets: ['Clustering KMeans', 'Test du Khi²', 'Zéro attribut sensible requis'],
    panelTitle: 'Détection non supervisée',
    panelRows: ['Groupes homogènes détectés', 'Écart de décision', 'Signal statistique'],
  },
  {
    eyebrow: 'Module 3 — Audit LLM et chatbot',
    title: 'Testez le biais de vos chatbots et assistants IA génératifs',
    description:
      'Inspiré du framework LangBiTe, notre banque de prompts appariés détecte les réponses discriminantes de vos LLM (OpenAI, Mistral, Gemini, Claude). Idéal pour les 17 % de PME qui utilisent un chatbot RH, commercial ou support.',
    bullets: ['Banque de prompts paired', 'Scoring automatique', 'Prêt pour chatbots RH et support'],
    panelTitle: 'Audit LLM et chatbot',
    panelRows: ['Prompts appariés', 'Réponses comparées', 'Écarts détectés'],
  },
  {
    eyebrow: 'Triple interface',
    title: 'Cognitive, technique, réglementaire — les trois niveaux au même endroit',
    description:
      'AuditIQ est conçu comme un outil de première ligne pour les PME françaises : comprendre les biais (cognitif), savoir les évaluer (technique), savoir ce que l’AI Act exige (réglementaire). Un seul parcours pour les trois.',
    bullets: ['Comprendre', 'Évaluer', 'Se situer face à l’AI Act'],
    panelTitle: 'Triple interface',
    panelRows: ['Cognitif — comprendre', 'Technique — évaluer', 'Réglementaire — se situer'],
  },
]

const processSteps = [
  {
    step: 'Étape 1',
    title: 'Importez un fichier',
    description:
      'Un simple CSV ou Excel suffit. Pas de pipeline ML à modifier, pas d’intégration technique à prévoir. Votre dataset ou les logs de votre chatbot, et c’est parti.',
    tags: ['CSV, Excel, JSON', 'Import direct', 'Aucune intégration'],
    icon: Radar,
  },
  {
    step: 'Étape 2',
    title: 'Choisissez votre module',
    description:
      'Audit supervisé si vous avez des labels démographiques, détection non supervisée sinon, audit LLM pour vos chatbots. AuditIQ vous guide vers le bon module selon votre contexte.',
    tags: ['Supervisé (Fairlearn)', 'Non supervisé (KMeans)', 'LLM (prompts paired)'],
    icon: Brain,
  },
  {
    step: 'Étape 3',
    title: 'Lisez le diagnostic',
    description:
      'Les résultats sont traduits en langage clair : où est le biais, quelle règle française il peut heurter (L.1132-1, CNIL, Défenseur des droits), et quelle action engager.',
    tags: ['Langage clair', 'Ancrage juridique FR', 'Sans jargon'],
    icon: Users,
  },
  {
    step: 'Étape 4',
    title: 'Téléchargez le rapport',
    description:
      'Un PDF structuré, partageable en interne ou avec un conseil juridique. Il documente votre démarche face à l’AI Act articles 10 et 11, sans prétendre à la conformité totale.',
    tags: ['Rapport PDF', 'AI Act art. 10 et 11', 'Partage interne'],
    icon: Zap,
  },
]

const caseStudies = [
  {
    company: 'PME RH — secteur recrutement',
    quote: 'Nous utilisons un outil de tri de CV et nous ne savions pas comment vérifier qu’il respecte L.1132-1. AuditIQ nous a donné une première réponse claire.',
    description:
      '17 % des PME interrogées dans notre sondage utilisent l’IA pour le recrutement. Pour celles qui n’ont ni data scientist ni juriste spécialisé, un audit de première ligne est souvent la seule porte d’entrée.',
    stats: ['Audit supervisé en moins d’une heure', 'Ancrage L.1132-1 intégré', 'Rapport partageable au conseil'],
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  },
  {
    company: 'PME services — chatbot client',
    quote: 'On a déployé un chatbot IA pour le support. On voulait juste vérifier qu’il ne répond pas différemment selon le profil du client.',
    description:
      '17 % des PME utilisent des chatbots IA selon notre sondage. Le module d’audit LLM applique une banque de prompts appariés inspirée de LangBiTe pour détecter les écarts de réponse.',
    stats: ['Audit LLM prêt à l’emploi', 'Compatible OpenAI, Mistral, Gemini', 'Pensé pour équipes non techniques'],
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  },
  {
    company: 'PME commerce — scoring marketing',
    quote: 'Nous n’avons pas le droit de collecter le genre ou l’origine de nos clients, donc on pensait qu’on ne pouvait rien auditer. La détection non supervisée a changé ça.',
    description:
      'Le paradoxe de l’AI Act art. 10(5) vs RGPD bloque beaucoup de PME. Le clustering KMeans couplé au test du Khi² permet de détecter des écarts entre groupes similaires sans jamais collecter d’attribut sensible.',
    stats: ['Aucun attribut sensible requis', 'Conforme RGPD', 'Sortie du dilemme de l’audit'],
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
]

const benefits = [
  {
    title: 'Accessible sans data scientist',
    description: 'Pensé pour les équipes non techniques : RH, direction, juridique. Pas besoin d’expertise ML pour lancer un premier audit.',
    icon: Zap,
  },
  {
    title: 'Ancrage juridique français',
    description: 'Code du travail L.1132-1, recommandations CNIL, Défenseur des droits, ACPR : chaque résultat renvoie aux bons textes.',
    icon: ShieldCheck,
  },
  {
    title: 'Sort du dilemme AI Act / RGPD',
    description: 'La détection non supervisée vous permet d’auditer sans collecter d’attributs sensibles, contournant le paradoxe art. 10(5).',
    icon: Clock3,
  },
  {
    title: 'Coût adapté aux PME',
    description: 'Un tier gratuit central, un plan PME à prix fixe, pas de facturation à l’API. 35 % des PME ont 0 € de budget, nous le prenons au sérieux.',
    icon: BarChart3,
  },
  {
    title: 'Première ligne, pas certification',
    description: 'AuditIQ est un outil de première ligne, pas un certificat de conformité AI Act. Vous reprenez la main en connaissance de cause.',
    icon: Brain,
  },
  {
    title: 'Triple interface unique',
    description: 'Comprendre le biais (cognitif), l’évaluer (technique), savoir ce que la loi exige (réglementaire) — les trois dans un seul parcours.',
    icon: Lock,
  },
]

const pricingPlans = [
  {
    name: 'Gratuit',
    monthly: 0,
    annual: 0,
    description: 'Parce que 35 % des PME ont 0 € de budget audit IA. L’audit de première ligne est un droit, pas un luxe.',
    features: ['3 audits supervisés par mois', 'Détection non supervisée incluse', 'Rapports basiques PDF', 'Ancrage juridique français'],
    cta: 'Démarrer gratuitement',
    href: '/signup',
    featured: false,
  },
  {
    name: 'PME',
    monthly: 29,
    annual: 24,
    description: 'Pour les PME qui veulent auditer régulièrement leurs modèles et leurs chatbots IA.',
    features: ['Audits supervisés illimités', 'Audit LLM et chatbot inclus', 'Rapports PDF avec ancrage juridique', 'Alertes et historique'],
    cta: 'Choisir PME',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Entreprise',
    monthly: null,
    annual: null,
    description: 'Pour les structures qui veulent multi-équipes, API et accompagnement juridique.',
    features: ['Multi-équipes', 'Intégrations API', 'Support juridique dédié', 'Déploiement sur mesure'],
    cta: 'Nous contacter',
    href: '/contact',
    featured: false,
  },
]

const faqs = [
  {
    question: 'AuditIQ garantit-il ma conformité à l’AI Act ?',
    answer:
      'Non, et nous sommes transparents là-dessus. AuditIQ est un outil de première ligne qui vous aide à documenter votre démarche au regard des articles 10 et 11 de l’AI Act. Ce n’est pas un certificat de conformité totale : un audit externe reste nécessaire pour les systèmes à haut risque.',
  },
  {
    question: 'Je n’ai pas de data scientist dans mon équipe, est-ce un frein ?',
    answer:
      'Non. AuditIQ est conçu pour les PME sans data scientist. Les interfaces sont en langage clair, sans jargon ML. Vous importez un fichier CSV ou Excel, le module vous guide, et le rapport est lisible par une direction, un juriste ou un responsable RH.',
  },
  {
    question: 'Je n’ai pas le droit de collecter le genre ou l’origine de mes utilisateurs. Comment auditer sans ces attributs ?',
    answer:
      'C’est exactement ce que permet notre module de détection non supervisée. En appliquant un clustering KMeans couplé à un test du Khi², AuditIQ identifie des écarts de décision entre groupes similaires sans jamais collecter d’attribut sensible. C’est une voie pour sortir du paradoxe AI Act art. 10(5) vs RGPD.',
  },
  {
    question: 'Peut-on auditer un chatbot IA avec AuditIQ ?',
    answer:
      'Oui. Le module d’audit LLM applique une banque de prompts appariés, inspirée du framework LangBiTe, pour détecter les réponses discriminantes de votre chatbot. Il fonctionne avec OpenAI, Mistral, Gemini et Claude.',
  },
  {
    question: 'À quelles lois françaises AuditIQ se réfère-t-il ?',
    answer:
      'Nous ancrons nos rapports sur le Code du travail article L.1132-1 (non-discrimination), les recommandations CNIL, la jurisprudence du Défenseur des droits et les positions de l’ACPR pour le secteur financier. Chaque constat renvoie au texte pertinent.',
  },
  {
    question: 'Combien de temps faut-il pour un premier audit exploitable ?',
    answer:
      'Moins d’une heure pour un audit supervisé ou non supervisé sur un fichier simple. Environ dix minutes pour un audit LLM/chatbot une fois la clé API configurée.',
  },
  {
    question: 'Pourquoi un tier gratuit central ?',
    answer:
      'Parce que notre sondage auprès de 34 PME françaises montre que 35 % ont 0 € de budget dédié et 82 % ont moins de 2000 €. L’audit IA ne peut pas être réservé aux grandes entreprises. Le gratuit inclut 3 audits supervisés par mois, la détection non supervisée et un rapport basique.',
  },
  {
    question: 'Où sont stockées mes données ?',
    answer:
      'Sur des serveurs Supabase situés dans l’Union Européenne, conformes RGPD. Vos datasets ne sortent jamais de l’UE et ne sont utilisés que pour l’audit que vous lancez.',
  },
  {
    question: 'Puis-je partager les rapports avec un conseil juridique ou mon DPO ?',
    answer:
      'Oui. Les rapports PDF sont pensés pour être partagés avec votre direction, votre DPO, votre juriste ou un auditeur externe. Ils documentent la méthode, les métriques, les résultats et les références juridiques mobilisées.',
  },
]

function MetricPanel({ title, rows }) {
  const loopRows = [...rows, ...rows]

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#111113] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-white/85">{title}</p>
          <p className="text-[10px] text-white/35">Couche de contrôle en direct</p>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-brand-primary" />
        </div>
      </div>
      <div className="relative h-[154px] overflow-hidden">
        <motion.div
          animate={{ y: ['0%', '-50%'] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'linear' }}
          className="space-y-2"
        >
          {loopRows.map((row, index) => (
            <div key={`${row}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2.5">
              <div>
                <p className="text-[11px] text-white/80">{row}</p>
                <p className="text-[10px] text-white/30">Point d'audit {(index % rows.length) + 1}</p>
              </div>
              <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-cotton">
                Active
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function MetricPanelTicker({ title, rows }) {
  const loopRows = [...rows, ...rows]

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#111113] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-white/85">{title}</p>
          <p className="text-[10px] text-white/35">Couche de contrôle en direct</p>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-brand-primary" />
        </div>
      </div>

      <div className="relative h-[152px] overflow-hidden">
        <motion.div
          animate={{ y: ['0%', '-50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="space-y-2"
        >
          {loopRows.map((row, index) => (
            <div key={`${row}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2.5">
              <div>
                <p className="text-[11px] text-white/80">{row}</p>
                <p className="text-[10px] text-white/30">Point d'audit {(index % rows.length) + 1}</p>
              </div>
              <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-cotton">
                Active
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const helperPrompt = 'Auditer mon outil de tri de CV sans collecter le genre des candidats. Par où commencer ?'
  const [typedPrompt, setTypedPrompt] = useState('')
  const [isAnnual, setIsAnnual] = useState(true)

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
  }, [router])

  useEffect(() => {
    let charIndex = 0
    let isDeleting = false
    let timer

    const loopTyping = () => {
      if (!isDeleting) {
        const next = helperPrompt.slice(0, charIndex + 1)
        setTypedPrompt(next)
        charIndex += 1

        if (charIndex >= helperPrompt.length) {
          isDeleting = true
          timer = setTimeout(loopTyping, 1400)
          return
        }

        timer = setTimeout(loopTyping, 30)
        return
      }

      const next = helperPrompt.slice(0, Math.max(0, charIndex - 1))
      setTypedPrompt(next)
      charIndex -= 1

      if (charIndex <= 0) {
        isDeleting = false
        timer = setTimeout(loopTyping, 480)
        return
      }

      timer = setTimeout(loopTyping, 18)
    }

    loopTyping()
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-[#050505] text-white">
      <div className="relative">

        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logoUrl} alt="AuditIQ" width={112} height={26} className="h-auto w-[104px] brightness-150" />
            </Link>

            <nav className="hidden items-center gap-8 text-[11px] font-medium text-white/65 md:flex">
              <Link href="/about" className="transition-colors hover:text-white">À propos</Link>
              <Link href="/pricing" className="transition-colors hover:text-white">Tarifs</Link>
              <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
              <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="hidden rounded-full px-4 text-white/70 hover:bg-white/5 hover:text-white sm:inline-flex"
                onClick={() => router.push('/login')}
              >
                Connexion
              </Button>
              <Button
                className="rounded-full border border-brand-primary/40 bg-brand-primary px-4 text-white shadow-[0_10px_30px_rgba(226,8,161,0.35)] hover:bg-brand-primary/90"
                onClick={() => router.push('/signup')}
              >
                Essai gratuit
              </Button>
            </div>
          </div>
        </header>

        <main className="relative z-10 pt-20 sm:pt-24">
          <section className="relative overflow-hidden px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl">
              <div className="relative isolate mx-auto max-w-4xl text-center">
                <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-[460px] w-screen -translate-x-1/2 opacity-100 [mask-image:linear-gradient(to_bottom,transparent_0%,black_26%,black_78%,transparent_100%)]">
                  <GLSLHills className="h-full w-full" speed={0.48} cameraZ={104} planeSize={256} />
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-56 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-transparent" />

                <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#140a14]/90 p-1 pr-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(226,8,161,0.22)]"
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-primary px-2.5 py-1 text-[10px] tracking-[0.08em] text-white">
                    <Sparkles className="h-3 w-3" />
                    Nouveau
                  </span>
                  Outil de première ligne pour PME françaises
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mx-auto mt-8 max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  Auditer vos IA facilement, même sans data scientist.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
                >
                  AuditIQ est une plateforme d’audit de biais pensée pour les PME françaises. Trois modules complémentaires, un ancrage juridique français clair, et une triple interface qui relie le cognitif, le technique et le réglementaire.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                  <Button
                    className="min-w-[180px] rounded-full bg-brand-primary px-6 py-6 text-white shadow-[0_18px_45px_rgba(226,8,161,0.35)] hover:bg-brand-primary/90"
                    onClick={() => router.push('/signup')}
                  >
                    Commencer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-full border border-white/12 bg-white/[0.03] px-6 py-6 text-white hover:bg-white/[0.06]"
                    onClick={() => router.push('/contact')}
                  >
                    Voir une démo
                  </Button>
                </motion.div>
                </div>
              </div>

              <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="rounded-[30px] border border-white/10 bg-[#0e0e10] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-cotton">
                      Audit en cours
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                      3 modules actifs
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.15fr]">
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.52 }}
                      className="rounded-[24px] border border-white/8 bg-black/30 p-4"
                    >
                      <p className="text-[11px] font-semibold text-white/85">Pistes détectées</p>
                      <div className="mt-4 space-y-3">
                        {[
                          ['Règle des 4/5 non respectée', 'Audit supervisé'],
                          ['Cluster à écart significatif', 'Non supervisé — Khi²'],
                          ['Réponses LLM divergentes', 'Audit chatbot'],
                          ['Ancrage L.1132-1', 'Rapport PDF prêt'],
                        ].map(([title, meta], index) => (
                          <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.58 + index * 0.07 }}
                            whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.16)' }}
                            className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-3"
                          >
                            <div>
                              <p className="text-[11px] text-white/85">{title}</p>
                              <p className="text-[10px] text-white/35">{meta}</p>
                            </div>
                            <motion.span
                              className="h-2 w-2 rounded-full bg-brand-primary"
                              animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.35, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.16 }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    <div className="grid gap-4">
                      <MetricPanelTicker title="Métriques d'équité" rows={['Parité Démographique', 'Égalité des Chances', 'Règle des 4/5']} />
                      <motion.div
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.64 }}
                        whileHover={{ y: -3 }}
                        className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold text-white/85">Question PME fréquente</p>
                            <p className="text-[10px] text-white/35">Guide juridique intégré</p>
                          </div>
                          <motion.div
                            animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Sparkles className="h-4 w-4 text-brand-cotton" />
                          </motion.div>
                        </div>
                        <motion.div
                          className="mt-5 rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-sm text-white/85"
                          animate={{ boxShadow: ['0 0 0 rgba(226,8,161,0)', '0 0 24px rgba(226,8,161,0.2)', '0 0 0 rgba(226,8,161,0)'] }}
                          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div className="relative min-h-[96px] px-4 py-3">
                            <span aria-hidden className="invisible block leading-7">
                              {helperPrompt}
                            </span>
                            <span className="absolute inset-0 px-4 py-3 leading-7">
                              {typedPrompt}
                              <motion.span
                                aria-hidden
                                className="ml-0.5 inline-block text-brand-cotton"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                              >
                                |
                              </motion.span>
                            </span>
                          </div>
                        </motion.div>
                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-white/55">
                          {['Choisir un module', 'Lire le diagnostic', 'Télécharger le PDF'].map((item, index) => (
                            <motion.span
                              key={item}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25, delay: 0.72 + index * 0.05 }}
                              className="rounded-full border border-white/10 px-3 py-1"
                            >
                              {item}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Un outil de première ligne pensé pour les PME françaises</p>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {trustSignals.map((signal, index) => (
                        <motion.div
                          key={signal}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.28, delay: 0.58 + index * 0.06 }}
                          whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.18)' }}
                          className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3 text-[11px] font-medium text-white/75"
                        >
                          {signal}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    whileHover={{ y: -4 }}
                    className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(226,8,161,0.14),rgba(119,55,255,0.08)_45%,rgba(255,255,255,0.03))] p-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-black/30 p-3">
                        <FileCheck2 className="h-5 w-5 text-brand-cotton" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Rapports ancrés dans le droit français</p>
                        <p className="text-xs text-white/50">L.1132-1, CNIL, Défenseur des droits</p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-white/70">
                      Chaque rapport relie vos constats techniques aux textes français pertinents et aux articles 10 et 11 de l’AI Act. Lisible par une direction ou un juriste, sans jargon ML.
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Trois modules, une triple interface"
                title="Trois manières d’auditer, une seule plateforme pensée pour les PME"
                description="Supervisé, non supervisé, LLM : chaque module couvre un cas réel d’usage en PME française, du tri de CV au chatbot client, en passant par le scoring marketing."
                centered
              />

              <div className="mt-14 grid gap-6 lg:mt-16">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="grid gap-6 rounded-[32px] border border-white/10 bg-[#0d0d0f] p-5 sm:p-6 lg:grid-cols-2 lg:items-center"
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <MetricPanel title={service.panelTitle} rows={service.panelRows} />
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                        {service.eyebrow}
                      </span>
                      <h3 className="mt-5 max-w-xl text-2xl font-semibold leading-tight text-white sm:text-3xl">{service.title}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">{service.description}</p>
                      <div className="mt-6 overflow-hidden">
                        <motion.div
                          animate={{ x: ['0%', '-50%'] }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          className="flex w-max gap-2.5"
                        >
                          {[...service.bullets, ...service.bullets].map((bullet, bulletIndex) => (
                            <span key={`${bullet}-${bulletIndex}`} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] text-white/72">
                              {bullet}
                            </span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Notre process"
                title="Quatre étapes, zéro prérequis technique"
                description="De l’import du fichier au rapport PDF, AuditIQ vous guide sans jargon. Pensé pour être lancé par une direction, un responsable RH ou un juriste, pas uniquement par un data scientist."
                centered
              />

              <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {processSteps.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.45, delay: index * 0.07 }}
                      className="rounded-[28px] border border-white/10 bg-[#0f0f11] p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">{item.step}</span>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
                          <Icon className="h-4 w-4 text-brand-cotton" />
                        </div>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/58">{item.description}</p>
                      <div className="mt-5 space-y-2">
                        {item.tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-2 text-[11px] text-white/72">
                            <Check className="h-3.5 w-3.5 text-brand-primary" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="bg-white/[0.015] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Cas d’usage PME"
                title="Des cas d’usage typiques issus du terrain PME français"
                description="Ces scénarios reflètent les usages observés dans notre sondage : recrutement, chatbot client, scoring marketing. Pas de témoignages inventés, des situations réelles que AuditIQ aide à traiter."
                centered
              />

              <div className="mt-14 space-y-6">
                {caseStudies.map((study, index) => (
                  <motion.article
                    key={study.company}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="grid gap-6 rounded-[32px] border border-white/10 bg-[#0d0d0f] p-5 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                        <Image src={study.image} alt={study.company} width={900} height={680} className="h-[280px] w-full object-cover sm:h-[340px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{study.company}</p>
                      <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-white sm:text-3xl">{study.quote}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">{study.description}</p>
                      <div className="mt-6 space-y-2.5">
                        {study.stats.map((stat) => (
                          <div key={stat} className="flex items-center gap-3 text-sm text-white/75">
                            <Check className="h-4 w-4 text-brand-primary" />
                            {stat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Pourquoi AuditIQ"
                title="Un positionnement clair, assumé, aligné sur la réalité PME"
                description="AuditIQ ne promet pas de tout résoudre. Nous assumons un rôle précis : outil de première ligne, accessible, ancré dans le droit français, honnête sur ses limites."
                centered
              />

              <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon

                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="rounded-[26px] border border-white/10 bg-[#0d0d0f] p-5 transition-colors hover:border-white/20"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10">
                        <Icon className="h-4 w-4 text-brand-cotton" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">{benefit.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/58">{benefit.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="bg-white/[0.015] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Tarification"
                title="Inaccessible n’est pas un mot dans notre vocabulaire"
                description="35 % des PME ont 0 € de budget pour auditer leurs IA. Notre tier gratuit n’est pas une vitrine : c’est notre positionnement. L’audit est un droit, pas un luxe."
                centered
              />

              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0d0d0f] px-4 py-2 text-sm text-white/70">
                  <button
                    type="button"
                    onClick={() => setIsAnnual(false)}
                    className={`rounded-full px-3 py-1 transition-colors ${isAnnual ? 'text-white/55' : 'bg-white/10 text-white'}`}
                  >
                    Mensuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnnual(true)}
                    className={`rounded-full px-3 py-1 transition-colors ${isAnnual ? 'bg-brand-primary text-white' : 'text-white/55'}`}
                  >
                    Annuel
                  </button>
                  <span className="rounded-full border border-brand-primary/25 bg-brand-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-brand-cotton">
                    -17%
                  </span>
                </div>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pricingPlans.map((plan, index) => {
                  const price = isAnnual ? plan.annual : plan.monthly

                  return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className={`rounded-[30px] border p-6 ${
                      plan.featured
                        ? 'border-brand-primary/35 bg-[linear-gradient(180deg,rgba(226,8,161,0.18),rgba(15,15,17,0.98)_28%)] shadow-[0_18px_50px_rgba(226,8,161,0.18)]'
                        : 'border-white/10 bg-[#0d0d0f]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{plan.name}</p>
                        <p className="mt-4 text-3xl font-semibold text-white">
                          {price === null ? 'Sur mesure' : `${price}€`}
                        </p>
                        {price !== null ? <p className="mt-1 text-xs text-white/45">/mois</p> : null}
                      </div>
                      {plan.featured ? (
                        <span className="rounded-full border border-brand-primary/25 bg-brand-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-cotton">
                              Recommandé
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 min-h-[56px] text-sm leading-7 text-white/58">{plan.description}</p>
                    <Button
                      asChild
                      className={`mt-6 w-full rounded-full ${plan.featured ? 'bg-brand-primary hover:bg-brand-primary/90' : 'bg-white text-black hover:bg-white/90'}`}
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                    <div className="mt-6 space-y-3 border-t border-white/8 pt-6">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3 text-sm text-white/78">
                          <Check className="h-4 w-4 text-brand-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
            <div className="mx-auto max-w-5xl">
              <SectionHeading
                eyebrow="FAQ"
                title="Les questions que les PME françaises nous posent le plus"
                description="Transparence sur nos limites, clarté sur nos modules, ancrage juridique français. Si votre question n’est pas ici, écrivez-nous."
                centered
              />

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.45 }}
                className="mt-12 rounded-[30px] border border-white/10 bg-[#0d0d0f] p-4 sm:p-5"
              >
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((item, index) => (
                    <AccordionItem key={item.question} value={`faq-${index}`} className="border-white/8 px-2">
                      <AccordionTrigger className="py-5 text-left text-sm font-medium text-white hover:no-underline sm:text-base">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 pr-8 text-sm leading-7 text-white/58">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </section>

          <section className="px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(117,45,177,0.22)_55%,rgba(226,8,161,0.22))] px-6 py-10 text-center sm:px-10 sm:py-14"
              >
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Passer à l’action</p>
                <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                  Votre premier audit gratuit, en moins d’une heure.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                  Importez un CSV, choisissez un module, lisez le diagnostic, téléchargez le rapport. C’est la voie la plus directe pour comprendre où en est votre outil IA au regard de L.1132-1 et de l’AI Act.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90" onClick={() => router.push('/signup')}>
                    Démarrer gratuitement
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="rounded-full border border-white/12 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]" onClick={() => router.push('/pricing')}>
                    Voir les tarifs
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <MarketingFooter />
      </div>
    </div>
  )
}