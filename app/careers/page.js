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
  { icon: Heart, title: 'Sante', description: 'Mutuelle premium et couverture complete.' },
  { icon: Clock3, title: 'Flexibilite', description: 'Organisation hybride et horaires souples.' },
  { icon: Zap, title: 'Formation', description: 'Budget formation continue pour progresser vite.' },
  { icon: Globe2, title: 'International', description: 'Équipe multiculturelle et pratique de l anglais.' },
  { icon: Users, title: 'Culture équipe', description: 'Rituels de partage, feedback et apprentissage.' },
  { icon: Building2, title: 'Impact réel', description: 'Travail au coeur des enjeux IA et conformité.' },
]

const jobs = [
  {
    title: 'Senior ML Engineer',
    department: 'Engineering',
    location: 'Paris / Remote',
    type: 'CDI',
    description: 'Développez les moteurs d évaluation d équité et les flux d audit automatisé.',
  },
  {
    title: 'Full Stack Engineer',
    department: 'Engineering',
    location: 'Paris / Remote',
    type: 'CDI',
    description: 'Concevez les surfaces produit qui relient data, produit et conformité.',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Paris',
    type: 'CDI',
    description: 'Pilotez la roadmap de gouvernance IA et les parcours de remediation.',
  },
  {
    title: 'Data Scientist Équité',
    department: 'Research',
    location: 'Paris / Remote',
    type: 'CDI',
    description: 'Renforcez les methodes d analyse de biais et la robustesse des recommandations.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Paris',
    type: 'CDI',
    description: 'Accompagnez les clients dans le deploiement de leur gouvernance continue.',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Paris / Remote',
    type: 'CDI',
    description: 'Fiabilisez l infrastructure produit et la qualite de service a grande echelle.',
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
                Nous recrutons
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Rejoignez l équipe qui rend la gouvernance IA vraiment opérationnelle.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Nous construisons des outils qui relient rigueur technique, adoption métier et exigences de conformité.
              </p>
              <Button className="mt-8 rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                Voir les offres
                <ArrowRight className="h-4 w-4" />
              </Button>
            </RevealOnScroll>
          </div>
        </section>
      </div>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Pourquoi nous rejoindre</h2>
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
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Une culture d execution, de transparence et d apprentissage.</h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Chez AuditIQ, nous croyons que la qualite des decisions depend autant des donnees que des discussions entre equipes.
              Nous privilegions une communication claire, des feedbacks frequents et des objectifs lisibles.
            </p>
            </div>
          </RevealOnScroll>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['35', 'Collaborateurs'],
              ['12', 'Nationalites'],
              ['45%', 'Femmes dans la team'],
              ['4.8', 'Note Glassdoor'],
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
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Postes ouverts</h2>
          <p className="mt-3 text-sm text-white/58">{jobs.length} postes disponibles actuellement.</p>

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
                  <Button className="rounded-full bg-white text-black hover:bg-white/90">Postuler</Button>
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
              Vous ne trouvez pas encore votre poste ideal ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Envoyez-nous une candidature spontanee, nous sommes toujours a la recherche de profils forts.
            </p>
            <Button asChild className="mt-8 rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
              <Link href="/contact">
                Candidature spontanee
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