import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Shield, Target, Users, Zap, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'A Propos - AuditIQ',
  description: 'Decouvrez AuditIQ, la plateforme leader pour l\'audit de fairness et la detection de biais dans les systemes d\'IA.',
}

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Integrite',
      description: 'Nous nous engageons a fournir des audits transparents et impartiaux pour garantir l\'equite de vos modeles IA.',
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Nos 16 metriques de fairness sont basees sur les dernieres recherches academiques et les standards de l\'industrie.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Nous travaillons en partenariat avec nos clients pour comprendre leurs besoins specifiques et adapter nos solutions.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Nous investissons continuellement dans la R&D pour rester a la pointe de la detection de biais algorithmiques.',
    },
  ]

  const team = [
    { name: 'Franck Fambou', role: 'CEO & Co-fondatrice', expertise: 'IA Ethique' },
    { name: 'Franck Fambou', role: 'CTO & Co-fondateur', expertise: 'Machine Learning' },
    { name: 'Franck Fambou', role: 'Head of Research', expertise: 'Fairness ML' },
    { name: 'Franck Fambou', role: 'Head of Product', expertise: 'UX/Product' },
  ]

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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-primary">A Propos</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tarifs</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Blog</Link>
          </nav>
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
            <span className="text-primary">A Propos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Notre Mission: Une IA Plus <span className="text-primary">Equitable</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-8">
            AuditIQ est ne de la conviction que l'intelligence artificielle doit etre au service de tous, 
            sans discrimination. Nous aidons les entreprises a construire des systemes IA responsables et conformes.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
            <p className="text-muted-foreground mb-4">
              Fondee en 2023 par une equipe d'experts en Machine Learning et en ethique de l'IA, 
              AuditIQ est nee d'un constat simple: les biais algorithmiques sont partout, mais peu 
              d'entreprises disposent des outils pour les detecter et les corriger.
            </p>
            <p className="text-muted-foreground mb-4">
              Face a l'AI Act europeen et aux exigences croissantes de transparence, nous avons 
              developpe une plateforme SaaS complete permettant a toute entreprise d'auditer 
              la fairness de ses modeles de Machine Learning.
            </p>
            <p className="text-muted-foreground">
              Aujourd'hui, AuditIQ accompagne plus de 200 entreprises dans leur demarche d'IA 
              responsable, des startups aux grands groupes du CAC 40.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 text-center bg-card">
              <div className="text-4xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Entreprises clientes</div>
            </Card>
            <Card className="p-6 text-center bg-card">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Audits realises</div>
            </Card>
            <Card className="p-6 text-center bg-card">
              <div className="text-4xl font-bold text-primary">16</div>
              <div className="text-sm text-muted-foreground">Metriques de fairness</div>
            </Card>
            <Card className="p-6 text-center bg-card">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction client</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all bg-card">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Notre Equipe</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="p-6 text-center bg-card hover:border-primary/30 transition-colors">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">{member.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-primary text-sm">{member.role}</p>
              <p className="text-muted-foreground text-xs mt-1">{member.expertise}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-card border-2 border-border text-center">
          <h2 className="text-3xl font-bold mb-4">Rejoignez le Mouvement de l'IA Responsable</h2>
          <p className="text-lg mb-8 text-muted-foreground">Commencez votre premier audit gratuitement</p>
          <Link href="/signup">
            <Button size="lg">Demarrer Maintenant</Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
