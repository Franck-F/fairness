import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Shield, ChevronRight, Lock, Eye, Database, Globe, Mail, User } from 'lucide-react'

export const metadata = {
  title: 'Politique de Confidentialite - AuditIQ',
  description: 'Politique de confidentialite et protection des donnees personnelles d\'AuditIQ.',
}

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    icon: Shield,
    content: `AuditIQ SAS ("nous", "notre", "AuditIQ") s'engage a proteger la vie privee de ses utilisateurs. Cette Politique de Confidentialite explique comment nous collectons, utilisons, stockons et protegeons vos informations personnelles lorsque vous utilisez notre Service.`
  },
  {
    id: 'collecte',
    title: '2. Donnees Collectees',
    icon: Database,
    content: `Nous collectons les categories de donnees suivantes :`,
    subsections: [
      {
        title: 'Donnees d\'identification',
        items: ['Nom et prenom', 'Adresse email', 'Nom de l\'entreprise', 'Fonction']
      },
      {
        title: 'Donnees d\'utilisation',
        items: ['Logs de connexion', 'Actions realisees sur la plateforme', 'Adresse IP', 'Type de navigateur']
      },
      {
        title: 'Donnees metier',
        items: ['Datasets uploades pour analyse', 'Configurations d\'audit', 'Resultats d\'audit']
      }
    ]
  },
  {
    id: 'finalites',
    title: '3. Finalites du Traitement',
    icon: Eye,
    content: `Vos donnees sont traitees pour les finalites suivantes :`,
    list: [
      'Fourniture et gestion du Service',
      'Amelioration de nos algorithmes et de l\'experience utilisateur',
      'Communication relative au Service (notifications, mises a jour)',
      'Facturation et gestion des abonnements',
      'Respect de nos obligations legales',
      'Prevention de la fraude et securite'
    ]
  },
  {
    id: 'base-legale',
    title: '4. Base Legale du Traitement',
    icon: Lock,
    content: `Le traitement de vos donnees repose sur : l'execution du contrat de service, notre interet legitime a ameliorer nos services, votre consentement pour certaines communications, et nos obligations legales.`
  },
  {
    id: 'partage',
    title: '5. Partage des Donnees',
    icon: Globe,
    content: `Nous ne vendons pas vos donnees personnelles. Nous pouvons partager vos donnees avec :`,
    list: [
      'Nos sous-traitants techniques (hebergement, emailing) sous accord de confidentialite',
      'Les autorites competentes si la loi l\'exige',
      'En cas de fusion ou acquisition, le repreneur eventuel'
    ]
  },
  {
    id: 'securite',
    title: '6. Securite des Donnees',
    icon: Shield,
    content: `Nous mettons en oeuvre des mesures de securite techniques et organisationnelles appropriees pour proteger vos donnees : chiffrement en transit (TLS) et au repos, controles d'acces, audits de securite reguliers, formation de nos employes.`
  },
  {
    id: 'conservation',
    title: '7. Conservation des Donnees',
    icon: Database,
    content: `Vos donnees sont conservees pendant la duree de votre utilisation du Service, puis archivees pendant les durees legales applicables (ex: 5 ans pour les donnees de facturation). Les datasets uploades sont supprimes 90 jours apres la cloture du compte.`
  },
  {
    id: 'droits',
    title: '8. Vos Droits (RGPD)',
    icon: User,
    content: `Conformement au RGPD, vous disposez des droits suivants :`,
    rights: [
      { name: 'Droit d\'acces', desc: 'obtenir une copie de vos donnees' },
      { name: 'Droit de rectification', desc: 'corriger des donnees inexactes' },
      { name: 'Droit a l\'effacement', desc: 'demander la suppression de vos donnees' },
      { name: 'Droit a la portabilite', desc: 'recevoir vos donnees dans un format structure' },
      { name: 'Droit d\'opposition', desc: 'vous opposer a certains traitements' },
      { name: 'Droit a la limitation', desc: 'limiter le traitement de vos donnees' }
    ],
    footer: 'Pour exercer vos droits, contactez-nous a : privacy@auditiq.ai'
  },
  {
    id: 'cookies',
    title: '9. Cookies',
    icon: Eye,
    content: `Nous utilisons des cookies essentiels au fonctionnement du Service et des cookies analytiques pour comprendre l'utilisation de notre plateforme. Vous pouvez gerer vos preferences de cookies via les parametres de votre navigateur.`
  },
  {
    id: 'transferts',
    title: '10. Transferts Internationaux',
    icon: Globe,
    content: `Vos donnees sont hebergees au sein de l'Union Europeenne. En cas de transfert hors UE, nous nous assurons que des garanties appropriees sont mises en place (clauses contractuelles types).`
  },
  {
    id: 'modifications',
    title: '11. Modifications',
    icon: Shield,
    content: `Nous pouvons modifier cette Politique de Confidentialite. Les modifications importantes vous seront notifiees par email ou via le Service.`
  },
  {
    id: 'contact',
    title: '12. Contact DPO',
    icon: Mail,
    content: `Pour toute question relative a la protection de vos donnees, vous pouvez contacter notre Delegue a la Protection des Donnees : dpo@auditiq.ai`,
    footer: 'Vous disposez egalement du droit d\'introduire une reclamation aupres de la CNIL (www.cnil.fr).'
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={140}
              height={56}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login"><Button variant="ghost">Connexion</Button></Link>
            <Link href="/signup"><Button>Commencer</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Legal</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Confidentialite</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Politique de Confidentialite</h1>
              <p className="text-muted-foreground mt-2">Derniere mise a jour : 1er Janvier 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Key Points */}
          <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Points Cles
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">RGPD</div>
                <div className="text-sm text-muted-foreground">Conforme</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">UE</div>
                <div className="text-sm text-muted-foreground">Hebergement</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">TLS</div>
                <div className="text-sm text-muted-foreground">Chiffrement</div>
              </div>
            </div>
          </Card>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id} id={section.id} className="p-8 bg-card hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    
                    {section.list && (
                      <ul className="mt-4 space-y-2">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.subsections && (
                      <div className="mt-6 grid md:grid-cols-3 gap-4">
                        {section.subsections.map((sub, i) => (
                          <div key={i} className="p-4 rounded-lg bg-muted/30">
                            <h4 className="font-semibold mb-2 text-sm">{sub.title}</h4>
                            <ul className="space-y-1">
                              {sub.items.map((item, j) => (
                                <li key={j} className="text-sm text-muted-foreground">{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.rights && (
                      <div className="mt-6 grid md:grid-cols-2 gap-3">
                        {section.rights.map((right, i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/30 flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold">{right.name}</span>
                              <span className="text-muted-foreground"> : {right.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.footer && (
                      <p className="mt-4 text-muted-foreground text-sm bg-muted/30 p-3 rounded-lg">
                        {section.footer}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation vers autres pages legales */}
          <Card className="p-6 mt-12 bg-card/50">
            <h3 className="font-semibold mb-4">Documents juridiques associes</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/terms" className="text-primary hover:underline">Conditions Generales d'Utilisation</Link>
              <Link href="/legal/cgu" className="text-primary hover:underline">Mentions Legales</Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
