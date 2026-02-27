import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Shield, ChevronRight, Lock, Eye, Database, Globe, Mail, User } from 'lucide-react'

export const metadata = {
  title: 'Politique de Confidentialité - AuditIQ',
  description: 'Politique de confidentialité et protection des données personnelles d\'AuditIQ.',
}

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    icon: Shield,
    content: `AuditIQ SAS ("nous", "notre", "AuditIQ") s'engage a protéger la vie privée de ses utilisateurs. Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez notre Service.`
  },
  {
    id: 'collecte',
    title: '2. Données Collectées',
    icon: Database,
    content: `Nous collectons les catégories de données suivantes :`,
    subsections: [
      {
        title: 'Données d\'identification',
        items: ['Nom et prénom', 'Adresse email', 'Nom de l\'entreprise', 'Fonction']
      },
      {
        title: 'Données d\'utilisation',
        items: ['Logs de connexion', 'Actions réalisées sur la plateforme', 'Adresse IP', 'Type de navigateur']
      },
      {
        title: 'Données métier',
        items: ['Datasets uploadés pour analyse', 'Configurations d\'audit', 'Résultats d\'audit']
      }
    ]
  },
  {
    id: 'finalites',
    title: '3. Finalités du Traitement',
    icon: Eye,
    content: `Vos données sont traitées pour les finalités suivantes :`,
    list: [
      'Fourniture et gestion du Service',
      'Amélioration de nos algorithmes et de l\'expérience utilisateur',
      'Communication relative au Service (notifications, mises a jour)',
      'Facturation et gestion des abonnements',
      'Respect de nos obligations légales',
      'Prévention de la fraude et sécurité'
    ]
  },
  {
    id: 'base-legale',
    title: '4. Base Légale du Traitement',
    icon: Lock,
    content: `Le traitement de vos données repose sur : l'execution du contrat de service, notre intérêt légitime à améliorer nos services, votre consentement pour certaines communications, et nos obligations légales.`
  },
  {
    id: 'partage',
    title: '5. Partage des Données',
    icon: Globe,
    content: `Nous ne vendons pas vos données personnelles. Nous pouvons partager vos données avec :`,
    list: [
      'Nos sous-traitants techniques (hébergement, emailing) sous accord de confidentialité',
      'Les autorités compétentes si la loi l\'exige',
      'En cas de fusion ou acquisition, le repreneur eventuel'
    ]
  },
  {
    id: 'securite',
    title: '6. Sécurité des Données',
    icon: Shield,
    content: `Nous mettons en oeuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données : chiffrement en transit (TLS) et au repos, controles d'acces, audits de sécurité réguliers, formation de nos employés.`
  },
  {
    id: 'conservation',
    title: '7. Conservation des Données',
    icon: Database,
    content: `Vos données sont conservées pendant la durée de votre utilisation du Service, puis archivées pendant les durées légales applicables (ex: 5 ans pour les données de facturation). Les datasets uploadés sont supprimés 90 jours après la clôture du compte.`
  },
  {
    id: 'droits',
    title: '8. Vos Droits (RGPD)',
    icon: User,
    content: `Conformément au RGPD, vous disposez des droits suivants :`,
    rights: [
      { name: 'Droit d\'accès', desc: 'obtenir une copie de vos données' },
      { name: 'Droit de rectification', desc: 'corriger des données inexactes' },
      { name: 'Droit a l\'effacement', desc: 'demander la suppression de vos données' },
      { name: 'Droit a la portabilité', desc: 'recevoir vos données dans un format structuré' },
      { name: 'Droit d\'opposition', desc: 'vous opposer a certains traitements' },
      { name: 'Droit a la limitation', desc: 'limiter le traitement de vos données' }
    ],
    footer: 'Pour exercer vos droits, contactez-nous a : privacy@auditiq.ai'
  },
  {
    id: 'cookies',
    title: '9. Cookies',
    icon: Eye,
    content: `Nous utilisons des cookies essentiels au fonctionnement du Service et des cookies analytiques pour comprendre l'utilisation de notre plateforme. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.`
  },
  {
    id: 'transferts',
    title: '10. Transferts Internationaux',
    icon: Globe,
    content: `Vos données sont hébergées au sein de l'Union Européenne. En cas de transfert hors UE, nous nous assurons que des garanties appropriées sont mises en place (clauses contractuelles types).`
  },
  {
    id: 'modifications',
    title: '11. Modifications',
    icon: Shield,
    content: `Nous pouvons modifier cette Politique de Confidentialité. Les modifications importantes vous seront notifiées par email ou via le Service.`
  },
  {
    id: 'contact',
    title: '12. Contact DPO',
    icon: Mail,
    content: `Pour toute question relative a la protection de vos données, vous pouvez contacter notre Délégué à la Protection des Données : dpo@auditiq.ai`,
    footer: 'Vous disposez également du droit d\'introduire une réclamation auprès de la CNIL (www.cnil.fr).'
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
            <span className="text-primary">Confidentialité</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Politique de Confidentialité</h1>
              <p className="text-muted-foreground mt-2">Dernière mise à jour : 1er Janvier 2025</p>
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
              Points Clés
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">RGPD</div>
                <div className="text-sm text-muted-foreground">Conforme</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card">
                <div className="text-2xl font-bold text-primary">UE</div>
                <div className="text-sm text-muted-foreground">Hébergement</div>
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
            <h3 className="font-semibold mb-4">Documents juridiques associés</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/terms" className="text-primary hover:underline">Conditions Générales d'Utilisation</Link>
              <Link href="/legal/cgu" className="text-primary hover:underline">Mentions Légales</Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
