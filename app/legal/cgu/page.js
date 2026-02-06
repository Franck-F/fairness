import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Building2, ChevronRight, User, Server, Copyright, Database, Cookie, Link2, AlertTriangle, Scale, Phone } from 'lucide-react'

export const metadata = {
  title: 'Mentions Legales - AuditIQ',
  description: 'Mentions legales et informations sur l\'editeur du site AuditIQ.',
}

const sections = [
  {
    id: 'editeur',
    title: '1. Editeur du Site',
    icon: Building2,
    content: 'Le site AuditIQ (www.auditiq.ai) est edite par :',
    details: [
      { label: 'Raison sociale', value: 'AuditIQ SAS' },
      { label: 'Forme juridique', value: 'Societe par Actions Simplifiee au capital de 50 000 euros' },
      { label: 'Siege social', value: '42 Rue de l\'Innovation, 75008 Paris, France' },
      { label: 'RCS Paris', value: '912 345 678' },
      { label: 'TVA', value: 'FR 12 912345678' },
      { label: 'Email', value: 'contact@auditiq.ai' },
      { label: 'Telephone', value: '+33 1 23 45 67 89' }
    ]
  },
  {
    id: 'directeur',
    title: '2. Directeur de la Publication',
    icon: User,
    content: 'Dr. Marie Laurent, Presidente d\'AuditIQ SAS'
  },
  {
    id: 'hebergement',
    title: '3. Hebergement',
    icon: Server,
    content: 'Le site est heberge par :',
    details: [
      { label: 'Hebergeur', value: 'Vercel Inc.' },
      { label: 'Adresse', value: '340 S Lemon Ave #4133, Walnut, CA 91789, USA' },
      { label: 'Site', value: 'https://vercel.com' }
    ],
    footer: 'Les donnees sont stockees sur des serveurs situes dans l\'Union Europeenne (AWS Frankfurt).'
  },
  {
    id: 'propriete',
    title: '4. Propriete Intellectuelle',
    icon: Copyright,
    content: `L'ensemble des elements constituant le site AuditIQ (textes, graphismes, logiciels, photographies, images, sons, plans, noms, logos, marques, creations et oeuvres protegees diverses, bases de donnees, etc.) ainsi que le site lui-meme, sont la propriete exclusive d'AuditIQ SAS ou de tiers ayant autorise AuditIQ a les utiliser.`,
    footer: 'Ces elements sont proteges par les lois francaises et internationales relatives a la propriete intellectuelle. Toute reproduction, representation, modification, publication, adaptation de tout ou partie des elements du site, quel que soit le moyen ou le procede utilise, est interdite, sauf autorisation ecrite prealable d\'AuditIQ.'
  },
  {
    id: 'donnees',
    title: '5. Donnees Personnelles',
    icon: Database,
    content: `Le traitement des donnees personnelles collectees sur ce site est regi par notre Politique de Confidentialite.`,
    footer: 'Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez de droits sur vos donnees personnelles que vous pouvez exercer en contactant notre DPO a l\'adresse : dpo@auditiq.ai',
    link: { href: '/legal/privacy', text: 'Voir notre Politique de Confidentialite' }
  },
  {
    id: 'cookies',
    title: '6. Cookies',
    icon: Cookie,
    content: `Le site utilise des cookies pour son fonctionnement et pour realiser des statistiques de visite. Pour en savoir plus sur notre utilisation des cookies et gerer vos preferences, consultez notre Politique de Confidentialite.`
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
    content: `AuditIQ s'efforce de fournir des informations aussi precises que possible. Toutefois, AuditIQ ne pourra etre tenue responsable des omissions, des inexactitudes et des carences dans la mise a jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.`
  },
  {
    id: 'droit',
    title: '9. Droit Applicable',
    icon: Scale,
    content: `Les presentes mentions legales sont regies par le droit francais. En cas de litige, les tribunaux de Paris seront seuls competents.`
  },
  {
    id: 'contact',
    title: '10. Contact',
    icon: Phone,
    content: 'Pour toute question concernant les presentes mentions legales, vous pouvez nous contacter :',
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
            <span className="text-primary">Mentions Legales</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Mentions Legales</h1>
              <p className="text-muted-foreground mt-2">Derniere mise a jour : 1er Janvier 2025</p>
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
            <h3 className="font-semibold mb-4">Documents juridiques associes</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/terms" className="text-primary hover:underline">Conditions Generales d'Utilisation</Link>
              <Link href="/legal/privacy" className="text-primary hover:underline">Politique de Confidentialite</Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
