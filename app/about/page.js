import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, ShieldCheck, Sparkles, Target, Users, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: 'À propos - AuditIQ',
  description: 'Découvrez AuditIQ et notre mission de gouvernance IA responsable.',
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Rigueur de preuve',
    description: 'Chaque evaluation laisse une trace claire, partageable et defendable face aux exigences internes et externes.',
  },
  {
    icon: Target,
    title: 'Clarte operationnelle',
    description: 'Les equipes disposent des memes indicateurs, des memes statuts et des memes priorites de remediation.',
  },
  {
    icon: Users,
    title: 'Travail transversal',
    description: 'Produit, data et conformité avancent sur un même cadre au lieu de fonctionner en silos.',
  },
  {
    icon: Zap,
    title: 'Execution continue',
    description: 'La gouvernance IA ne se limite pas a une revue ponctuelle, elle vit au rythme du produit.',
  },
]

const milestones = [
  { label: 'Entreprises accompagnees', value: '200+' },
  { label: 'Audits structures', value: '10K+' },
  { label: 'Métriques d équité', value: '16+' },
  { label: 'Satisfaction client', value: '98%' },
]

const team = [
  { name: 'Franck Fambou', role: 'CEO', scope: 'Vision et gouvernance IA' },
  { name: 'Nora Diallo', role: 'CTO', scope: 'Systèmes ML et architecture' },
  { name: 'Sami Belaid', role: 'Head of Research', scope: 'Science de l équité' },
  { name: 'Ines Caron', role: 'Head of Product', scope: 'Adoption et flux' },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.24),transparent_24%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="relative overflow-hidden border-b border-white/8">
        <GridGlow />
        <div className="absolute left-1/2 top-14 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(170,79,255,0.44)_0%,rgba(105,33,158,0.22)_38%,rgba(0,0,0,0)_70%)] blur-2xl" />

        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-3">
              <Image src={logoUrl} alt="AuditIQ" width={112} height={26} className="h-auto w-[104px] brightness-150" />
            </Link>
            <nav className="hidden items-center gap-8 text-[11px] font-medium text-white/65 md:flex">
              <Link href="/about" className="text-white">À propos</Link>
              <Link href="/pricing" className="transition-colors hover:text-white">Tarifs</Link>
              <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
              <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="hidden rounded-full px-4 text-white/70 hover:bg-white/5 hover:text-white sm:inline-flex">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="rounded-full border border-brand-primary/40 bg-brand-primary px-4 text-white hover:bg-brand-primary/90">
                <Link href="/signup">Essai gratuit</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="relative z-10 px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-24 lg:pt-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>À propos</span>
            </div>
            <RevealOnScroll className="mt-8 max-w-4xl" duration={0.65}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Notre mission
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Construire un standard operationnel pour la gouvernance IA responsable.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                AuditIQ est né d un constat simple : les organisations parlent beaucoup de conformité IA,
                mais manquent d un système concret pour suivre, expliquer et améliorer leurs modèles dans le temps.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                  <Link href="/signup">
                    Commencer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full border border-white/12 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]">
                  <Link href="/contact">Parler a l equipe</Link>
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {milestones.map((item, index) => (
            <RevealOnScroll key={item.label} delay={index * 0.06}>
              <div className="rounded-[26px] border border-white/10 bg-[#0e0e10] p-5 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-white/55">{item.label}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.015] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <RevealOnScroll>
            <div>
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
              Notre histoire
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Passer de l intention a l execution.</h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Les equipes se retrouvaient avec des fichiers disperses, des revues non standardisees et
              une faible lisibilite sur les risques reels de leurs modeles. AuditIQ est construit pour
              transformer cette complexité en un flux visible et répétable.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Au lieu de produire un audit ponctuel, nous aidons les organisations a mettre en place une
              capacite continue : mesurer, decider, corriger, documenter.
            </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(140deg,rgba(226,8,161,0.16),rgba(104,54,176,0.16)_42%,rgba(255,255,255,0.03))] p-6 sm:p-8 framer-float">
            <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Modèle opérationnel</p>
              <div className="mt-4 space-y-3">
                {['Detecter les ecarts', 'Prioriser les actions', 'Tracer les decisions', 'Documenter la preuve'].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-sm text-white/75">
                    <Sparkles className="h-4 w-4 text-brand-cotton" />
                    {line}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-brand-primary/25 bg-brand-primary/10 px-4 py-3 text-sm text-white/85">
                Objectif : faire de la conformité IA un processus métier, pas une opération exceptionnelle.
              </div>
            </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
              Nos valeurs
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Le cadre qui guide nos decisions produit.</h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <RevealOnScroll key={value.title} delay={index * 0.06}>
                  <div className="rounded-[26px] border border-white/10 bg-[#0d0d0f] p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:border-white/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10">
                    <Icon className="h-4 w-4 text-brand-cotton" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/58">{value.description}</p>
                  </div>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.015] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
              Equipe
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Une équipe produit, data et conformité.</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((member, index) => (
              <RevealOnScroll key={member.name + member.role} delay={index * 0.06}>
                <div className="rounded-[26px] border border-white/10 bg-[#0d0d0f] p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:border-white/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(140deg,rgba(226,8,161,0.9),rgba(132,78,255,0.9))] text-sm font-semibold text-white">
                  {member.name
                    .split(' ')
                    .map((chunk) => chunk[0])
                    .join('')}
                </div>
                <p className="mt-4 text-base font-semibold text-white">{member.name}</p>
                <p className="mt-1 text-sm text-brand-cotton">{member.role}</p>
                <p className="mt-2 text-sm text-white/58">{member.scope}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(117,45,177,0.22)_55%,rgba(226,8,161,0.22))] px-6 py-10 text-center sm:px-10 sm:py-14">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Construisez une gouvernance IA qui tient dans la duree.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Si vous souhaitez, on peut aussi aligner vos pages internes et vos parcours dashboard sur cette nouvelle direction.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                <Link href="/signup">
                  Demarrer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full border border-white/12 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]">
                <Link href="/contact">Parler a un expert</Link>
              </Button>
            </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}