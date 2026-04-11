import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Briefcase, Building2, ChevronRight, Clock3, Globe2, Heart, MapPin, Users, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: 'Carrières - AuditIQ',
  description: 'Rejoignez AuditIQ et contribuez a une gouvernance IA responsable.',
}

const benefits = [
  { icon: Heart, title: 'Projet utile', description: 'Un outil qui sert vraiment les PME françaises, pas une énième plateforme pour grandes entreprises.' },
  { icon: Clock3, title: 'Liberté', description: 'Contributions à votre rythme, open source, aucune hiérarchie lourde.' },
  { icon: Zap, title: 'Apprentissage', description: 'Plongez dans l’AI Act, le droit français et les méthodes d’audit des biais IA.' },
  { icon: Globe2, title: 'Visibilité', description: 'Votre nom apparaît dans les rapports et sur le projet si vous le souhaitez.' },
  { icon: Users, title: 'Retours directs', description: 'Travail direct avec des PME françaises qui utilisent l’outil.' },
  { icon: Building2, title: 'Impact concret', description: 'Chaque amélioration profite à des organisations qui n’auraient pas pu s’offrir un audit classique.' },
]

const jobs = [
  {
    title: 'Testeurs PME bénévoles',
    department: 'Communauté',
    location: 'France — à distance',
    type: 'Bénévolat',
    description: 'Vous êtes dans une PME française et vous voulez tester AuditIQ sur un cas réel ? Rejoignez le cercle de testeurs et aidez à améliorer l’outil.',
  },
  {
    title: 'Contributions open source',
    department: 'Code',
    location: 'À distance',
    type: 'Contribution',
    description: 'Le projet accueille les contributions sur les trois modules : Fairlearn, clustering non supervisé, banque de prompts paired. Ouvrez une issue ou une PR.',
  },
  {
    title: 'Relecture juridique',
    department: 'Droit',
    location: 'France',
    type: 'Collaboration',
    description: 'Juriste, DPO ou avocat intéressé par l’AI Act et le droit français de la non-discrimination ? Aidez à renforcer l’ancrage juridique des rapports.',
  },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function CareersPage() {
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
              <Link href="/about" className="transition-colors hover:text-white">À propos</Link>
              <Link href="/pricing" className="transition-colors hover:text-white">Tarifs</Link>
              <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
              <Link href="/careers" className="text-white">Carrières</Link>
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
              <span>Carrières</span>
            </div>
            <RevealOnScroll className="mt-8 max-w-4xl" duration={0.65}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Contribuer au projet
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                AuditIQ est un projet ouvert, porté par un solo dev. On avance ensemble.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Pas de postes salariés à proposer aujourd’hui. En revanche, le projet accueille les testeurs PME, les contributions open source et les relectures juridiques. Si vous voulez aider à rendre l’audit IA accessible aux PME françaises, venez.
              </p>
              <Button asChild className="mt-8 rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </RevealOnScroll>
          </div>
        </section>
      </div>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Pourquoi contribuer</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <RevealOnScroll key={benefit.title} delay={index * 0.05}>
                  <article className="rounded-[26px] border border-white/10 bg-[#0d0d0f] p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:border-white/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10">
                    <Icon className="h-4 w-4 text-brand-cotton" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/58">{benefit.description}</p>
                  </article>
                </RevealOnScroll>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.015] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <RevealOnScroll>
            <div>
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
              Culture
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Un projet assumé : solo, ouvert, aligné sur une problématique précise.</h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              AuditIQ est développé par un seul full-stack, dans le cadre d’un mémoire universitaire. Nous assumons cette échelle et nous la transformons en atout : décisions rapides, code ouvert, transparence sur les limites, orientation PME française non négociable.
            </p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['1', 'Développeur solo'],
              ['3', 'Modules complémentaires'],
              ['34', 'PME sondées'],
              ['0 €', 'Budget audit de 35% des PME'],
            ].map(([value, label], index) => (
              <RevealOnScroll key={label} delay={index * 0.06}>
                <div className="rounded-[24px] border border-white/10 bg-[#0d0d0f] p-5 text-center transition-transform duration-300 hover:-translate-y-1">
                <p className="text-3xl font-semibold text-white">{value}</p>
                <p className="mt-2 text-sm text-white/55">{label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Manières de contribuer</h2>
          <p className="mt-3 text-sm text-white/58">{jobs.length} pistes ouvertes pour rejoindre le projet, sans lien salarial.</p>

          <div className="mt-10 space-y-4">
            {jobs.map((job, index) => (
              <RevealOnScroll key={job.title} delay={index * 0.05}>
                <article className="rounded-[26px] border border-white/10 bg-[#0d0d0f] p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <span className="rounded-full border border-brand-primary/25 bg-brand-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-brand-cotton">
                        {job.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/58">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/45">
                      <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.department}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    </div>
                  </div>
                  <Button asChild className="rounded-full bg-white text-black hover:bg-white/90"><Link href="/contact">Nous écrire</Link></Button>
                </div>
                </article>
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
              Une autre idée pour contribuer au projet ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Écrivez-nous directement. Toute forme d’aide qui sert les PME françaises est bienvenue : retours d’usage, références juridiques, relecture de rapports, suggestions.
            </p>
            <Button asChild className="mt-8 rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
              <Link href="/contact">
                Nous contacter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}