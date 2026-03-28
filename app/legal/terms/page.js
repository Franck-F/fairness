import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'

const logoUrl =
  'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: "Conditions générales d'utilisation - AuditIQ",
  description: 'Conditions generales d utilisation de la plateforme AuditIQ.',
}

const sections = [
  {
    id: 'objet',
    title: '1. Objet',
    content:
      'Les presentes Conditions Generales d Utilisation (CGU) definissent les modalites d utilisation des services proposes par AuditIQ ainsi que les droits et obligations des parties.',
  },
  {
    id: 'acceptation',
    title: '2. Acceptation des CGU',
    content:
      'L utilisation du service implique l acceptation pleine et entiere des presentes CGU. En accedant au service, l utilisateur reconnait en avoir pris connaissance.',
  },
  {
    id: 'description',
    title: '3. Description du service',
    content:
      'AuditIQ est une plateforme SaaS d audit d équité et de détection de biais dans les systèmes d intelligence artificielle.',
    list: [
      'Upload et analyse de datasets',
      'Entrainement de modeles de machine learning',
      'Calcul de métriques d équité',
      'Generation de rapports d audit',
      'Assistant IA pour l interpretation des resultats',
    ],
  },
  {
    id: 'inscription',
    title: '4. Inscription et compte utilisateur',
    content: 'L acces au service necessite la creation d un compte utilisateur. L utilisateur s engage a :',
    list: [
      'Fournir des informations exactes et a jour',
      'Maintenir la confidentialite de ses identifiants',
      'Notifier AuditIQ de toute utilisation non autorisee',
    ],
  },
  {
    id: 'propriete',
    title: '5. Propriete intellectuelle',
    content:
      'Les elements constituant le service (logiciels, algorithmes, interfaces, textes, images) sont la propriete d AuditIQ ou de ses partenaires et proteges par les lois applicables.',
  },
  {
    id: 'donnees',
    title: '6. Donnees utilisateur',
    content:
      'L utilisateur reste proprietaire des donnees qu il uploade. AuditIQ les traite uniquement pour fournir le service, conformement a la politique de confidentialite.',
  },
  {
    id: 'responsabilite',
    title: '7. Responsabilite',
    content:
      'AuditIQ s efforce de maintenir le service accessible 24h/24 et 7j/7 sans garantir une disponibilite absolue. AuditIQ ne peut etre tenue responsable des dommages indirects lies a l usage du service.',
  },
  {
    id: 'resiliation',
    title: '8. Resiliation',
    content:
      'L utilisateur peut resilier son compte a tout moment. AuditIQ peut suspendre ou resilier un compte en cas de violation des presentes CGU.',
  },
  {
    id: 'modification',
    title: '9. Modification des CGU',
    content:
      'AuditIQ se reserve le droit de modifier les CGU a tout moment. Les utilisateurs sont informes des modifications par email ou via le service.',
  },
  {
    id: 'droit',
    title: '10. Droit applicable',
    content:
      'Les presentes CGU sont soumises au droit francais. En cas de litige, les tribunaux de Paris sont seuls competents.',
  },
  {
    id: 'contact',
    title: '11. Contact',
    content:
      'Pour toute question concernant les presentes CGU, contactez-nous a legal@auditiq.ai',
  },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function TermsPage() {
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
              <span>CGU</span>
            </div>
            <div className="mt-8 max-w-4xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Légal
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Conditions générales d'utilisation
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
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <FileText className="h-4 w-4 text-brand-cotton" />
              Sommaire
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="text-sm text-white/65 hover:text-white">
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <article key={section.id} id={section.id} className="rounded-[28px] border border-white/10 bg-[#0d0d0f] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10">
                    <span className="text-sm font-semibold text-brand-cotton">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/60">{section.content}</p>
                    {section.list ? (
                      <ul className="mt-4 space-y-2">
                        {section.list.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[24px] border border-white/10 bg-[#0d0d0f] p-5">
            <h3 className="text-base font-semibold text-white">Documents juridiques associes</h3>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/75">
              <Link href="/legal/privacy" className="hover:text-white">Politique de confidentialité</Link>
              <Link href="/legal/cgu" className="hover:text-white">Mentions légales</Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
