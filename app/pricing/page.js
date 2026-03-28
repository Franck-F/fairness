'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, HelpCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

const plans = [
  {
    name: 'Essai gratuit',
    monthly: 0,
    annual: 0,
    description: 'Pour tester la plateforme sur un cas d usage réel, sans engagement.',
    cta: 'Essayer gratuitement',
    href: '/signup',
    featured: false,
    features: ['1 projet actif', 'Métriques de base', 'Rapport synthétique', 'Support communautaire'],
  },
  {
    name: 'Starter',
    monthly: 37,
    annual: 31,
    description: 'Pour lancer vos premiers audits et structurer un socle de gouvernance.',
    cta: 'Commencer',
    href: '/signup',
    featured: false,
    features: ['3 projets actifs', 'Mesures d équité essentielles', 'Exports PDF', 'Support par e-mail'],
  },
  {
    name: 'Professionnel',
    monthly: 75,
    annual: 62,
    description: 'Pour les équipes qui veulent industrialiser la revue des modèles à risque.',
    cta: 'Demander une démo',
    href: '/contact',
    featured: true,
    features: ['Automations avancées', 'Scénarios what-if', 'Collaboration équipe', 'Rapports prioritaires'],
  },
  {
    name: 'Entreprise',
    monthly: null,
    annual: null,
    description: 'Pour les organisations soumises à des exigences fortes de preuve et de gouvernance.',
    cta: 'Planifier un échange',
    href: '/contact',
    featured: false,
    features: ['SSO & gouvernance', 'Programmes dédiés', 'Conformité continue', 'Support expert'],
  },
]

const faqs = [
  {
    question: 'Puis-je changer de plan a tout moment ?',
    answer: 'Oui. Les changements sont immediats et la facturation est ajustee au prorata.',
  },
  {
    question: 'Y a-t-il une periode d essai ?',
    answer: 'Oui. Vous pouvez démarrer avec un essai sur le plan Pro sans engagement long terme.',
  },
  {
    question: 'Comment fonctionne la formule Enterprise ?',
    answer: 'Nous definissons ensemble le perimetre, les integrations et le niveau d accompagnement.',
  },
  {
    question: 'Proposez-vous un support de deploiement ?',
    answer: 'Oui. Onboarding, cadrage des metriques et gouvernance continue peuvent etre inclus.',
  },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

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
              <Link href="/pricing" className="text-white">Tarifs</Link>
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
              <span>Tarifs</span>
            </div>
            <RevealOnScroll className="mt-8 max-w-4xl" duration={0.65}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Tarification
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Le bon niveau de gouvernance IA pour chaque stade de maturité.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Choisissez la formule adaptee a votre maturite, du test initial au pilotage multi-modeles a l echelle.
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0d0d0f] px-4 py-2 text-sm text-white/70" delay={0.08}>
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
            </RevealOnScroll>
          </div>
        </section>
      </div>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.annual : plan.monthly
            return (
              <RevealOnScroll key={plan.name} delay={index * 0.07}>
                <article
                key={plan.name}
                className={`rounded-[30px] border p-6 ${
                  plan.featured
                    ? 'border-brand-primary/35 bg-[linear-gradient(180deg,rgba(226,8,161,0.18),rgba(15,15,17,0.98)_28%)] shadow-[0_18px_50px_rgba(226,8,161,0.18)]'
                    : 'border-white/10 bg-[#0d0d0f]'
                } transition-transform duration-300 hover:-translate-y-1.5 hover:border-white/20`}
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
                </article>
              </RevealOnScroll>
            )
          })}
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.015] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
              FAQ
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">Questions frequentes sur la tarification.</h2>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <RevealOnScroll key={faq.question} delay={index * 0.06}>
                <article className="rounded-[24px] border border-white/10 bg-[#0d0d0f] p-5 transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-4 w-4 text-brand-cotton" />
                  <div>
                    <h3 className="text-sm font-semibold text-white sm:text-base">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/58">{faq.answer}</p>
                  </div>
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
              Besoin d un cadrage sur vos volumes et vos exigences conformite ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Nous pouvons vous aider à choisir la formule qui correspond à votre maturité data et gouvernance.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                <Link href="/contact">
                  Contacter l equipe
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full border border-white/12 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]">
                <Link href="/signup">Tester la plateforme</Link>
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