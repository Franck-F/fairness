'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  Users,
  Target,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

const steps = [
  {
    id: 1,
    title: 'Bienvenue sur AuditIQ',
    description: 'Configurons votre espace en quelques minutes',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Informations Entreprise',
    description: 'Parlez-nous de votre organisation',
    icon: Building2,
  },
  {
    id: 3,
    title: 'Votre Équipe',
    description: 'Qui utilisera AuditIQ ?',
    icon: Users,
  },
  {
    id: 4,
    title: 'Cas d\'Usage',
    description: 'Comment utiliserez-vous AuditIQ ?',
    icon: Target,
  },
  {
    id: 5,
    title: 'C\'est Prêt !',
    description: 'Commencez à auditer vos modèles IA',
    icon: Zap,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    companySize: '',
    role: '',
    teamSize: '',
    useCases: [],
    goals: [],
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      // Save onboarding data
      // TODO: API call to save preferences
      toast.success('Configuration terminée !')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const toggleUseCase = (useCase) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter(u => u !== useCase)
        : [...prev.useCases, useCase],
    }))
  }

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal],
    }))
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="https://customer-assets.emergentagent.com/job_auditiq/artifacts/snxql2e8_logo%20audiot-iq%20big%20without%20bg.png.png"
              alt="AuditIQ Logo"
              width={150}
              height={60}
              priority
              className="object-contain"
            />
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="text-center">
            <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="mt-2">{steps[currentStep - 1].description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center py-8">
              <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bonjour {user?.user_metadata?.full_name || 'là'} !</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Nous sommes ravis de vous accueillir sur AuditIQ. Prenons quelques minutes pour configurer votre espace
                et vous aider à démarrer rapidement.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Rapide</p>
                  <p className="text-xs text-muted-foreground">3 minutes</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Simple</p>
                  <p className="text-xs text-muted-foreground">4 étapes</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Personnalisé</p>
                  <p className="text-xs text-muted-foreground">Pour vous</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Nom de l'entreprise</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="industry">Secteur d'activité</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technologie</SelectItem>
                    <SelectItem value="finance">Finance / Banque</SelectItem>
                    <SelectItem value="healthcare">Santé</SelectItem>
                    <SelectItem value="retail">Commerce / Retail</SelectItem>
                    <SelectItem value="consulting">Conseil</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="companySize">Taille de l'entreprise</Label>
                <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employés</SelectItem>
                    <SelectItem value="11-50">11-50 employés</SelectItem>
                    <SelectItem value="51-200">51-200 employés</SelectItem>
                    <SelectItem value="201-1000">201-1000 employés</SelectItem>
                    <SelectItem value="1000+">1000+ employés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Team */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Votre rôle</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                    <SelectItem value="ml-engineer">ML Engineer</SelectItem>
                    <SelectItem value="compliance">Compliance Officer</SelectItem>
                    <SelectItem value="hr">RH / Recrutement</SelectItem>
                    <SelectItem value="manager">Manager / Director</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teamSize">Taille de votre équipe IA</Label>
                <Select value={formData.teamSize} onValueChange={(value) => setFormData({ ...formData, teamSize: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Juste moi</SelectItem>
                    <SelectItem value="2-5">2-5 personnes</SelectItem>
                    <SelectItem value="6-10">6-10 personnes</SelectItem>
                    <SelectItem value="11-20">11-20 personnes</SelectItem>
                    <SelectItem value="20+">20+ personnes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Use Cases */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Cas d'usage principaux (plusieurs choix possibles)</Label>
                <div className="space-y-2">
                  {[
                    { value: 'scoring', label: 'Scoring crédit / risque' },
                    { value: 'recruitment', label: 'Recrutement / RH' },
                    { value: 'customer', label: 'Service client / Support' },
                    { value: 'fraud', label: 'Détection de fraude' },
                    { value: 'recommendation', label: 'Systèmes de recommandation' },
                    { value: 'other', label: 'Autre' },
                  ].map((useCase) => (
                    <div key={useCase.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer" onClick={() => toggleUseCase(useCase.value)}>
                      <Checkbox
                        checked={formData.useCases.includes(useCase.value)}
                        onCheckedChange={() => toggleUseCase(useCase.value)}
                      />
                      <label className="flex-1 cursor-pointer">{useCase.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Objectifs avec AuditIQ (plusieurs choix possibles)</Label>
                <div className="space-y-2">
                  {[
                    { value: 'compliance', label: 'Conformité réglementaire (AI Act, GDPR)' },
                    { value: 'fairness', label: 'Améliorer la fairness de mes modèles' },
                    { value: 'bias', label: 'Détecter et corriger les biais' },
                    { value: 'trust', label: 'Renforcer la confiance dans l\'IA' },
                    { value: 'reporting', label: 'Générer des rapports pour stakeholders' },
                  ].map((goal) => (
                    <div key={goal.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer" onClick={() => toggleGoal(goal.value)}>
                      <Checkbox
                        checked={formData.goals.includes(goal.value)}
                        onCheckedChange={() => toggleGoal(goal.value)}
                      />
                      <label className="flex-1 cursor-pointer">{goal.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Votre espace est prêt !</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Merci d'avoir pris le temps de configurer votre compte. Vous pouvez maintenant commencer à auditer vos modèles IA.
              </p>
              <div className="bg-primary/5 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm font-medium mb-2">Prochaines étapes suggérées :</p>
                <ul className="text-sm text-left space-y-1 text-muted-foreground">
                  <li>• Uploadez votre premier dataset</li>
                  <li>• Lancez un audit de fairness</li>
                  <li>• Explorez le Chat AI pour des conseils</li>
                  <li>• Invitez vos collègues</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Terminer
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Skip option */}
          {currentStep < steps.length && (
            <div className="text-center">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                Passer cette étape
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
