import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { FileText, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Conditions Generales d\'Utilisation - AuditIQ',
  description: 'Conditions generales d\'utilisation de la plateforme AuditIQ.',
}

const sections = [
  {
    id: 'objet',
    title: '1. Objet',
    content: `Les presentes Conditions Generales d'Utilisation (CGU) ont pour objet de definir les modalites et conditions d'utilisation des services proposes par AuditIQ (ci-apres "le Service"), ainsi que de definir les droits et obligations des parties dans ce cadre.`
  },
  {
    id: 'acceptation',
    title: '2. Acceptation des CGU',
    content: `L'utilisation du Service implique l'acceptation pleine et entiere des presentes CGU. En accedant au Service, l'Utilisateur reconnait avoir pris connaissance des presentes CGU et les accepter sans reserve.`
  },
  {
    id: 'description',
    title: '3. Description du Service',
    content: `AuditIQ est une plateforme SaaS d'audit de fairness et de detection de biais dans les systemes d'intelligence artificielle.`,
    list: [
      'L\'upload et l\'analyse de datasets',
      'L\'entrainement de modeles de Machine Learning',
      'Le calcul de metriques de fairness',
      'La generation de rapports d\'audit',
      'Un assistant IA pour l\'interpretation des resultats'
    ]
  },
  {
    id: 'inscription',
    title: '4. Inscription et Compte Utilisateur',
    content: `L'acces au Service necessite la creation d'un compte utilisateur. L'Utilisateur s'engage a :`,
    list: [
      'Fournir des informations exactes et a jour lors de l\'inscription',
      'Maintenir la confidentialite de ses identifiants de connexion',
      'Notifier immediatement AuditIQ en cas d\'utilisation non autorisee de son compte'
    ]
  },
  {
    id: 'propriete',
    title: '5. Propriete Intellectuelle',
    content: `L'ensemble des elements constituant le Service (logiciels, algorithmes, interfaces, textes, images) sont la propriete exclusive d'AuditIQ ou de ses partenaires et sont proteges par les lois relatives a la propriete intellectuelle.`
  },
  {
    id: 'donnees',
    title: '6. Donnees Utilisateur',
    content: `L'Utilisateur reste proprietaire des donnees qu'il uploade sur la plateforme. AuditIQ s'engage a ne pas utiliser ces donnees a d'autres fins que la fourniture du Service, conformement a sa Politique de Confidentialite.`
  },
  {
    id: 'responsabilite',
    title: '7. Responsabilite',
    content: `AuditIQ s'efforce de maintenir le Service accessible 24h/24 et 7j/7 mais ne peut garantir une disponibilite absolue. AuditIQ ne saurait etre tenue responsable des dommages indirects resultant de l'utilisation ou de l'impossibilite d'utiliser le Service.`
  },
  {
    id: 'resiliation',
    title: '8. Resiliation',
    content: `L'Utilisateur peut resilier son compte a tout moment depuis les parametres de son compte. AuditIQ se reserve le droit de suspendre ou resilier un compte en cas de violation des presentes CGU.`
  },
  {
    id: 'modification',
    title: '9. Modification des CGU',
    content: `AuditIQ se reserve le droit de modifier les presentes CGU a tout moment. Les Utilisateurs seront informes de toute modification par email ou via le Service.`
  },
  {
    id: 'droit',
    title: '10. Droit Applicable',
    content: `Les presentes CGU sont soumises au droit francais. En cas de litige, les tribunaux de Paris seront seuls competents.`
  },
  {
    id: 'contact',
    title: '11. Contact',
    content: `Pour toute question concernant les presentes CGU, vous pouvez nous contacter a l'adresse : legal@auditiq.ai`
  }
]

export default function TermsPage() {
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
            <span className="text-primary">CGU</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Conditions Generales d'Utilisation</h1>
              <p className="text-muted-foreground mt-2">Derniere mise a jour : 1er Janvier 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Navigation rapide */}
          <Card className="p-6 mb-8 bg-card/50 backdrop-blur">
            <h2 className="text-lg font-semibold mb-4">Sommaire</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </Card>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={section.id} id={section.id} className="p-8 bg-card hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <div>
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
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation vers autres pages legales */}
          <Card className="p-6 mt-12 bg-card/50">
            <h3 className="font-semibold mb-4">Documents juridiques associes</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/privacy" className="text-primary hover:underline">Politique de Confidentialite</Link>
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
