'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Check, X, HelpCircle, ChevronRight } from 'lucide-react'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: 'Starter',
      description: 'Pour les petites equipes qui debutent',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        { name: '5 audits par mois', included: true },
        { name: '1 utilisateur', included: true },
        { name: '6 metriques de fairness', included: true },
        { name: 'Rapports PDF', included: true },
        { name: 'Support email', included: true },
        { name: 'API Access', included: false },
        { name: 'Custom metrics', included: false },
        { name: 'SSO/SAML', included: false },
      ],
      cta: 'Commencer Gratuitement',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Pour les equipes en croissance',
      priceMonthly: 99,
      priceAnnual: 79,
      features: [
        { name: '50 audits par mois', included: true },
        { name: '10 utilisateurs', included: true },
        { name: '16 metriques de fairness', included: true },
        { name: 'Rapports PDF & Excel', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'API Access', included: true },
        { name: 'Custom metrics', included: false },
        { name: 'SSO/SAML', included: false },
      ],
      cta: 'Essai Gratuit 14 jours',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Pour les grandes organisations',
      priceMonthly: null,
      priceAnnual: null,
      features: [
        { name: 'Audits illimites', included: true },
        { name: 'Utilisateurs illimites', included: true },
        { name: '16+ metriques personnalisables', included: true },
        { name: 'Rapports White-label', included: true },
        { name: 'Support dedie 24/7', included: true },
        { name: 'API Access illimite', included: true },
        { name: 'Custom metrics', included: true },
        { name: 'SSO/SAML', included: true },
      ],
      cta: 'Contacter les Ventes',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Puis-je changer de plan a tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan a tout moment. Les changements prennent effet immediatement et sont prorotes.',
    },
    {
      question: 'Y a-t-il une periode d\'essai ?',
      answer: 'Oui, le plan Pro inclut une periode d\'essai gratuite de 14 jours. Aucune carte bancaire requise.',
    },
    {
      question: 'Quels modes de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), les virements SEPA, et PayPal pour les plans annuels.',
    },
    {
      question: 'Proposez-vous des remises pour les startups ?',
      answer: 'Oui, nous offrons 50% de reduction pour les startups eligibles. Contactez-nous pour en savoir plus.',
    },
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
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">A Propos</Link>
            <Link href="/pricing" className="text-sm font-medium text-primary">Tarifs</Link>
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

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Tarifs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Tarifs Simples et <span className="text-primary">Transparents</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-center">
            Choisissez le plan adapte a vos besoins. Commencez gratuitement et evoluez selon votre croissance.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={!annual ? 'font-medium' : 'text-muted-foreground'}>Mensuel</span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={annual ? 'font-medium' : 'text-muted-foreground'}>Annuel</span>
            {annual && <Badge variant="secondary">-20%</Badge>}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative bg-card ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Plus Populaire</Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  {plan.priceMonthly !== null ? (
                    <>
                      <span className="text-4xl font-bold">
                        {annual ? plan.priceAnnual : plan.priceMonthly} EUR
                      </span>
                      <span className="text-muted-foreground">/mois</span>
                      {annual && plan.priceAnnual > 0 && (
                        <p className="text-sm text-muted-foreground">Facture annuellement</p>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold">Sur Devis</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.priceMonthly === null ? '/contact' : '/signup'}>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Questions Frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 bg-card">
                <div className="flex gap-3">
                  <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-card border-2 border-border text-center">
          <h2 className="text-3xl font-bold mb-4">Des Questions sur nos Tarifs ?</h2>
          <p className="text-lg mb-8 text-muted-foreground">Notre equipe est la pour vous aider a choisir le plan ideal</p>
          <Link href="/contact">
            <Button size="lg">Contacter l'Equipe</Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
