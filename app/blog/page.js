import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronRight, Clock3, Search, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarketingFooter } from '@/components/ui/marketing-footer'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: 'Blog - AuditIQ',
  description: 'Articles et ressources sur la gouvernance IA, l équité et la conformité algorithmique.',
}

const categories = ['Tous', 'Gouvernance', 'Technique', 'Réglementation', 'Étude de cas', 'Produit']

const featuredPost = {
  title: 'AI Act 2026 : comment transformer des obligations de conformité en routines produit',
  excerpt:
    'Un cadre pratique pour passer des exigences réglementaires à un système d audit opérationnel et partageable.',
  author: 'Dr. Marie Laurent',
  date: '16 mars 2026',
  readTime: '9 min',
  category: 'Réglementation',
}

const posts = [
  {
    title: 'Designer une revue d équité lisible pour le légal et le produit',
    excerpt: 'Comment rendre les métriques techniques actionnables pour les équipes non data.',
    author: 'Nora Diallo',
    date: '10 mars 2026',
    readTime: '6 min',
    category: 'Gouvernance',
  },
  {
    title: 'Analyse what-if : éviter les faux positifs de remédiation',
    excerpt: 'Un guide de scénarios pour tester les arbitrages avant de toucher au modèle en production.',
    author: 'Sami Belaid',
    date: '4 mars 2026',
    readTime: '7 min',
    category: 'Technique',
  },
  {
    title: 'Étude de cas fintech : 68% de temps gagné sur la préparation des comités',
    excerpt: 'Retour terrain sur la centralisation des preuves d audit et des décisions de mitigation.',
    author: 'Ines Caron',
    date: '26 février 2026',
    readTime: '8 min',
    category: 'Étude de cas',
  },
  {
    title: 'Mise en place d un registre d audit IA sans tableur',
    excerpt: 'Les structures minimales pour commencer proprement sans ralentir les squads produit.',
    author: 'Franck Fambou',
    date: '18 février 2026',
    readTime: '5 min',
    category: 'Produit',
  },
  {
    title: 'Mesurer la dérive et l équité au même rythme de mise en production',
    excerpt: 'Pourquoi separer ces sujets cree des angles morts dans la gouvernance.',
    author: 'Nora Diallo',
    date: '11 février 2026',
    readTime: '7 min',
    category: 'Technique',
  },
  {
    title: 'Prioriser les remédiations : impact risque vs impact métier',
    excerpt: 'Un modele simple pour sequencer les actions correctives avec les bonnes parties prenantes.',
    author: 'Ines Caron',
    date: '3 février 2026',
    readTime: '6 min',
    category: 'Gouvernance',
  },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function BlogPage() {
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
              <Link href="/blog" className="text-white">Blog</Link>
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
              <span>Blog</span>
            </div>
            <RevealOnScroll className="mt-8 max-w-4xl" duration={0.65}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Éditorial
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Ressources pour operer une gouvernance IA claire et durable.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Analyses, retours d experience et guides pratiques pour structurer vos audits et vos plans de remediation.
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="mt-8 max-w-md" delay={0.08}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <Input placeholder="Rechercher un article" className="border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/30" />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </div>

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {categories.map((category, index) => (
            <RevealOnScroll key={category} delay={index * 0.04} y={16}>
              <button
              key={category}
              type="button"
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                index === 0
                  ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-cotton'
                  : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06]'
              }`}
            >
              {category}
              </button>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="px-5 pb-14 sm:px-8 lg:px-10 lg:pb-20">
        <RevealOnScroll className="mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-[#0d0d0f] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(140deg,rgba(226,8,161,0.16),rgba(104,54,176,0.16)_42%,rgba(255,255,255,0.03))] p-6 framer-float">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Article vedette</p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">AI Act 2026</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">{featuredPost.excerpt}</p>
            </div>
            <div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/55">
                {featuredPost.category}
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{featuredPost.title}</h3>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/52">
                <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{featuredPost.author}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{featuredPost.date}</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{featuredPost.readTime}</span>
              </div>
              <Button className="mt-6 rounded-full bg-brand-primary text-white hover:bg-brand-primary/90">
                Lire l article
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="border-y border-white/8 bg-white/[0.015] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Articles recents</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <RevealOnScroll key={post.title} delay={index * 0.05}>
                <article className="rounded-[26px] border border-white/10 bg-[#0d0d0f] p-5 transition-transform duration-300 hover:-translate-y-1.5 hover:border-white/20">
                <p className="text-[10px] uppercase tracking-[0.15em] text-brand-cotton">{post.category}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{post.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/45">
                  <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{post.readTime}</span>
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
              Recevez nos analyses produit et conformité directement par e-mail.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Une newsletter concise, orientée actions, pour vos équipes data, produit et légal.
            </p>
            <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <Input placeholder="votre@email.com" className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/30" />
              <Button className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">S abonner</Button>
            </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}