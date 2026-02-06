'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/shell'
import { FileUpload } from '@/components/dashboard/file-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, Upload, Eye, Settings, Play, Rocket, Loader2, ArrowLeft, ArrowRight, Database, Target, Users, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

const steps = [
  { id: 1, name: 'Upload', icon: Upload, description: 'Importer le dataset' },
  { id: 2, name: 'Apercu', icon: Eye, description: 'Verifier les donnees' },
  { id: 3, name: 'Configuration', icon: Settings, description: 'Parametrer l\'audit' },
  { id: 4, name: 'Lancement', icon: Rocket, description: 'Demarrer l\'audit' },
]

export default function UploadPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedDataset, setUploadedDataset] = useState(null)
  const [launching, setLaunching] = useState(false)
  
  // Audit configuration
  const [auditConfig, setAuditConfig] = useState({
    name: '',
    useCase: 'general',
    targetColumn: '',
    protectedAttributes: [],
    thresholds: {
      demographicParity: 0.8,
      equalizedOdds: 0.8,
      disparateImpact: 0.8,
    },
  })

  const handleFileUploaded = (data) => {
    setUploadedDataset(data)
    setAuditConfig(prev => ({
      ...prev,
      name: `Audit - ${data.filename}`,
    }))
    setCurrentStep(2)
  }

  const handleNextStep = () => {
    if (currentStep === 2 && !uploadedDataset) {
      toast.error('Veuillez uploader un fichier')
      return
    }
    if (currentStep === 3) {
      if (!auditConfig.targetColumn) {
        toast.error('Veuillez selectionner une variable cible')
        return
      }
      if (auditConfig.protectedAttributes.length === 0) {
        toast.error('Veuillez selectionner au moins un attribut protege')
        return
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLaunchAudit = async () => {
    setLaunching(true)
    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          audit_name: auditConfig.name,
          use_case: auditConfig.useCase,
          dataset_id: uploadedDataset.id,
          config: {
            target_column: auditConfig.targetColumn,
            protected_attributes: auditConfig.protectedAttributes,
            thresholds: auditConfig.thresholds,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la creation de l\'audit')
      }

      const data = await response.json()
      toast.success('Audit cree avec succes !')
      router.push(`/dashboard/audits/${data.audit.id}`)
    } catch (error) {
      console.error('Launch audit error:', error)
      toast.error(error.message)
    } finally {
      setLaunching(false)
    }
  }

  const toggleProtectedAttribute = (colName) => {
    setAuditConfig(prev => ({
      ...prev,
      protectedAttributes: prev.protectedAttributes.includes(colName)
        ? prev.protectedAttributes.filter(c => c !== colName)
        : [...prev.protectedAttributes, colName],
    }))
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Creer un Audit de Fairness</h1>
          <p className="text-muted-foreground mt-1">
            Suivez les etapes pour analyser l'equite de votre modele IA
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Etape {currentStep} sur {steps.length}</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        {/* Steps Navigation */}
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const Icon = step.icon

            return (
              <div
                key={step.id}
                className={cn(
                  'relative flex flex-col items-center p-4 rounded-lg border-2 transition-all',
                  isActive && 'border-primary bg-primary/5',
                  isCompleted && 'border-green-500 bg-green-500/10',
                  !isActive && !isCompleted && 'border-muted bg-card'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-green-500 text-white',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-sm font-medium text-center">{step.name}</span>
                <span className="text-xs text-muted-foreground text-center mt-1">
                  {step.description}
                </span>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = steps[currentStep - 1].icon
                return <Icon className="h-5 w-5 text-primary" />
              })()}
              {steps[currentStep - 1].name}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Upload */}
            {currentStep === 1 && (
              <FileUpload onFileUploaded={handleFileUploaded} />
            )}

            {/* Step 2: Preview */}
            {currentStep === 2 && uploadedDataset && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <Database className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{uploadedDataset.stats?.rows?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Lignes</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{uploadedDataset.stats?.columns}</div>
                    <div className="text-xs text-muted-foreground">Colonnes</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <AlertTriangle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{uploadedDataset.stats?.missingValues?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Valeurs manquantes</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{(uploadedDataset.stats?.fileSize / 1024).toFixed(1)} KB</div>
                    <div className="text-xs text-muted-foreground">Taille</div>
                  </div>
                </div>

                {/* Columns */}
                <div>
                  <h4 className="font-medium mb-3">Colonnes detectees</h4>
                  <div className="flex flex-wrap gap-2">
                    {uploadedDataset.columns?.map((col) => (
                      <Badge key={col.name} variant={col.type === 'numeric' ? 'default' : 'secondary'}>
                        {col.name} ({col.type})
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Data Preview */}
                <div>
                  <h4 className="font-medium mb-3">Apercu des donnees ({uploadedDataset.data?.length || 0} lignes disponibles)</h4>
                  {uploadedDataset.data && uploadedDataset.data.length > 0 ? (
                    <div className="rounded-lg border overflow-x-auto bg-card">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            {uploadedDataset.columns?.slice(0, 8).map((col) => (
                              <TableHead key={col.name} className="whitespace-nowrap font-semibold">{col.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadedDataset.data?.slice(0, 10).map((row, i) => (
                            <TableRow key={i} className="hover:bg-muted/30">
                              {uploadedDataset.columns?.slice(0, 8).map((col) => (
                                <TableCell key={col.name} className="whitespace-nowrap">
                                  {String(row[col.name] ?? '-').substring(0, 30)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground border rounded-lg">
                      <p>Aucune donnée disponible pour l'aperçu</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && uploadedDataset && (
              <div className="space-y-6">
                {/* Audit Name */}
                <div className="space-y-2">
                  <Label>Nom de l'audit</Label>
                  <Input
                    value={auditConfig.name}
                    onChange={(e) => setAuditConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Mon audit de fairness"
                    className="bg-background"
                  />
                </div>

                {/* Use Case */}
                <div className="space-y-2">
                  <Label>Cas d'usage</Label>
                  <Select value={auditConfig.useCase} onValueChange={(v) => setAuditConfig(prev => ({ ...prev, useCase: v }))}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="credit">Credit Scoring</SelectItem>
                      <SelectItem value="hiring">Recrutement</SelectItem>
                      <SelectItem value="healthcare">Sante</SelectItem>
                      <SelectItem value="insurance">Assurance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Column */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Variable cible (a predire)
                  </Label>
                  <Select value={auditConfig.targetColumn} onValueChange={(v) => setAuditConfig(prev => ({ ...prev, targetColumn: v }))}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selectionnez la variable cible" />
                    </SelectTrigger>
                    <SelectContent>
                      {uploadedDataset.columns?.map((col) => (
                        <SelectItem key={col.name} value={col.name}>
                          {col.name} ({col.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Protected Attributes */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Attributs proteges (pour detecter les biais)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Selectionnez les colonnes sensibles comme le genre, l'age, l'origine, etc.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {uploadedDataset.columns?.filter(c => c.type === 'categorical' || c.type === 'boolean').map((col) => (
                      <div
                        key={col.name}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-all',
                          auditConfig.protectedAttributes.includes(col.name)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                        onClick={() => toggleProtectedAttribute(col.name)}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={auditConfig.protectedAttributes.includes(col.name)} />
                          <span className="font-medium">{col.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {auditConfig.protectedAttributes.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Selectionnes :</span>
                      {auditConfig.protectedAttributes.map(attr => (
                        <Badge key={attr}>{attr}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Launch */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Rocket className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Pret a lancer l'audit !</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  L'audit analysera les biais de votre modele selon les metriques de fairness standards.
                </p>

                {/* Summary */}
                <Card className="max-w-md mx-auto mb-6 bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dataset</span>
                        <span className="font-medium">{uploadedDataset?.filename}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variable cible</span>
                        <span className="font-medium">{auditConfig.targetColumn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Attributs proteges</span>
                        <span className="font-medium">{auditConfig.protectedAttributes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cas d'usage</span>
                        <span className="font-medium capitalize">{auditConfig.useCase}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button size="lg" onClick={handleLaunchAudit} disabled={launching}>
                  {launching ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Lancement en cours...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-2" />
                      Lancer l'Audit
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Precedent
          </Button>
          {currentStep < 4 && (
            <Button onClick={handleNextStep}>
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
