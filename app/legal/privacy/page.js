import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronRight,
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MarketingFooter } from '@/components/ui/marketing-footer'

const logoUrl =
  'https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png'

export const metadata = {
  title: 'Politique de confidentialité - AuditIQ',
  description:
    'Politique de confidentialite et protection des donnees personnelles d AuditIQ.',
}

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    icon: Shield,
    content:
      'AuditIQ SAS (nous, notre, AuditIQ) s engage a proteger la vie privee de ses utilisateurs. Cette politique explique comment nous collectons, utilisons, stockons et protegeons vos informations personnelles.',
  },
  {
    id: 'collecte',
    title: '2. Donnees collecte',
    icon: Database,
    content: 'Nous collectons les categories de donnees suivantes :',
    subsections: [
      {
        title: 'Donnees d identification',
        items: ['Nom et prenom', 'Adresse email', 'Nom de l entreprise', 'Fonction'],
      },
      {
        title: 'Donnees d utilisation',
        items: [
          'Logs de connexion',
          'Actions realisees sur la plateforme',
          'Adresse IP',
          'Type de navigateur',
        ],
      },
      {
        title: 'Donnees metier',
        items: ['Datasets uploades pour analyse', 'Configurations d audit', 'Resultats d audit'],
      },
    ],
  },
  {
    id: 'finalites',
    title: '3. Finalites du traitement',
    icon: Eye,
    content: 'Vos donnees sont traitees pour les finalites suivantes :',
    list: [
      'Fourniture et gestion du service',
      'Amelioration de l experience utilisateur',
      'Communication relative au service',
      'Facturation et gestion des abonnements',
      'Respect de nos obligations legales',
      'Prevention de la fraude et securite',
    ],
  },
  {
    id: 'base-legale',
    title: '4. Base legale du traitement',
    icon: Lock,
    content:
      'Le traitement repose sur l execution du contrat, notre interet legitime a ameliorer nos services, votre consentement pour certaines communications et nos obligations legales.',
  },
  {
    id: 'partage',
    title: '5. Partage des donnees',
    icon: Globe,
    content: 'Nous ne vendons pas vos donnees personnelles. Elles peuvent etre partagees avec :',
    list: [
      'Nos sous-traitants techniques sous accord de confidentialite',
      'Les autorites competentes si la loi l exige',
      'Le repreneur eventuel en cas de fusion ou acquisition',
    ],
  },
  {
    id: 'securite',
    title: '6. Securite des donnees',
    icon: Shield,
    content:
      'Nous mettons en oeuvre des mesures techniques et organisationnelles adaptees : chiffrement TLS, protection au repos, controles d acces, audits de securite et formation des equipes.',
  },
  {
    id: 'conservation',
    title: '7. Conservation des donnees',
    icon: Database,
    content:
      'Vos donnees sont conservees pendant la duree d utilisation du service puis archivees selon les durees legales applicables. Les datasets uploades sont supprimes 90 jours apres cloture du compte.',
  },
  {
    id: 'droits',
    title: '8. Vos droits (RGPD)',
    icon: User,
    content: 'Conformement au RGPD, vous disposez des droits suivants :',
    rights: [
      { name: 'Droit d acces', desc: 'obtenir une copie de vos donnees' },
      { name: 'Droit de rectification', desc: 'corriger des donnees inexactes' },
      { name: 'Droit a l effacement', desc: 'demander la suppression de vos donnees' },
      { name: 'Droit a la portabilite', desc: 'recevoir vos donnees dans un format structure' },
      { name: 'Droit d opposition', desc: 'vous opposer a certains traitements' },
      { name: 'Droit a la limitation', desc: 'limiter le traitement de vos donnees' },
    ],
    footer: 'Pour exercer vos droits, contactez-nous a : privacy@auditiq.ai',
  },
  {
    id: 'cookies',
    title: '9. Cookies',
    icon: Eye,
    content:
      'Nous utilisons des cookies essentiels et des cookies analytiques. Vous pouvez gerer vos preferences via les parametres de votre navigateur.',
  },
  {
    id: 'transferts',
    title: '10. Transferts internationaux',
    icon: Globe,
    content:
      'Vos donnees sont hebergees au sein de l Union Europeenne. En cas de transfert hors UE, des garanties appropriees sont appliquees (clauses contractuelles types).',
  },
  {
    id: 'modifications',
    title: '11. Modifications',
    icon: Shield,
    content:
      'Nous pouvons modifier cette politique. Les changements importants sont notifies par email ou via le service.',
  },
  {
    id: 'contact',
    title: '12. Contact DPO',
    icon: Mail,
    content:
      'Pour toute question sur la protection de vos donnees, contactez notre Delegue a la Protection des Donnees : dpo@auditiq.ai',
    footer:
      'Vous disposez egalement du droit d introduire une reclamation aupres de la CNIL (www.cnil.fr).',
  },
]

function GridGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-45">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(153,66,255,0.22),transparent_22%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    </div>
  )
}

export default function PrivacyPage() {
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
              <span>Confidentialité</span>
            </div>
            <div className="mt-8 max-w-4xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                Légal
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Politique de confidentialité
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
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {[
              ['RGPD', 'Conforme'],
              ['UE', 'Hebergement'],
              ['TLS', 'Chiffrement'],
            ].map(([value, label]) => (
              <div key={value} className="rounded-[24px] border border-white/10 bg-[#0d0d0f] p-5 text-center">
                <p className="text-2xl font-semibold text-white">{value}</p>
                <p className="mt-2 text-sm text-white/55">{label}</p>
              </div>
            ))}
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

                      {section.subsections ? (
                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                          {section.subsections.map((sub) => (
                            <div key={sub.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                              <h3 className="text-sm font-semibold text-white">{sub.title}</h3>
                              <ul className="mt-2 space-y-1.5 text-sm text-white/58">
                                {sub.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {section.rights ? (
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {section.rights.map((right) => (
                            <div key={right.name} className="rounded-2xl border border-white/8 bg-white/[0.02] p-3 text-sm text-white/68">
                              <span className="font-semibold text-white">{right.name}</span>
                              <span className="text-white/58"> : {right.desc}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {section.footer ? (
                        <p className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-3 text-sm text-white/60">
                          {section.footer}
                        </p>
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
              <Link href="/legal/cgu" className="hover:text-white">Mentions légales</Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
