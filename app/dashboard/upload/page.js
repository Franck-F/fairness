'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/shell'
import { PageHeader } from '@/components/dashboard/page-header'
import { FileUpload } from '@/components/dashboard/file-upload'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  CheckCircle2,
  Upload,
  Eye,
  Settings,
  Play,
  Rocket,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Database,
  Target,
  Users,
  AlertTriangle,
  Zap,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

// AI Domains with specific models for each domain
const AI_DOMAINS = [
  { value: 'tabular', label: 'Donnees Tabulaires', models: ['XGBoost', 'LightGBM', 'Random Forest', 'CatBoost', 'Neural Network', 'Logistic Regression'] },
  { value: 'nlp', label: 'Traitement du Langage Naturel', models: ['BERT', 'GPT', 'T5', 'RoBERTa', 'LLaMA', 'DistilBERT', 'ALBERT'] },
  { value: 'computer_vision', label: 'Vision par Ordinateur', models: ['ResNet', 'YOLO', 'EfficientNet', 'Vision Transformer', 'MobileNet', 'Inception'] },
  { value: 'time_series', label: 'Series Temporelles', models: ['LSTM', 'GRU', 'Prophet', 'ARIMA', 'Transformer', 'TCN'] },
  { value: 'recommender', label: 'Systemes de Recommandation', models: ['Collaborative Filtering', 'Content-Based', 'Matrix Factorization', 'Neural CF', 'LightFM', 'DeepFM'] },
  { value: 'speech_recognition', label: 'Reconnaissance Vocale', models: ['Wav2Vec', 'Whisper', 'DeepSpeech', 'Conformer', 'Jasper', 'QuartzNet'] },
  { value: 'reinforcement_learning', label: 'Apprentissage par Renforcement', models: ['DQN', 'PPO', 'A3C', 'SAC', 'DDPG', 'TD3'] },
  { value: 'anomaly_detection', label: 'Detection d\'Anomalies', models: ['Isolation Forest', 'One-Class SVM', 'Autoencoder', 'LOF', 'DBSCAN', 'COPOD'] },
  { value: 'generative_ai', label: 'IA Generative', models: ['GANs', 'VAE', 'Diffusion Models', 'StyleGAN', 'Stable Diffusion', 'DALL-E'] },
  { value: 'graph_neural_networks', label: 'Reseaux de Neurones Graphiques', models: ['GCN', 'GAT', 'GraphSAGE', 'GIN', 'ChebNet', 'EdgeConv'] },
  { value: 'multimodal', label: 'Multimodal', models: ['CLIP', 'DALL-E', 'Flamingo', 'BEiT', 'ViLBERT', 'ALIGN'] }
]

// Expanded Business Use Cases
const USE_CASES = [
  { value: 'general', label: 'Usage General', icon: '🌐' },
  { value: 'credit', label: 'Credit Scoring', icon: '💳' },
  { value: 'hiring', label: 'Recrutement', icon: '👥' },
  { value: 'healthcare', label: 'Sante', icon: '🏥' },
  { value: 'finance', label: 'Finance & Trading', icon: '📈' },
  { value: 'retail', label: 'Commerce & Retail', icon: '🛒' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'insurance', label: 'Assurance', icon: '🛡️' },
  { value: 'automotive', label: 'Automobile', icon: '🚗' },
  { value: 'energy', label: 'Energie', icon: '⚡' },
  { value: 'manufacturing', label: 'Industrie', icon: '🏭' },
  { value: 'telecommunications', label: 'Telecommunications', icon: '📡' },
  { value: 'real_estate', label: 'Immobilier', icon: '🏢' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'transportation', label: 'Transport & Logistique', icon: '🚚' }
]

const steps = [
  { id: 1, name: 'Upload', icon: Upload, description: 'Datasets Pre/Post Processing' },
  { id: 2, name: 'Visualisation', icon: Eye, description: 'Apercu des Donnees' },
  { id: 3, name: 'Configuration', icon: Settings, description: 'Parametres & Modele' },
  { id: 4, name: 'Lancement', icon: Rocket, description: 'Demarrage de l\'analyse' },
]

export default function UploadPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [datasets, setDatasets] = useState({ pre: null, post: null })
  const [activeDatasetTab, setActiveDatasetTab] = useState('pre')
  const [launching, setLaunching] = useState(false)

  // Audit configuration
  const [auditConfig, setAuditConfig] = useState({
    name: '',
    useCase: 'general',
    targetColumn: '',
    protectedAttributes: [],
    modelType: 'random_forest',
    iaType: 'tabular',
    thresholds: {
      demographicParity: 0.8,
      equalizedOdds: 0.8,
      disparateImpact: 0.8,
    },
  })

  const handleDatasetUploaded = (type, data) => {
    setDatasets(prev => ({ ...prev, [type]: data }))
    if (type === 'pre') {
      setAuditConfig(prev => ({
        ...prev,
        name: `Audit IQ - ${data.filename.split('.')[0]}`,
      }))
    }
  }

  const handleNextStep = () => {
    // Step 1 validation: Dataset required
    if (currentStep === 1 && !datasets.pre) {
      toast.error('AuditIQ requiert au moins le dataset original (Pre-processing).')
      return
    }
    // Step 3 validation: Configuration required
    if (currentStep === 3) {
      if (!auditConfig.targetColumn) {
        toast.error('Variable cible requise pour l\'analyse.')
        return
      }
      if (auditConfig.protectedAttributes.length === 0) {
        toast.error('AuditIQ a besoin d\'au moins un attribut sensible.')
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
          dataset_id: datasets.pre.dataset_id,
          dataset_id_post: datasets.post?.dataset_id,
          model_type: auditConfig.modelType,
          ia_type: auditConfig.iaType,
          audit_type: datasets.post ? 'mitigation' : 'single',
          config: {
            target_column: auditConfig.targetColumn,
            protected_attributes: auditConfig.protectedAttributes,
            thresholds: auditConfig.thresholds,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de synchronisation avec le moteur AuditIQ.')
      }

      const data = await response.json()
      toast.success('Audit synchronise avec succes !')
      router.push(`/dashboard/audits/${data.audit.id}`)
    } catch (error) {
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
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Header */}
        <PageHeader
          icon={Sparkles}
          title="Nouvel"
          titleHighlight="Audit"
          description="Configurez et lancez un nouvel audit d'equite algorithmique."
          actions={
            <div className="hidden lg:flex items-center gap-4">
              <Card className="px-4 py-2.5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Mode securise</span>
              </Card>
            </div>
          }
        />

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {steps.map((step) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const Icon = step.icon

            return (
              <Card
                key={step.id}
                className={cn(
                  'relative flex flex-col items-center p-4 lg:p-6 transition-all duration-500',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : isCompleted
                      ? 'border-green-500/40 bg-green-500/5'
                      : 'opacity-50'
                )}
              >
                <div className={cn(
                  'w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-3 lg:mb-4 transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                      : 'bg-muted text-muted-foreground/50 border border-border'
                )}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6" /> : <Icon className="h-5 w-5 lg:h-6 lg:w-6" />}
                </div>

                <p className={cn("text-[9px] font-medium uppercase tracking-wider mb-1", isActive ? "text-primary" : "text-muted-foreground/50")}>
                  Etape {step.id}
                </p>
                <h3 className={cn("text-xs lg:text-sm font-display font-semibold text-center", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {step.name}
                </h3>
              </Card>
            )
          })}
        </div>

        {/* Main Configuration Area */}
        <Card className="overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">

            {/* Left Context Panel */}
            <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-muted/50 p-6 lg:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">Phase Actuelle</span>
                  <h3 className="text-2xl font-display font-bold text-foreground">{steps[currentStep - 1].name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{steps[currentStep - 1].description}</p>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground font-medium">Chiffrement de bout en bout</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-8">
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Progression</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 flex-1">

                {/* STEP 1: UPLOAD */}
                {currentStep === 1 && (
                  <div className="h-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 w-full">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dataset Original (Pre-processing)</Label>
                          {datasets.pre && <Badge className="bg-green-500/20 text-green-600 dark:text-green-500 border-green-500/30">UPLOADED</Badge>}
                        </div>
                        <FileUpload
                          onFileUploaded={(data) => handleDatasetUploaded('pre', data)}
                          buttonLabel="Confirmer Pre-Processing"
                        />
                        {datasets.pre && (
                          <div className="p-4 rounded-xl bg-muted border border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Database className="h-4 w-4 text-primary" />
                              <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">{datasets.pre.filename}</span>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground/70">{datasets.pre.stats?.rows} rangees</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dataset Mitige (Post-processing)</Label>
                          {datasets.post && <Badge className="bg-green-500/20 text-green-600 dark:text-green-500 border-green-500/30">UPLOADED</Badge>}
                          {!datasets.post && <Badge variant="outline" className="text-xs opacity-60">Optionnel</Badge>}
                        </div>
                        <FileUpload
                          onFileUploaded={(data) => handleDatasetUploaded('post', data)}
                          buttonLabel="Confirmer Post-Processing"
                        />
                        {datasets.post && (
                          <div className="p-4 rounded-xl bg-muted border border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">{datasets.post.filename}</span>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground/70">{datasets.post.stats?.rows} rangees</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {datasets.pre && (
                      <div className="flex flex-col items-center pt-8 border-t border-border mt-auto">
                        <Button
                          onClick={handleNextStep}
                          className="group bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold px-10 py-5 rounded-xl h-auto"
                        >
                          Configurer l'audit
                          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: VISUALIZATION */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                    {/* Dataset Tabs */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveDatasetTab('pre')}
                        className={cn(
                          "flex-1 px-5 py-3 rounded-xl font-display font-semibold text-xs tracking-wide transition-all duration-300",
                          activeDatasetTab === 'pre'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        Dataset Original
                      </button>
                      {datasets.post && (
                        <button
                          onClick={() => setActiveDatasetTab('post')}
                          className={cn(
                            "flex-1 px-5 py-3 rounded-xl font-display font-semibold text-xs tracking-wide transition-all duration-300",
                            activeDatasetTab === 'post'
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          Dataset Mitige
                        </button>
                      )}
                    </div>

                    {/* Active Dataset Preview */}
                    {(() => {
                      const activeData = activeDatasetTab === 'pre' ? datasets.pre : datasets.post
                      if (!activeData) return null

                      return (
                        <Card className="p-6 lg:p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                              <Database className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-display font-semibold text-foreground">
                                {activeDatasetTab === 'pre' ? 'Dataset Original (Pre-processing)' : 'Dataset Mitige (Post-processing)'}
                              </h3>
                              <p className="text-sm text-muted-foreground">{activeData.filename}</p>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                            {[
                              { label: 'Lignes', value: activeData.stats?.rows?.toLocaleString() || 'N/A' },
                              { label: 'Colonnes', value: activeData.columns?.length || 0 },
                              { label: 'Taille', value: activeData.stats?.size || 'N/A' },
                              { label: 'Format', value: (activeData.filename?.split('.').pop() || 'CSV').toUpperCase() },
                            ].map((stat, idx) => (
                              <div key={idx} className="p-3 lg:p-4 rounded-xl bg-muted border border-border">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className="text-xl lg:text-2xl font-display font-bold text-foreground">{stat.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Columns List */}
                          <div className="space-y-3 mb-6">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colonnes Disponibles</Label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 max-h-[180px] overflow-y-auto pr-2">
                              {activeData.columns?.map((col, idx) => (
                                <div key={idx} className="flex items-center gap-2 p-2 lg:p-3 rounded-xl bg-muted border border-border">
                                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                                    col.type === 'numerical' ? 'bg-blue-500' :
                                      col.type === 'categorical' ? 'bg-green-500' :
                                        'bg-purple-500'
                                  )} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-display font-semibold text-foreground truncate">{col.name}</p>
                                    <p className="text-xs text-muted-foreground">{col.type}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Preview Table (first 10 rows) */}
                          {activeData.preview && activeData.preview.length > 0 && (
                            <div className="space-y-3">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Apercu DataFrame (10 premieres lignes)</Label>
                              <div className="overflow-x-auto rounded-xl border border-border">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-muted border-border">
                                      <TableHead className="text-muted-foreground font-medium text-xs w-12">#</TableHead>
                                      {activeData.columns?.slice(0, 6).map((col, idx) => (
                                        <TableHead key={idx} className="text-muted-foreground font-medium text-xs">
                                          {col.name}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {activeData.preview.slice(0, 10).map((row, rowIdx) => (
                                      <TableRow key={rowIdx} className="border-border hover:bg-accent">
                                        <TableCell className="text-muted-foreground text-xs">{rowIdx + 1}</TableCell>
                                        {Object.values(row).slice(0, 6).map((value, colIdx) => (
                                          <TableCell key={colIdx} className="text-foreground/80 text-xs">
                                            {String(value).length > 25 ? String(value).substring(0, 25) + '...' : String(value)}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              {activeData.columns?.length > 6 && (
                                <p className="text-xs text-muted-foreground text-center italic">+ {activeData.columns.length - 6} colonnes supplementaires...</p>
                              )}
                            </div>
                          )}
                        </Card>
                      )
                    })()}
                  </div>
                )}

                {/* STEP 3: CONFIGURATION */}
                {currentStep === 3 && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Designation de l'Audit</Label>
                          <Input
                            value={auditConfig.name}
                            onChange={(e) => setAuditConfig(prev => ({ ...prev, name: e.target.value }))}
                            className="h-14 px-6 rounded-xl bg-muted border-border text-foreground font-display font-bold text-lg focus:ring-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Domaine d'IA</Label>
                            <Select value={auditConfig.iaType} onValueChange={(v) => setAuditConfig(prev => ({ ...prev, iaType: v, modelType: '' }))}>
                              <SelectTrigger className="h-12 px-4 rounded-xl bg-muted border-border text-foreground font-semibold text-sm">
                                <SelectValue placeholder="Selectionner un domaine" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {AI_DOMAINS.map((domain) => (
                                  <SelectItem key={domain.value} value={domain.value} className="font-medium text-sm">
                                    {domain.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modele IA</Label>
                            <Select
                              value={auditConfig.modelType}
                              onValueChange={(v) => setAuditConfig(prev => ({ ...prev, modelType: v }))}
                              disabled={!auditConfig.iaType}
                            >
                              <SelectTrigger className="h-12 px-4 rounded-xl bg-muted border-border text-foreground font-semibold text-sm">
                                <SelectValue placeholder={auditConfig.iaType ? "Selectionner un modele" : "Selectionner d'abord un domaine"} />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                {AI_DOMAINS
                                  .find(d => d.value === auditConfig.iaType)
                                  ?.models.map((model) => (
                                    <SelectItem
                                      key={model}
                                      value={model.toLowerCase().replace(/\s+/g, '_')}
                                      className="font-medium text-sm"
                                    >
                                      {model}
                                    </SelectItem>
                                  )) || null}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Domaine Metier</Label>
                          <Select value={auditConfig.useCase} onValueChange={(v) => setAuditConfig(prev => ({ ...prev, useCase: v }))}>
                            <SelectTrigger className="h-14 px-6 rounded-xl bg-muted border-border text-foreground font-semibold">
                              <SelectValue placeholder="Selectionner un domaine metier" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl max-h-[400px] overflow-y-auto">
                              {USE_CASES.map((useCase) => (
                                <SelectItem
                                  key={useCase.value}
                                  value={useCase.value}
                                  className="font-medium text-sm"
                                >
                                  {useCase.icon} {useCase.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3 flex flex-col">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Variable Cible (Target)</Label>
                        <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[350px] pr-2">
                          {datasets.pre?.columns?.map((col) => (
                            <button
                              key={col.name}
                              onClick={() => setAuditConfig(prev => ({ ...prev, targetColumn: col.name }))}
                              className={cn(
                                "p-3 rounded-xl border transition-all duration-300 text-left",
                                auditConfig.targetColumn === col.name
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-muted border-border hover:bg-accent text-foreground"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className={cn("text-sm font-display font-semibold", auditConfig.targetColumn === col.name ? "text-primary-foreground" : "text-foreground")}>
                                  {col.name}
                                </span>
                                {auditConfig.targetColumn === col.name && <Target className="h-4 w-4 text-primary-foreground" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attributs Sensibles a Monitorer</Label>
                      <div className="flex flex-wrap gap-3">
                        {datasets.pre?.columns?.filter(c => c.type === 'categorical' || c.type === 'boolean' || c.name.toLowerCase().includes('gender') || c.name.toLowerCase().includes('age')).map((col) => (
                          <button
                            key={col.name}
                            onClick={() => toggleProtectedAttribute(col.name)}
                            className={cn(
                              "px-5 py-3 rounded-full border transition-all duration-300 font-display font-semibold text-xs",
                              auditConfig.protectedAttributes.includes(col.name)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            {col.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: LAUNCH */}
                {currentStep === 4 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in-90 duration-700">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Rocket className="h-16 w-16 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Pret a <span className="text-primary">Lancer</span></h2>
                      <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        Tous les systemes sont operationnels. AuditIQ est pret a lancer votre analyse.
                      </p>
                    </div>

                    <Button
                      size="lg"
                      onClick={handleLaunchAudit}
                      disabled={launching}
                      className="h-16 px-16 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-lg group/btn transition-all active:scale-95"
                    >
                      {launching ? (
                        <>
                          <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          Lancer l'audit
                          <ChevronRight className="h-5 w-5 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation Bar */}
              <div className="pt-8 border-t border-border flex items-center justify-between z-10 mt-8">
                <Button
                  variant="ghost"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || launching}
                  className="h-12 px-8 rounded-xl font-display font-semibold text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-3" />
                  Retour
                </Button>

                {currentStep < 4 && (
                  <Button
                    onClick={handleNextStep}
                    className="h-12 px-10 rounded-xl bg-accent hover:bg-accent text-foreground border border-border font-display font-semibold text-sm transition-all"
                  >
                    Continuer
                    <ArrowRight className="h-4 w-4 ml-3" />
                  </Button>
                )}
              </div>

            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
