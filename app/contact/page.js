'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AuditIQFooter } from '@/components/ui/auditiq-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Building2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Message envoye avec succes ! Nous vous repondrons sous 24h.')
    setFormData({ name: '', email: '', company: '', subject: '', message: '' })
    setLoading(false)
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contact@auditiq.ai', href: 'mailto:contact@auditiq.ai' },
    { icon: Phone, label: 'Telephone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
    { icon: MapPin, label: 'Adresse', value: '42 Rue de l\'Innovation, 75008 Paris', href: null },
    { icon: Clock, label: 'Horaires', value: 'Lun-Ven: 9h-18h', href: null },
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
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tarifs</Link>
            <Link href="/contact" className="text-sm font-medium text-primary">Contact</Link>
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
            <span className="text-primary">Contact</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contactez <span className="text-primary">Notre Equipe</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Une question ? Un projet ? Notre equipe est la pour vous accompagner dans votre demarche d'IA responsable.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informations de Contact
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <info.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-medium hover:text-primary transition-colors">{info.value}</a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-primary/10 border-primary/20">
              <MessageSquare className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Support Client</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deja client ? Accedez a notre support prioritaire via votre dashboard.
              </p>
              <Link href="/login">
                <Button variant="outline" size="sm">Acceder au Support</Button>
              </Link>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 bg-card">
            <CardHeader>
              <CardTitle>Envoyez-nous un Message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@entreprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      placeholder="Nom de votre entreprise"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo">Demande de demo</SelectItem>
                        <SelectItem value="pricing">Question sur les tarifs</SelectItem>
                        <SelectItem value="partnership">Partenariat</SelectItem>
                        <SelectItem value="support">Support technique</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Decrivez votre projet ou votre question..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="bg-background"
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                  {loading ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer le Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="overflow-hidden bg-card">
          <div className="h-64 bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="font-medium">42 Rue de l'Innovation</p>
              <p className="text-muted-foreground">75008 Paris, France</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <AuditIQFooter />
    </div>
  )
}
