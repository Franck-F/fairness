import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Clock, Users, Heart, Zap, Globe, Coffee } from 'lucide-react'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata = {
  title: 'Carrières - AuditIQ',
  description: 'Rejoignez l\'équipe AuditIQ et participez à construire l\'avenir de l\'IA responsable.',
}

export default function CareersPage() {
  const benefits = [
    { icon: Heart, title: 'Santé', description: 'Mutuelle premium 100% prise en charge' },
    { icon: Clock, title: 'Flexibilité', description: 'Télétravail 3j/semaine, horaires flexibles' },
    { icon: Zap, title: 'Formation', description: 'Budget formation 2 000 €/an' },
    { icon: Globe, title: 'International', description: 'Équipe multinationale, anglais courant' },
    { icon: Coffee, title: 'Bien-être', description: 'Tickets resto, abonnement sport' },
    { icon: Users, title: 'Team Building', description: 'Événements mensuels, offsite annuel' },
  ]

  const jobs = [
    {
      title: 'Senior ML Engineer',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Développez et optimisez nos algorithmes de détection de biais et nos métriques de fairness.',
    },
    {
      title: 'Full Stack Developer (React/Node)',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Construisez et améliorez notre plateforme SaaS utilisée par des centaines d\'entreprises.',
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Paris',
      type: 'CDI',
      description: 'Définissez la roadmap produit et travaillez avec les équipes tech pour livrer des fonctionnalités impactantes.',
    },
    {
      title: 'Data Scientist - Fairness Research',
      department: 'Research',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Menez des recherches sur les nouvelles métriques de fairness et publiez dans des conférences académiques.',
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Paris',
      type: 'CDI',
      description: 'Accompagnez nos clients entreprises dans leur adoption d\'AuditIQ et leur démarche d\'IA responsable.',
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Gérez notre infrastructure cloud et assurez la scalabilité et la sécurité de notre plateforme.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">À Propos</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tarifs</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <Link href="/careers" className="text-sm font-medium text-primary">Carrières</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login"><Button variant="ghost">Connexion</Button></Link>
            <Link href="/signup"><Button>Commencer</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4">Nous recrutons</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Construisez l'Avenir de <span className="text-primary">l'IA Responsable</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Rejoignez une équipe passionnée qui travaille à rendre l'intelligence artificielle plus équitable pour tous.
        </p>
        <Button size="lg">Voir les Offres</Button>
      </section>

      {/* Why Join Us */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Rejoindre AuditIQ ?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6">
              <benefit.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Culture */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 border-y border-border">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Culture</h2>
            <p className="text-muted-foreground mb-4">
              Chez AuditIQ, nous croyons que la diversité des perspectives est essentielle pour construire
              des outils qui détectent les biais. Notre équipe réunit des talents de 12 nationalités différentes.
            </p>
            <p className="text-muted-foreground mb-4">
              Nous valorisons l'autonomie, la transparence et l'apprentissage continu. Chaque membre de l'équipe
              a la liberté de proposer des idées et de les mettre en œuvre.
            </p>
            <p className="text-muted-foreground">
              Nos rituels incluent des « Fairness Fridays » où nous discutons des dernières recherches en IA éthique,
              et des hackathons trimestriels pour explorer de nouvelles idées.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">35</div>
              <div className="text-sm text-muted-foreground">Employés</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Nationalités</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">45%</div>
              <div className="text-sm text-muted-foreground">Femmes</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Note Glassdoor</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Postes Ouverts</h2>
        <p className="text-center text-muted-foreground mb-12">{jobs.length} postes disponibles</p>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {jobs.map((job, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />{job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />{job.location}
                    </span>
                  </div>
                </div>
                <Button>Postuler</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-card border-2 border-border text-center">
          <h2 className="text-3xl font-bold mb-4">Vous ne trouvez pas le poste idéal ?</h2>
          <p className="text-lg mb-8 text-muted-foreground">Envoyez-nous une candidature spontanée, nous sommes toujours à la recherche de talents</p>
          <Link href="/contact">
            <Button size="lg">Candidature spontanée</Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
