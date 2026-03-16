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

const trustSignals = ['AI Act prêt', 'Suivi des biais', 'Piste d\'audit', 'Explicabilité', 'Scoring de risque']

const services = [
  {
    eyebrow: 'Audit de workflow',
    title: 'Cartographiez vos risques avant la mise en production',
    description:
      'AuditIQ détecte les points sensibles de votre pipeline ML, remonte les jeux de données critiques et formalise les zones à risque réglementaire.',
    bullets: ['Inventaire des modèles', 'Contrôles de datasets', 'Journal d’évidence'],
    panelTitle: 'Moniteur de risque',
    panelRows: ['Dérive dataset', 'Attributs protégés', 'Seuil de biais'],
  },
  {
    eyebrow: 'Supervision modèle',
    title: 'Automatisez les audits d’équité et de robustesse',
    description:
      'Lancez des campagnes d’évaluation sur plusieurs métriques, comparez vos modèles et produisez des rapports prêts pour les équipes conformité.',
    bullets: ['16+ métriques d équité', 'Scénarios what-if', 'Rapports exportables'],
    panelTitle: 'File d audits',
    panelRows: ['Parité de genre', 'Parité d âge', 'Taux de validation'],
  },
  {
    eyebrow: 'Ops et gouvernance',
    title: 'Coordonnez data, légal et produit dans une seule interface',
    description:
      'Les équipes suivent le même statut d’audit, valident les écarts et priorisent les actions correctives sans multiplier les tableurs.',
    bullets: ['Assignation claire', 'Validation multi-équipes', 'Historique complet'],
    panelTitle: 'Comité de revue',
    panelRows: ['Revue légale', 'Validation produit', 'Plan de mitigation'],
  },
  {
    eyebrow: 'Programmes dédiés',
    title: 'Structurez une gouvernance IA crédible face aux régulateurs',
    description:
      'AuditIQ vous aide à passer d’un audit ponctuel à une capacité continue de contrôle, de remédiation et de preuve.',
    bullets: ['Playbooks internes', 'Conformité continue', 'Accompagnement expert'],
    panelTitle: 'Centre de contrôle',
    panelRows: ['Pack de preuve', 'Suivi responsable', 'Prochain jalon'],
  },
]

const processSteps = [
  {
    step: 'Étape 1',
    title: 'Analyse intelligente',
    description:
      'Connexion des sources, lecture de la structure des données et détection des variables sensibles à surveiller.',
    tags: ['Scan des sources', 'Vérification schéma', 'Cartographie du risque'],
    icon: Radar,
  },
  {
    step: 'Étape 2',
    title: 'Développement IA',
    description:
      'Configuration des tests, sélection des métriques d’équité et préparation des scénarios d’évaluation.',
    tags: ['Sets de métriques', 'Tests what-if', 'Règles de seuil'],
    icon: Brain,
  },
  {
    step: 'Étape 3',
    title: 'Intégration fluide',
    description:
      'Intégration fluide avec vos flux internes pour partager les résultats avec les métiers, la data et la conformité.',
    tags: ['Flux équipe', 'Sync des preuves', 'API prête'],
    icon: Users,
  },
  {
    step: 'Étape 4',
    title: 'Optimisation continue',
    description:
      'Suivi des écarts dans le temps, plan de remédiation et itérations sur les modèles à fort impact.',
    tags: ['Revue des tendances', 'Boucle de mitigation', 'Suivi des scores'],
    icon: Zap,
  },
]

const caseStudies = [
  {
    company: 'Financia',
    quote: 'AuditIQ a réduit de 68% le temps nécessaire pour documenter les contrôles d’équité avant comité de validation.',
    description:
      'Une fintech B2B utilisait plusieurs modèles de scoring sans vision unifiée de ses risques. AuditIQ a centralisé les métriques, les écarts et les preuves.',
    stats: ['68% de temps gagné', '4 équipes alignées', 'Rapport AI Act prêt'],
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  },
  {
    company: 'Mediance',
    quote: 'Les audits mensuels sont passés d’un exercice artisanal à un rituel piloté, traçable et partageable.',
    description:
      'Une entreprise healthtech avait besoin d’une preuve continue de conformité pour ses modèles d’aide à la décision.',
    stats: ['80% moins de friction', 'Piste d audit complète', 'Alertes de dérive actives'],
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  },
  {
    company: 'ScaleOps',
    quote: 'Les responsables produit visualisent enfin le coût réel des biais et les priorités de remédiation.',
    description:
      'Pour une scale-up SaaS, AuditIQ a servi de centre de pilotage partagé entre produit, data et direction des risques.',
    stats: ['3x plus de visibilité', 'Plans d’action priorisés', 'Indicateurs alignés métier'],
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
]

const benefits = [
  {
    title: 'Productivité accrue',
    description: 'Moins de collecte manuelle, plus de temps pour analyser les écarts réellement critiques.',
    icon: Zap,
  },
  {
    title: 'Confiance réglementaire',
    description: 'Un historique d’audit clair et compréhensible pour les équipes conformité et gouvernance.',
    icon: ShieldCheck,
  },
  {
    title: 'Disponibilité continue',
    description: 'Les contrôles se répètent au rythme de vos mises en production et non plus uniquement avant les audits.',
    icon: Clock3,
  },
  {
    title: 'Réduction des coûts',
    description: 'Réduisez l’effort dispersé entre équipes et évitez les reprises tardives sur des modèles déjà déployés.',
    icon: BarChart3,
  },
  {
    title: 'Décisions guidées par la donnée',
    description: 'Métriques, tendances et recommandations structurent les arbitrages de remédiation.',
    icon: Brain,
  },
  {
    title: 'Scalabilité de gouvernance',
    description: 'Passez de quelques modèles surveillés à un portefeuille complet sans perdre en lisibilité.',
    icon: Lock,
  },
]

const pricingPlans = [
  {
    name: 'Essai gratuit',
    monthly: 0,
    annual: 0,
    description: 'Pour tester la plateforme sur un cas d usage réel, sans engagement.',
    features: ['1 projet actif', 'Métriques de base', 'Rapport synthétique', 'Support communautaire'],
    cta: 'Essayer gratuitement',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Starter',
    monthly: 37,
    annual: 31,
    description: 'Pour lancer vos premiers audits et structurer un socle de gouvernance.',
    features: ['3 projets actifs', 'Mesures d équité essentielles', 'Exports PDF', 'Support par e-mail'],
    cta: 'Commencer',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Professionnel',
    monthly: 75,
    annual: 62,
    description: 'Pour les équipes qui veulent industrialiser la revue des modèles à risque.',
    features: ['Automations avancées', 'Scénarios what-if', 'Collaboration équipe', 'Rapports prioritaires'],
    cta: 'Demander une démo',
    href: '/contact',
    featured: true,
  },
  {
    name: 'Entreprise',
    monthly: null,
    annual: null,
    description: 'Pour les organisations soumises à des exigences fortes de preuve et de gouvernance.',
    features: ['SSO & gouvernance', 'Programmes dédiés', 'Conformité continue', 'Support expert'],
    cta: 'Planifier un échange',
    href: '/contact',
    featured: false,
  },
]

const faqs = [
  {
    question: 'Comment AuditIQ aide-t-il pour l’AI Act ?',
    answer:
      'AuditIQ convertit les exigences de gouvernance en contrôles opérationnels: métriques d’équité, seuils, journaux d’évidence et rapports prêts à partager en revue interne ou avec vos interlocuteurs conformité.',
  },
  {
    question: 'Peut-on connecter nos modèles et datasets existants ?',
    answer:
      'Oui. La plateforme s’intègre à vos flux existants pour éviter une refonte lourde: vous conservez vos pipelines actuels et ajoutez une couche de pilotage, de traçabilité et de priorisation.',
  },
  {
    question: 'Les équipes non techniques peuvent-elles suivre les audits ?',
    answer:
      'Oui. Les tableaux de bord sont conçus pour les équipes produit, conformité et direction: statuts, risques, décisions et plans d’action sont lisibles sans expertise ML avancée.',
  },
  {
    question: 'Faut-il une équipe conformité dédiée pour démarrer ?',
    answer:
      'Non. Vous pouvez démarrer avec une équipe réduite. AuditIQ vous aide à poser un cadre progressif, clarifier les rôles et structurer les décisions au fur et à mesure de votre montée en maturité.',
  },
  {
    question: 'Proposez-vous un accompagnement ?',
    answer:
      'Oui. Nous proposons des parcours d’onboarding, de cadrage métrique et d’accompagnement expert pour accélérer la mise en place, sécuriser les premiers cycles d’audit et rendre vos équipes autonomes.',
  },
  {
    question: 'Combien de temps faut-il pour un premier audit exploitable ?',
    answer:
      'La plupart des équipes obtiennent un premier audit actionnable en quelques jours, selon la qualité des données, la disponibilité des modèles et le niveau de gouvernance déjà en place.',
  },
  {
    question: 'Peut-on prioriser les écarts par criticité métier ?',
    answer:
      'Oui. Vous pouvez classer les constats selon le niveau de risque, l’impact métier et l’urgence de remédiation afin de concentrer les efforts sur les écarts réellement critiques.',
  },
  {
    question: 'Comment fonctionne l’essai gratuit à 0€ ?',
    answer:
      'L’essai gratuit permet de valider la valeur de la plateforme sur un cas réel, avec un périmètre initial clair. Vous pouvez ensuite évoluer vers une offre supérieure sans rupture de continuité.',
  },
  {
    question: 'Les résultats peuvent-ils être partagés avec les parties prenantes ?',
    answer:
      'Oui. Les rapports et historiques d’audit sont conçus pour être partageables avec les responsables produit, la conformité, la direction et les équipes techniques, avec un niveau de preuve cohérent.',
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
  const helperPrompt = 'Génère un rapport AI Act et liste les écarts à corriger avant validation interne.'
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
                  Workflow d'audit automatisé
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mx-auto mt-8 max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  Pilotez la conformité IA en toute clarté.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
                >
                  AuditIQ transforme vos obligations d’audit en un workflow lisible, mesurable et partageable entre équipes data, produit et conformité.
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
                      Audit en direct
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                      3 modèles actifs
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.15fr]">
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.52 }}
                      className="rounded-[24px] border border-white/8 bg-black/30 p-4"
                    >
                      <p className="text-[11px] font-semibold text-white/85">Toutes les tâches</p>
                      <div className="mt-4 space-y-3">
                        {[
                          ['Seuil de biais dépassé', 'Revue en attente'],
                          ['Revue de dérive du modèle', '2 jours restants'],
                          ['Workflow de validation', 'Signature légale'],
                          ['Cartographie AI Act (UE)', 'Prêt'],
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
                      <MetricPanelTicker title="Vue d\'équité" rows={['Parité de validation', 'Écart de faux positifs', 'Équilibre de population']} />
                      <motion.div
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.64 }}
                        whileHover={{ y: -3 }}
                        className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold text-white/85">Comment puis-je aider ?</p>
                            <p className="text-[10px] text-white/35">Assistant conformité</p>
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
                          {['Analyser', 'Brouillon de rapport', 'Assigner un responsable'].map((item, index) => (
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
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Plus de 50 équipes font confiance à une supervision IA structurée</p>
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
                        <p className="text-sm font-semibold text-white">Rapports prêts à partager</p>
                        <p className="text-xs text-white/50">Conformes, lisibles, exploitables</p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-7 text-white/70">
                      Chaque audit alimente un historique traçable, avec statut, responsable, justification et plan de remédiation associé.
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow="Nos services"
                title="Des services concrets pour cadrer, auditer et fiabiliser vos modèles IA"
                description="De la cartographie des risques à la remédiation continue, chaque service vous aide à industrialiser la conformité sans alourdir vos équipes."
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
                title="Un processus clair pour piloter vos audits de conformité IA"
                description="De l’analyse initiale à l’optimisation continue, chaque étape structure la décision, accélère la remédiation et renforce la traçabilité."
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
                eyebrow="Etudes de cas"
                title="Des études de cas qui montrent l’impact concret d’une gouvernance IA maîtrisée"
                description="Découvrez comment nos clients réduisent les risques, accélèrent la remédiation et renforcent leur capacité de preuve auprès des parties prenantes."
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
                eyebrow="Benefices"
                title="Les bénéfices clés d’une gouvernance IA réellement exploitable"
                description="Une vision claire de l’impact opérationnel, avec des bénéfices mesurables pour les équipes data, conformité et produit."
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
                title="Une tarification claire pour déployer la gouvernance IA à votre rythme"
                description="Choisissez le niveau d’accompagnement adapté à votre maturité, de l’audit initial au pilotage multi-modèles à l’échelle."
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

              <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                title="Les réponses clés pour lancer une gouvernance IA solide"
                description="Un cadre clair pour démarrer vite, prioriser les bons chantiers et aligner produit, data et conformité dès les premières décisions."
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
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Passer a l action</p>
                <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                  Transformez vos obligations de gouvernance IA en execution claire et mesurable.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                  Centralisez vos controles, priorisez les remediations critiques et partagez des preuves solides avec vos equipes et vos instances de decision.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90" onClick={() => router.push('/contact')}>
                    Planifier une demo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="rounded-full border border-white/12 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]" onClick={() => router.push('/pricing')}>
                    Comparer les offres
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