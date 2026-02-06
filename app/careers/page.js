import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Clock, Users, Heart, Zap, Globe, Coffee } from 'lucide-react'

export const metadata = {
  title: 'Carrieres - AuditIQ',
  description: 'Rejoignez l\'equipe AuditIQ et participez a construire l\'avenir de l\'IA responsable.',
}

export default function CareersPage() {
  const benefits = [
    { icon: Heart, title: 'Sante', description: 'Mutuelle premium 100% prise en charge' },
    { icon: Clock, title: 'Flexibilite', description: 'Teletravail 3j/semaine, horaires flexibles' },
    { icon: Zap, title: 'Formation', description: 'Budget formation 2000EUR/an' },
    { icon: Globe, title: 'International', description: 'Equipe multinationale, anglais courant' },
    { icon: Coffee, title: 'Bien-etre', description: 'Tickets resto, abonnement sport' },
    { icon: Users, title: 'Team Building', description: 'Evenements mensuels, offsite annuel' },
  ]

  const jobs = [
    {
      title: 'Senior ML Engineer',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Developpez et optimisez nos algorithmes de detection de biais et nos metriques de fairness.',
    },
    {
      title: 'Full Stack Developer (React/Node)',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Construisez et ameliorez notre plateforme SaaS utilisee par des centaines d\'entreprises.',
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Paris',
      type: 'CDI',
      description: 'Definissez la roadmap produit et travaillez avec les equipes tech pour livrer des fonctionnalites impactantes.',
    },
    {
      title: 'Data Scientist - Fairness Research',
      department: 'Research',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Menez des recherches sur les nouvelles metriques de fairness et publiez dans des conferences academiques.',
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Paris',
      type: 'CDI',
      description: 'Accompagnez nos clients entreprises dans leur adoption d\'AuditIQ et leur demarche d\'IA responsable.',
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Paris / Remote',
      type: 'CDI',
      description: 'Gerez notre infrastructure cloud et assurez la scalabilite et la securite de notre plateforme.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
            alt="AuditIQ Logo"
            width={150}
            height={60}
            className="object-contain"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium hover:text-primary">A Propos</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">Tarifs</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          <Link href="/careers" className="text-sm font-medium text-primary">Carrieres</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login"><Button variant="ghost">Connexion</Button></Link>
          <Link href="/signup"><Button>Commencer</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4">Nous recrutons</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Construisez l'Avenir de <span className="text-primary">l'IA Responsable</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Rejoignez une equipe passionnee qui travaille a rendre l'intelligence artificielle plus equitable pour tous.
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
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Culture</h2>
            <p className="text-muted-foreground mb-4">
              Chez AuditIQ, nous croyons que la diversite des perspectives est essentielle pour construire 
              des outils qui detectent les biais. Notre equipe reunit des talents de 12 nationalites differentes.
            </p>
            <p className="text-muted-foreground mb-4">
              Nous valorisons l'autonomie, la transparence et l'apprentissage continu. Chaque membre de l'equipe 
              a la liberte de proposer des idees et de les mettre en oeuvre.
            </p>
            <p className="text-muted-foreground">
              Nos rituels incluent des "Fairness Fridays" ou nous discutons des dernieres recherches en IA ethique, 
              et des hackathons trimestriels pour explorer de nouvelles idees.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">35</div>
              <div className="text-sm text-muted-foreground">Employes</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Nationalites</div>
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Vous ne Trouvez pas le Poste Ideal ?</h2>
          <p className="text-lg mb-8 opacity-90">Envoyez-nous une candidature spontanee, nous sommes toujours a la recherche de talents</p>
          <Link href="/contact">
            <Button size="lg" variant="secondary">Candidature Spontanee</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">2025 AuditIQ. Tous droits reserves.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/legal/terms" className="text-muted-foreground hover:text-primary">CGU</Link>
            <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary">Confidentialite</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
