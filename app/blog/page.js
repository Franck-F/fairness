import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Calendar, Clock, ArrowRight, User, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Blog - AuditIQ',
  description: 'Articles et ressources sur l\'IA ethique, la fairness algorithmique et la detection de biais.',
}

export default function BlogPage() {
  const featuredPost = {
    title: 'AI Act 2024: Ce que Vous Devez Savoir pour Votre Entreprise',
    excerpt: 'Le reglement europeen sur l\'IA entre en vigueur. Decouvrez les obligations de conformite et comment AuditIQ peut vous aider a les respecter.',
    author: 'Dr. Marie Laurent',
    date: '15 Dec 2024',
    readTime: '8 min',
    category: 'Reglementation',
  }

  const posts = [
    {
      title: 'Comprendre le Demographic Parity en 5 Minutes',
      excerpt: 'Une explication simple de cette metrique essentielle de fairness et comment l\'interpreter dans vos audits.',
      author: 'Sophie Martin',
      date: '10 Dec 2024',
      readTime: '5 min',
      category: 'Technique',
    },
    {
      title: 'Etude de Cas: Reduction des Biais dans le Recrutement',
      excerpt: 'Comment une entreprise du CAC 40 a utilise AuditIQ pour eliminer les biais de genre dans son processus de recrutement.',
      author: 'Thomas Dubois',
      date: '5 Dec 2024',
      readTime: '10 min',
      category: 'Case Study',
    },
    {
      title: 'XGBoost vs Logistic Regression: Quel Impact sur la Fairness ?',
      excerpt: 'Une analyse comparative de l\'impact du choix d\'algorithme sur les metriques d\'equite de vos modeles.',
      author: 'Pierre Moreau',
      date: '28 Nov 2024',
      readTime: '7 min',
      category: 'Technique',
    },
    {
      title: 'Les 5 Biais les Plus Courants dans les Modeles de Credit Scoring',
      excerpt: 'Identifiez et corrigez les biais systemiques qui affectent les decisions de credit automatisees.',
      author: 'Dr. Marie Laurent',
      date: '20 Nov 2024',
      readTime: '6 min',
      category: 'Finance',
    },
    {
      title: 'Guide Pratique: Implementer Fairlearn dans Votre Pipeline ML',
      excerpt: 'Tutoriel pas-a-pas pour integrer les outils de fairness directement dans votre workflow de Machine Learning.',
      author: 'Sophie Martin',
      date: '15 Nov 2024',
      readTime: '12 min',
      category: 'Tutoriel',
    },
    {
      title: 'IA Responsable: Interview avec le Responsable Ethique de BNP Paribas',
      excerpt: 'Decouvrez comment les grandes institutions financieres abordent la question de l\'equite algorithmique.',
      author: 'Thomas Dubois',
      date: '8 Nov 2024',
      readTime: '15 min',
      category: 'Interview',
    },
  ]

  const categories = ['Tous', 'Technique', 'Reglementation', 'Case Study', 'Tutoriel', 'Finance', 'Interview']

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
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">A Propos</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tarifs</Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <Link href="/blog" className="text-sm font-medium text-primary">Blog</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login"><Button variant="ghost">Connexion</Button></Link>
            <Link href="/signup"><Button>Commencer</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Blog <span className="text-primary">AuditIQ</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center">
            Articles, guides et ressources sur l'IA ethique, la fairness algorithmique et les bonnes pratiques de Machine Learning.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === 'Tous' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="overflow-hidden bg-card">
          <div className="grid md:grid-cols-2">
            <div className="h-64 md:h-auto bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <div className="text-primary-foreground text-center p-8">
                <Badge variant="secondary" className="mb-4">Article Vedette</Badge>
                <h2 className="text-2xl font-bold">AI Act 2024</h2>
              </div>
            </div>
            <div className="p-8">
              <Badge className="mb-4">{featuredPost.category}</Badge>
              <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><User className="h-4 w-4" />{featuredPost.author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{featuredPost.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{featuredPost.readTime}</span>
              </div>
              <Button>
                Lire l'Article <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-8">Articles Recents</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card key={index} className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer bg-card">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{post.readTime}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-card border-2 border-border text-center">
          <h2 className="text-3xl font-bold mb-4">Restez Informe</h2>
          <p className="text-lg mb-8 text-muted-foreground">Recevez nos derniers articles sur l'IA ethique directement dans votre boite mail</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 bg-background"
            />
            <Button>S'abonner</Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
