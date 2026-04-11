import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, ShieldCheck, Sparkles, Target, Users, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: 'À propos - AuditIQ',
  description: 'AuditIQ, un outil de première ligne d’audit de biais IA pour PME françaises, ancré dans le droit français et inspiré d’Algorithm Audit et LangBiTe.',
}

const values = [
  {
    icon: ShieldCheck,
    title: 'Honnêteté sur nos limites',
    description: 'AuditIQ est un outil de première ligne, pas un certificat de conformité AI Act. Nous le disons clairement à chaque rapport.',
  },
  {
    icon: Target,
    title: 'Accessibilité réelle',
    description: 'Pensé pour les PME sans data scientist : langage clair, interfaces simples, tier gratuit central. L’audit n’est pas réservé aux grandes entreprises.',
  },
  {
    icon: Users,
    title: 'Triple interface',
    description: 'Cognitif (comprendre), technique (évaluer), réglementaire (savoir ce que l’AI Act exige). Les trois niveaux dans un seul parcours.',
  },
  {
    icon: Zap,
    title: 'Ancrage juridique français',
    description: 'Code du travail L.1132-1, CNIL, Défenseur des droits, ACPR : chaque résultat renvoie aux textes pertinents du droit français.',
  },
]

const milestones = [
  { label: 'Modules complémentaires', value: '3' },
  { label: 'PME sondées', value: '34' },
  { label: 'PME avec 0 € budget audit', value: '35%' },
  { label: 'Intérêt si outil simple', value: '44%' },
]

const team = [
  { name: 'Franck Fambou', role: 'Fondateur', scope: 'Full-stack et vision produit' },
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
                Un outil de première ligne, pensé pour les PME françaises.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                AuditIQ est né d’un constat simple : les grandes plateformes d’audit IA parlent aux grandes entreprises, avec des tarifs et des prérequis techniques inaccessibles aux PME. Pourtant, ce sont les PME qui utilisent massivement l’IA au quotidien — recrutement, chatbot, marketing, scoring — sans data scientist pour vérifier.
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
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">La problématique de mémoire qui nous guide.</h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Ce projet est le fruit d’un mémoire de fin d’études recentré sur une problématique précise : comment permettre à une PME française, sans data scientist et avec un budget limité, d’auditer elle-même ses outils IA face aux exigences de l’AI Act (articles 10 et 11) et au droit français de la non-discrimination (L.1132-1, CNIL, Défenseur des droits, ACPR) ?
            </p>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Nous nous inspirons de deux projets de référence : Algorithm Audit (Pays-Bas) pour la détection non supervisée de biais via clustering, et LangBiTe pour l’audit des LLM par prompts appariés. AuditIQ traduit ces approches en un parcours simple, ancré dans le contexte juridique français.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Notre positionnement théorique : une « triple interface » qui relie le cognitif (comprendre les biais), le technique (savoir les évaluer) et le réglementaire (savoir ce que l’AI Act exige). Trois niveaux que les outils existants traitent rarement ensemble.
            </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(140deg,rgba(226,8,161,0.16),rgba(104,54,176,0.16)_42%,rgba(255,255,255,0.03))] p-6 sm:p-8 framer-float">
            <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Les trois modules</p>
              <div className="mt-4 space-y-3">
                {['Audit supervisé (Fairlearn)', 'Détection non supervisée (KMeans + Khi²)', 'Audit LLM et chatbot (prompts paired)', 'Rapports PDF ancrés en droit FR'].map((line) => (
                  <div key={line} className="flex items-center gap-3 text-sm text-white/75">
                    <Sparkles className="h-4 w-4 text-brand-cotton" />
                    {line}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-brand-primary/25 bg-brand-primary/10 px-4 py-3 text-sm text-white/85">
                Objectif : rendre l’audit IA accessible aux PME françaises, comme une première ligne avant un audit externe.
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
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Les principes qui guident AuditIQ.</h2>
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
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Un projet solo, assumé et transparent.</h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">AuditIQ est porté par un seul développeur full-stack, dans le cadre d’un mémoire universitaire. Nous ne prétendons pas être une grande équipe : nous prétendons être utile, et honnêtes là-dessus.</p>
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
              Essayez AuditIQ. Sans carte bancaire, sans data scientist.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Le tier gratuit vous donne accès aux trois modules avec des quotas adaptés à un premier cas d’usage PME. Partagez vos retours, c’est précieux pour le projet.
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