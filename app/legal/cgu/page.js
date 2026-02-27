import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Building2, ChevronRight, User, Server, Copyright, Database, Cookie, Link2, AlertTriangle, Scale, Phone } from 'lucide-react'

export const metadata = {
  title: 'Mentions Légales - AuditIQ',
  description: 'Mentions légales et informations sur l\'éditeur du site AuditIQ.',
}

const sections = [
  {
    id: 'editeur',
    title: '1. Éditeur du Site',
    icon: Building2,
    content: 'Le site AuditIQ (www.auditiq.ai) est édité par :',
    details: [
      { label: 'Raison sociale', value: 'AuditIQ SAS' },
      { label: 'Forme juridique', value: 'Société par Actions Simplifiée au capital de 50 000 euros' },
      { label: 'Siege social', value: '42 Rue de l\'Innovation, 75008 Paris, France' },
      { label: 'RCS Paris', value: '912 345 678' },
      { label: 'TVA', value: 'FR 12 912345678' },
      { label: 'Email', value: 'contact@auditiq.ai' },
      { label: 'Téléphone', value: '+33 1 23 45 67 89' }
    ]
  },
  {
    id: 'directeur',
    title: '2. Directeur de la Publication',
    icon: User,
    content: 'Dr. Marie Laurent, Présidente d\'AuditIQ SAS'
  },
  {
    id: 'hebergement',
    title: '3. Hébergement',
    icon: Server,
    content: 'Le site est hébergé par :',
    details: [
      { label: 'Hébergeur', value: 'Vercel Inc.' },
      { label: 'Adresse', value: '340 S Lemon Ave #4133, Walnut, CA 91789, USA' },
      { label: 'Site', value: 'https://vercel.com' }
    ],
    footer: 'Les données sont stockées sur des serveurs situés dans l\'Union Européenne (AWS Frankfurt).'
  },
  {
    id: 'propriete',
    title: '4. Propriété Intellectuelle',
    icon: Copyright,
    content: `L'ensemble des éléments constituant le site AuditIQ (textes, graphismes, logiciels, photographies, images, sons, plans, noms, logos, marques, créations et œuvres protégées diverses, bases de données, etc.) ainsi que le site lui-meme, sont la propriété exclusive d'AuditIQ SAS ou de tiers ayant autorisé AuditIQ à les utiliser.`,
    footer: 'Ces éléments sont protégés par les lois françaises et internationales relatives a la propriété intellectuelle. Toute reproduction, representation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable d\'AuditIQ.'
  },
  {
    id: 'donnees',
    title: '5. Données Personnelles',
    icon: Database,
    content: `Le traitement des données personnelles collectées sur ce site est regi par notre Politique de Confidentialité.`,
    footer: 'Conformement au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits sur vos données personnelles que vous pouvez exercer en contactant notre DPO a l\'adresse : dpo@auditiq.ai',
    link: { href: '/legal/privacy', text: 'Voir notre Politique de Confidentialité' }
  },
  {
    id: 'cookies',
    title: '6. Cookies',
    icon: Cookie,
    content: `Le site utilise des cookies pour son fonctionnement et pour réaliser des statistiques de visite. Pour en savoir plus sur notre utilisation des cookies et gerer vos préférences, consultez notre Politique de Confidentialité.`
  },
  {
    id: 'liens',
    title: '7. Liens Hypertextes',
    icon: Link2,
    content: `Le site peut contenir des liens hypertextes vers d'autres sites. AuditIQ n'exerce aucun controle sur ces sites et decline toute responsabilite quant a leur contenu. La decision d'activer ces liens releve de la pleine et entiere responsabilite de l'utilisateur.`
  },
  {
    id: 'responsabilite',
    title: '8. Limitation de Responsabilite',
    icon: AlertTriangle,
    content: `AuditIQ s'efforce de fournir des informations aussi précises que possible. Toutefois, AuditIQ ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise a jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.`
  },
  {
    id: 'droit',
    title: '9. Droit Applicable',
    icon: Scale,
    content: `Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux de Paris seront seuls compétents.`
  },
  {
    id: 'contact',
    title: '10. Contact',
    icon: Phone,
    content: 'Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :',
    contacts: [
      { type: 'Email', value: 'legal@auditiq.ai' },
      { type: 'Courrier', value: 'AuditIQ SAS - 42 Rue de l\'Innovation, 75008 Paris' },
      { type: 'Telephone', value: '+33 1 23 45 67 89' }
    ]
  }
]

export default function CGUPage() {
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
            <span className="text-primary">Mentions Légales</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Mentions Légales</h1>
              <p className="text-muted-foreground mt-2">Dernière mise à jour : 1er Janvier 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Company Card */}
          <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AuditIQ SAS</h2>
                <p className="text-muted-foreground">Plateforme d'audit de fairness IA</p>
                <p className="text-sm text-muted-foreground mt-1">42 Rue de l'Innovation, 75008 Paris</p>
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
                    
                    {section.details && (
                      <div className="mt-4 p-4 rounded-lg bg-muted/30">
                        {section.details.map((detail, i) => (
                          <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                            <span className="text-muted-foreground">{detail.label}</span>
                            <span className="font-medium text-right">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.contacts && (
                      <div className="mt-4 grid md:grid-cols-3 gap-3">
                        {section.contacts.map((contact, i) => (
                          <div key={i} className="p-4 rounded-lg bg-muted/30 text-center">
                            <span className="text-sm text-muted-foreground block mb-1">{contact.type}</span>
                            <span className="font-medium">{contact.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.footer && (
                      <p className="mt-4 text-muted-foreground text-sm bg-muted/30 p-3 rounded-lg">
                        {section.footer}
                      </p>
                    )}

                    {section.link && (
                      <Link 
                        href={section.link.href} 
                        className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                      >
                        {section.link.text}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
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
              <Link href="/legal/privacy" className="text-primary hover:underline">Politique de Confidentialité</Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
