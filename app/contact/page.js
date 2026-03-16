'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, ChevronRight, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MarketingFooter } from '@/components/ui/marketing-footer'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { Textarea } from '@/components/ui/textarea'

const logoUrl = 'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'contact@auditiq.ai', href: 'mailto:contact@auditiq.ai' },
  { icon: Phone, label: 'Telephone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
  { icon: MapPin, label: 'Adresse', value: '42 Rue de l Innovation, 75008 Paris', href: '' },
  { icon: Clock3, label: 'Horaires', value: 'Lun-Ven: 9h-18h', href: '' },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    toast.success('Message envoyé. Notre équipe vous répond sous 24h.')
    setFormData({ name: '', email: '', company: '', subject: '', message: '' })
    setLoading(false)
  }

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
              <Link href="/contact" className="text-white">Contact</Link>
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
              <span>Contact</span>
            </div>
            <RevealOnScroll className="mt-8 max-w-4xl" duration={0.65}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Contact
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Parlons de votre gouvernance IA et de vos besoins de conformité.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Une question, un cadrage, un besoin de démonstration : notre équipe vous accompagne pour structurer un déploiement solide.
              </p>
            </RevealOnScroll>
          </div>
        </section>
      </div>

      <section className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-4">
            <RevealOnScroll>
              <div className="rounded-[28px] border border-white/10 bg-[#0d0d0f] p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Building2 className="h-4 w-4 text-brand-cotton" />
                Informations de contact
              </h2>
              <div className="mt-5 space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <RevealOnScroll key={item.label} delay={index * 0.05} y={18}>
                      <div className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-3 transition-transform duration-300 hover:-translate-y-0.5 hover:border-white/20">
                      <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                        <Icon className="h-4 w-4 text-brand-cotton" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm text-white/82 hover:text-white">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-white/82">{item.value}</p>
                        )}
                      </div>
                      </div>
                    </RevealOnScroll>
                  )
                })}
              </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(226,8,161,0.18),rgba(117,45,177,0.18)_55%,rgba(255,255,255,0.03))] p-5 framer-float">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Support client</p>
              <p className="mt-3 text-sm leading-7 text-white/78">
                Deja client ? Accedez a votre dashboard pour suivre vos tickets et partager vos retours d audit avec nos experts.
              </p>
              <Button asChild className="mt-5 rounded-full bg-white text-black hover:bg-white/90">
                <Link href="/login">Acceder au support</Link>
              </Button>
              </div>
            </RevealOnScroll>
          </aside>

          <RevealOnScroll delay={0.1}>
            <div className="rounded-[30px] border border-white/10 bg-[#0d0d0f] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-white">Envoyez-nous un message</h2>
            <p className="mt-2 text-sm text-white/58">Nous vous repondons rapidement avec des recommandations concretes.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/78">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    placeholder="Jean Dupont"
                    required
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/78">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    placeholder="jean@entreprise.com"
                    required
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/25"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white/78">Entreprise</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(event) => setFormData({ ...formData, company: event.target.value })}
                    placeholder="Nom de votre entreprise"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white/78">Sujet</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                    placeholder="Demo, pricing, support..."
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/78">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  placeholder="Decrivez votre contexte, vos objectifs et vos contraintes..."
                  rows={7}
                  required
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-white/25"
                />
              </div>

              <Button type="submit" disabled={loading} className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                {loading ? 'Envoi en cours...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-t border-white/8 px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(117,45,177,0.22)_55%,rgba(226,8,161,0.22))] px-6 py-10 text-center sm:px-10 sm:py-14">
            <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Besoin d accélérer votre feuille de route de conformité IA ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              On peut commencer par un cadrage rapide puis prioriser les actions les plus impactantes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-brand-primary px-6 text-white hover:bg-brand-primary/90">
                <Link href="/signup">
                  Tester la plateforme
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full border border-white/12 bg-white/[0.03] px-6 text-white hover:bg-white/[0.06]">
                <Link href="/pricing">Voir les tarifs</Link>
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