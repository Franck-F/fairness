import Image from 'next/image'
import Link from 'next/link'
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  Cookie,
  Copyright,
  Database,
  Link2,
  Phone,
  Scale,
  Server,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'

const logoUrl =
  'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: 'Mentions légales - AuditIQ',
  description: 'Mentions legales et informations sur l editeur du site AuditIQ.',
}

const sections = [
  {
    id: 'editeur',
    title: '1. Editeur du site',
    icon: Building2,
    content: 'Le site AuditIQ est edite par :',
    details: [
      { label: 'Raison sociale', value: 'AuditIQ SAS' },
      { label: 'Forme juridique', value: 'SAS au capital de 50 000 EUR' },
      { label: 'Siege social', value: '42 Rue de l Innovation, 75008 Paris, France' },
      { label: 'RCS Paris', value: '912 345 678' },
      { label: 'TVA', value: 'FR 12 912345678' },
      { label: 'Email', value: 'contact@auditiq.ai' },
      { label: 'Telephone', value: '+33 1 23 45 67 89' },
    ],
  },
  {
    id: 'directeur',
    title: '2. Directeur de la publication',
    icon: User,
    content: 'Dr. Marie Laurent, Presidente d AuditIQ SAS',
  },
  {
    id: 'hebergement',
    title: '3. Hebergement',
    icon: Server,
    content: 'Le site est heberge par :',
    details: [
      { label: 'Hebergeur', value: 'Vercel Inc.' },
      { label: 'Adresse', value: '340 S Lemon Ave #4133, Walnut, CA 91789, USA' },
      { label: 'Site', value: 'https://vercel.com' },
    ],
    footer:
      'Les donnees sont stockees sur des serveurs situes dans l Union Europeenne (AWS Frankfurt).',
  },
  {
    id: 'propriete',
    title: '4. Propriete intellectuelle',
    icon: Copyright,
    content:
      'Les elements du site (textes, graphismes, logiciels, images, logos, marques, bases de donnees) sont la propriete d AuditIQ SAS ou de tiers autorises.',
    footer:
      'Toute reproduction ou adaptation de tout ou partie du site est interdite sans autorisation ecrite prealable.',
  },
  {
    id: 'donnees',
    title: '5. Donnees personnelles',
    icon: Database,
    content:
      'Le traitement des donnees personnelles est decrit dans notre politique de confidentialite.',
    footer:
      'Conformement au RGPD, vous pouvez exercer vos droits en contactant dpo@auditiq.ai',
    link: { href: '/legal/privacy', text: 'Voir la politique de confidentialité' },
  },
  {
    id: 'cookies',
    title: '6. Cookies',
    icon: Cookie,
    content:
      'Le site utilise des cookies de fonctionnement et de mesure d audience. Les preferences peuvent etre gerees dans les parametres navigateur.',
  },
  {
    id: 'liens',
    title: '7. Liens hypertextes',
    icon: Link2,
    content:
      'Le site peut contenir des liens vers des sites tiers. AuditIQ n exerce aucun controle sur ces contenus externes.',
  },
  {
    id: 'responsabilite',
    title: '8. Limitation de responsabilite',
    icon: AlertTriangle,
    content:
      'AuditIQ s efforce de fournir des informations exactes et a jour, sans garantie d absence totale d erreur ou omission.',
  },
  {
    id: 'droit',
    title: '9. Droit applicable',
    icon: Scale,
    content:
      'Les presentes mentions legales sont regies par le droit francais. Les tribunaux de Paris sont competents en cas de litige.',
  },
  {
    id: 'contact',
    title: '10. Contact',
    icon: Phone,
    content: 'Pour toute question concernant ces mentions legales :',
    contacts: [
      { type: 'Email', value: 'legal@auditiq.ai' },
      { type: 'Courrier', value: 'AuditIQ SAS - 42 Rue de l Innovation, 75008 Paris' },
      { type: 'Telephone', value: '+33 1 23 45 67 89' },
    ],
  },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function CGUPage() {
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
              <span>Légal</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Mentions légales</span>
            </div>
            <div className="mt-8 max-w-4xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Légal
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Mentions légales
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                Dernière mise à jour : 16 mars 2026
              </p>
            </div>
          </div>
        </section>
      </div>

      <main className="px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 rounded-[24px] border border-white/10 bg-[#0d0d0f] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10">
                <Building2 className="h-5 w-5 text-brand-cotton" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AuditIQ SAS</h2>
                <p className="text-sm text-white/55">Plateforme d audit d équité IA</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <article key={section.id} id={section.id} className="rounded-[28px] border border-white/10 bg-[#0d0d0f] p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10">
                      <Icon className="h-4 w-4 text-brand-cotton" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-white/60">{section.content}</p>

                      {section.details ? (
                        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                          {section.details.map((detail) => (
                            <div key={detail.label} className="flex flex-col gap-1 border-b border-white/8 py-2 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                              <span className="text-sm text-white/50">{detail.label}</span>
                              <span className="text-sm text-white/82">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {section.contacts ? (
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          {section.contacts.map((contact) => (
                            <div key={contact.type} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-center">
                              <p className="text-xs uppercase tracking-[0.16em] text-white/45">{contact.type}</p>
                              <p className="mt-1 text-sm text-white/80">{contact.value}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {section.footer ? (
                        <p className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-3 text-sm text-white/60">
                          {section.footer}
                        </p>
                      ) : null}

                      {section.link ? (
                        <Link href={section.link.href} className="mt-4 inline-flex items-center gap-2 text-sm text-brand-cotton hover:text-white">
                          {section.link.text}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-10 rounded-[24px] border border-white/10 bg-[#0d0d0f] p-5">
            <h3 className="text-base font-semibold text-white">Documents juridiques associes</h3>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/75">
              <Link href="/legal/terms" className="hover:text-white">Conditions générales d'utilisation</Link>
              <Link href="/legal/privacy" className="hover:text-white">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
