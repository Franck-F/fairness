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
  { value: 'tabular', label: 'Données Tabulaires', models: ['XGBoost', 'LightGBM', 'Random Forest', 'CatBoost', 'Neural Network', 'Logistic Regression'] },
  { value: 'nlp', label: 'Traitement du Langage Naturel', models: ['BERT', 'GPT', 'T5', 'RoBERTa', 'LLaMA', 'DistilBERT', 'ALBERT'] },
  { value: 'computer_vision', label: 'Vision par Ordinateur', models: ['ResNet', 'YOLO', 'EfficientNet', 'Vision Transformer', 'MobileNet', 'Inception'] },
  { value: 'time_series', label: 'Séries Temporelles', models: ['LSTM', 'GRU', 'Prophet', 'ARIMA', 'Transformer', 'TCN'] },
  { value: 'recommender', label: 'Systèmes de Recommandation', models: ['Collaborative Filtering', 'Content-Based', 'Matrix Factorization', 'Neural CF', 'LightFM', 'DeepFM'] },
  { value: 'speech_recognition', label: 'Reconnaissance Vocale', models: ['Wav2Vec', 'Whisper', 'DeepSpeech', 'Conformer', 'Jasper', 'QuartzNet'] },
  { value: 'reinforcement_learning', label: 'Apprentissage par Renforcement', models: ['DQN', 'PPO', 'A3C', 'SAC', 'DDPG', 'TD3'] },
  { value: 'anomaly_detection', label: 'Détection d\'Anomalies', models: ['Isolation Forest', 'One-Class SVM', 'Autoencoder', 'LOF', 'DBSCAN', 'COPOD'] },
  { value: 'generative_ai', label: 'IA Générative', models: ['GANs', 'VAE', 'Diffusion Models', 'StyleGAN', 'Stable Diffusion', 'DALL-E'] },
  { value: 'graph_neural_networks', label: 'Réseaux de Neurones Graphiques', models: ['GCN', 'GAT', 'GraphSAGE', 'GIN', 'ChebNet', 'EdgeConv'] },
  { value: 'multimodal', label: 'Multimodal', models: ['CLIP', 'DALL-E', 'Flamingo', 'BEiT', 'ViLBERT', 'ALIGN'] }
]

// Expanded Business Use Cases
const USE_CASES = [
  { value: 'general', label: 'Usage Général', icon: '🌐' },
  { value: 'credit', label: 'Credit Scoring', icon: '💳' },
  { value: 'hiring', label: 'Recrutement', icon: '👥' },
  { value: 'healthcare', label: 'Santé', icon: '🏥' },
  { value: 'finance', label: 'Finance & Trading', icon: '📈' },
  { value: 'retail', label: 'Commerce & Retail', icon: '🛒' },
  { value: 'education', label: 'Éducation', icon: '🎓' },
  { value: 'insurance', label: 'Assurance', icon: '🛡️' },
  { value: 'automotive', label: 'Automobile', icon: '🚗' },
  { value: 'energy', label: 'Énergie', icon: '⚡' },
  { value: 'manufacturing', label: 'Industrie', icon: '🏭' },
  { value: 'telecommunications', label: 'Télécommunications', icon: '📡' },
  { value: 'real_estate', label: 'Immobilier', icon: '🏢' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'transportation', label: 'Transport & Logistique', icon: '🚚' }
]

const steps = [
  { id: 1, name: 'Upload', icon: Upload, description: 'Datasets Pre/Post Processing' },
  { id: 2, name: 'Visualisation', icon: Eye, description: 'Aperçu des Données' },
  { id: 3, name: 'Configuration', icon: Settings, description: 'Paramètres & Modèle' },
  { id: 4, name: 'Lancement', icon: Rocket, description: 'Démarrage de l\'analyse' },
]

export default function UploadPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [datasets, setDatasets] = useState({ pre: null, post: null })
  const [activeDatasetTab, setActiveDatasetTab] = useState('pre') // New state for tab control
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
      toast.success(' Audit synchronisé avec succès !')
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
      <div className="space-y-6 lg:space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">

        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 lg:pb-8 border-b border-white/5">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-display font-black tracking-tighter text-white uppercase italic">
                AuditIQ <span className="text-brand-primary">Forge</span>
              </h1>
            </div>
            <p className="text-white/40 font-display font-medium text-lg lg:text-xl max-w-2xl leading-tight">
              Orchestrez votre nouvel audit d'intégrité algorithmique.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="glass-card px-5 py-3 rounded-2xl border-white/5 bg-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_#FF1493]" />
              <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] font-display">AuditIQ Sync v2.4</span>
            </div>
          </div>
        </div>

        {/* Holographic Progress Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 hidden lg:block" />

          {steps.map((step) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const Icon = step.icon

            return (
              <div
                key={step.id}
                className={cn(
                  'relative flex flex-col items-center p-4 lg:p-6 rounded-2xl lg:rounded-3xl border transition-all duration-700 glass-card z-10 group',
                  isActive
                    ? 'border-brand-primary/40 bg-brand-primary/5 shadow-[0_0_40px_rgba(255,20,147,0.1)] scale-102'
                    : isCompleted
                      ? 'border-brand-cotton/40 bg-brand-cotton/5'
                      : 'border-white/5 bg-white/5 opacity-40 grayscale'
                )}
              >
                <div className={cn(
                  'w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center mb-3 lg:mb-4 transition-all duration-700 relative z-10',
                  isActive
                    ? 'bg-brand-primary text-white shadow-[0_0_25px_#FF1493] rotate-3'
                    : isCompleted
                      ? 'bg-brand-cotton/20 text-brand-cotton border border-brand-cotton/30'
                      : 'bg-white/5 text-white/20 border border-white/10'
                )}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6" /> : <Icon className={cn("h-5 w-5 lg:h-6 lg:w-6", isActive && "animate-bounce-slow")} />}
                </div>

                <p className={cn("text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] mb-1", isActive ? "text-brand-primary" : "text-white/20")}>
                  ÉTAPE {step.id}
                </p>
                <h3 className={cn("text-xs lg:text-sm font-display font-black uppercase tracking-tight text-center", isActive ? "text-white" : "text-white/40")}>
                  {step.name}
                </h3>
              </div>
            )
          })}
        </div>

        {/* Main Forge Arena */}
        <div className="relative">
          <div className="absolute -inset-10 bg-brand-primary/5 rounded-[6rem] blur-[100px] pointer-events-none" />

          <div className="relative glass-card rounded-[4rem] border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">

            {/* Context Sidebar (Mobile Hidden) and Body */}
            <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">

              {/* Left Context Panel */}
              <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02] p-6 lg:p-10 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Phase Actuelle</span>
                    <h3 className="text-3xl font-display font-black text-white">{steps[currentStep - 1].name}</h3>
                    <p className="text-sm text-white/40 font-medium leading-relaxed">{steps[currentStep - 1].description}</p>
                  </div>

                  <div className="space-y-4 pt-8">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <ShieldAlert className="h-4 w-4 text-brand-cotton" />
                      <span className="text-[10px] font-black text-white/60">ENCRYPTION END-TO-END</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-white/20 tracking-widest">
                    <span>PROGRESSION</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 sm:p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">

                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex-1">
                  {/* STEP 1: UPLOAD */}
                  {currentStep === 1 && (
                    <div className="h-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 w-full">
                        <div className="space-y-6 lg:space-y-8">
                          <div className="flex items-center justify-between px-2">
                            <Label className="text-[10px] font-black text-white/30 tracking-widest uppercase">Dataset Original (Pre-processing)</Label>
                            {datasets.pre && <Badge className="bg-green-500/20 text-green-500 border-green-500/30">UPLOADED</Badge>}
                          </div>
                          <FileUpload
                            onFileUploaded={(data) => handleDatasetUploaded('pre', data)}
                            buttonLabel="Confirmer Pre-Processing"
                          />
                          {datasets.pre && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Database className="h-4 w-4 text-brand-primary" />
                                <span className="text-xs font-medium text-white/60 truncate max-w-[150px]">{datasets.pre.filename}</span>
                              </div>
                              <span className="text-[10px] font-black text-white/20">{datasets.pre.stats?.rows} RANGÉES</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6 lg:space-y-8">
                          <div className="flex items-center justify-between px-2">
                            <Label className="text-[10px] font-black text-white/30 tracking-widest uppercase">Dataset Mitigé (Post-processing)</Label>
                            {datasets.post && <Badge className="bg-green-500/20 text-green-500 border-green-500/30">UPLOADED</Badge>}
                            {!datasets.post && <Badge variant="outline" className="text-[9px] opacity-40">OPTIONNEL</Badge>}
                          </div>
                          <FileUpload
                            onFileUploaded={(data) => handleDatasetUploaded('post', data)}
                            buttonLabel="Confirmer Post-Processing"
                          />
                          {datasets.post && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Zap className="h-4 w-4 text-brand-cotton" />
                                <span className="text-xs font-medium text-white/60 truncate max-w-[150px]">{datasets.post.filename}</span>
                              </div>
                              <span className="text-[10px] font-black text-white/20">{datasets.post.stats?.rows} RANGÉES</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {datasets.pre && (
                        <div className="flex flex-col items-center pt-8 border-t border-white/5 mt-auto">
                          <Button
                            onClick={handleNextStep}
                            className="group bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-widest px-12 py-6 rounded-2xl h-auto"
                          >
                            CONFIGURER L'AUDITION
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
                            "flex-1 px-6 py-3 rounded-2xl font-display font-black uppercase text-xs tracking-widest transition-all duration-300",
                            activeDatasetTab === 'pre'
                              ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                          )}
                        >
                          📊 Dataset Original
                        </button>
                        {datasets.post && (
                          <button
                            onClick={() => setActiveDatasetTab('post')}
                            className={cn(
                              "flex-1 px-6 py-3 rounded-2xl font-display font-black uppercase text-xs tracking-widest transition-all duration-300",
                              activeDatasetTab === 'post'
                                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                            )}
                          >
                            ⚡ Dataset Mitigé
                          </button>
                        )}
                      </div>

                      {/* Active Dataset Preview */}
                      {(() => {
                        const activeData = activeDatasetTab === 'pre' ? datasets.pre : datasets.post
                        if (!activeData) return null

                        return (
                          <div className="glass-card p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-white/10 bg-white/5">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                                <Database className="h-5 w-5 lg:h-6 lg:w-6 text-brand-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg lg:text-xl font-display font-black text-white uppercase tracking-tight">
                                  {activeDatasetTab === 'pre' ? 'Dataset Original (Pre-processing)' : 'Dataset Mitigé (Post-processing)'}
                                </h3>
                                <p className="text-xs lg:text-sm text-white/40 font-medium">{activeData.filename}</p>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                              <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Lignes</p>
                                <p className="text-xl lg:text-2xl font-display font-black text-white">{activeData.stats?.rows?.toLocaleString() || 'N/A'}</p>
                              </div>
                              <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Colonnes</p>
                                <p className="text-xl lg:text-2xl font-display font-black text-white">{activeData.columns?.length || 0}</p>
                              </div>
                              <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Taille</p>
                                <p className="text-xl lg:text-2xl font-display font-black text-white">{activeData.stats?.size || 'N/A'}</p>
                              </div>
                              <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[9px] lg:text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Format</p>
                                <p className="text-xl lg:text-2xl font-display font-black text-white uppercase">{activeData.filename?.split('.').pop() || 'CSV'}</p>
                              </div>
                            </div>

                            {/* Columns List */}
                            <div className="space-y-3 mb-6">
                              <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">Colonnes Disponibles</Label>
                              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                {activeData.columns?.map((col, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0",
                                      col.type === 'numerical' ? 'bg-blue-500' :
                                        col.type === 'categorical' ? 'bg-green-500' :
                                          'bg-purple-500'
                                    )} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-display font-bold text-white truncate">{col.name}</p>
                                      <p className="text-[9px] text-white/40 uppercase font-black tracking-wider">{col.type}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Preview Table (first 10 rows) */}
                            {activeData.preview && activeData.preview.length > 0 && (
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">Aperçu DataFrame (10 premières lignes)</Label>
                                <div className="overflow-x-auto rounded-xl lg:rounded-2xl border border-white/10">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-white/5 border-white/10">
                                        <TableHead className="text-white/60 font-black text-[9px] uppercase tracking-wider w-12">#</TableHead>
                                        {activeData.columns?.slice(0, 6).map((col, idx) => (
                                          <TableHead key={idx} className="text-white/60 font-black text-[9px] uppercase tracking-wider">
                                            {col.name}
                                          </TableHead>
                                        ))}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {activeData.preview.slice(0, 10).map((row, rowIdx) => (
                                        <TableRow key={rowIdx} className="border-white/5 hover:bg-white/5">
                                          <TableCell className="text-white/40 text-[10px] font-black">{rowIdx + 1}</TableCell>
                                          {Object.values(row).slice(0, 6).map((value, colIdx) => (
                                            <TableCell key={colIdx} className="text-white/80 text-xs font-medium">
                                              {String(value).length > 25 ? String(value).substring(0, 25) + '...' : String(value)}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                {activeData.columns?.length > 6 && (
                                  <p className="text-[10px] text-white/40 text-center font-medium italic">+ {activeData.columns.length - 6} colonnes supplémentaires...</p>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {/* STEP 3: CONFIGURATION */}
                  {currentStep === 3 && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="space-y-8">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-2">Désignation de l'Audit</Label>
                            <Input
                              value={auditConfig.name}
                              onChange={(e) => setAuditConfig(prev => ({ ...prev, name: e.target.value }))}
                              className="h-16 px-8 rounded-3xl bg-white/5 border-white/5 text-white font-display font-black text-xl focus:ring-brand-primary"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-2">Domaine d'IA</Label>
                              <Select value={auditConfig.iaType} onValueChange={(v) => setAuditConfig(prev => ({ ...prev, iaType: v, modelType: '' }))}>
                                <SelectTrigger className="h-14 px-6 rounded-2xl bg-white/5 border-white/5 text-white font-display font-black text-[10px] uppercase">
                                  <SelectValue placeholder="Sélectionner un domaine" />
                                </SelectTrigger>
                                <SelectContent className="glass-card border-white/10 bg-[#0A0A0B]/90 text-white backdrop-blur-3xl rounded-2xl max-h-[300px] overflow-y-auto">
                                  {AI_DOMAINS.map((domain) => (
                                    <SelectItem key={domain.value} value={domain.value} className="font-display font-black uppercase text-[10px] tracking-widest p-3 hover:bg-brand-primary/10">
                                      {domain.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-2">Modèle IA</Label>
                              <Select
                                value={auditConfig.modelType}
                                onValueChange={(v) => setAuditConfig(prev => ({ ...prev, modelType: v }))}
                                disabled={!auditConfig.iaType}
                              >
                                <SelectTrigger className="h-14 px-6 rounded-2xl bg-white/5 border-white/5 text-white font-display font-black text-[10px] uppercase">
                                  <SelectValue placeholder={auditConfig.iaType ? "Sélectionner un modèle" : "Sélectionner d'abord un domaine"} />
                                </SelectTrigger>
                                <SelectContent className="glass-card border-white/10 bg-[#0A0A0B]/90 text-white backdrop-blur-3xl rounded-2xl max-h-[300px] overflow-y-auto">
                                  {AI_DOMAINS
                                    .find(d => d.value === auditConfig.iaType)
                                    ?.models.map((model) => (
                                      <SelectItem
                                        key={model}
                                        value={model.toLowerCase().replace(/\s+/g, '_')}
                                        className="font-display font-black uppercase text-[10px] tracking-widest p-3 hover:bg-brand-primary/10"
                                      >
                                        {model}
                                      </SelectItem>
                                    )) || null}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-2">Domaine Métier</Label>
                            <Select value={auditConfig.useCase} onValueChange={(v) => setAuditConfig(prev => ({ ...prev, useCase: v }))}>
                              <SelectTrigger className="h-16 px-8 rounded-3xl bg-white/5 border-white/5 text-white font-display font-black">
                                <SelectValue placeholder="Sélectionner un domaine métier" />
                              </SelectTrigger>
                              <SelectContent className="glass-card border-white/10 bg-[#0A0A0B]/90 text-white backdrop-blur-3xl rounded-2xl max-h-[400px] overflow-y-auto">
                                {USE_CASES.map((useCase) => (
                                  <SelectItem
                                    key={useCase.value}
                                    value={useCase.value}
                                    className="font-display font-black uppercase text-[10px] tracking-widest p-3 hover:bg-brand-primary/10"
                                  >
                                    {useCase.icon} {useCase.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4 flex flex-col">
                          <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-2">Variable Cible (Target)</Label>
                          <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[350px] pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {datasets.pre?.columns?.map((col) => (
                              <button
                                key={col.name}
                                onClick={() => setAuditConfig(prev => ({ ...prev, targetColumn: col.name }))}
                                className={cn(
                                  "p-4 rounded-2xl border transition-all duration-500 text-left relative overflow-hidden group/target",
                                  auditConfig.targetColumn === col.name
                                    ? "bg-brand-primary border-brand-primary shadow-lg"
                                    : "bg-white/5 border-white/5 hover:bg-white/10"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={cn("text-xs font-display font-black uppercase tracking-widest", auditConfig.targetColumn === col.name ? "text-white" : "text-white/40")}>
                                    {col.name}
                                  </span>
                                  {auditConfig.targetColumn === col.name && <Target className="h-4 w-4 text-white animate-pulse" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <Label className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase ml-2">Attributs Sensibles à Monitorer</Label>
                        <div className="flex flex-wrap gap-3">
                          {datasets.pre?.columns?.filter(c => c.type === 'categorical' || c.type === 'boolean' || c.name.toLowerCase().includes('gender') || c.name.toLowerCase().includes('age')).map((col) => (
                            <button
                              key={col.name}
                              onClick={() => toggleProtectedAttribute(col.name)}
                              className={cn(
                                "px-6 py-4 rounded-full border transition-all duration-500 font-display font-black text-[10px] uppercase tracking-widest",
                                auditConfig.protectedAttributes.includes(col.name)
                                  ? "bg-brand-cotton text-brand-violet border-brand-cotton shadow-[0_0_20px_rgba(183,161,255,0.3)]"
                                  : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
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
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in-90 duration-700">
                      <div className="relative group">
                        <div className="absolute -inset-12 bg-brand-primary/20 rounded-full blur-[60px] animate-pulse" />
                        <div className="relative w-40 h-40 rounded-[3rem] bg-gradient-to-br from-brand-primary to-brand-cotton flex items-center justify-center shadow-[0_0_50px_rgba(255,20,147,0.4)] group-hover:scale-110 transition-transform duration-700 cursor-pointer">
                          <Rocket className="h-20 w-20 text-white animate-bounce-slow" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase italic tracking-tighter">PRÊT AU <span className="text-brand-primary">LANCEMENT</span></h2>
                        <p className="text-lg text-white/40 font-display font-medium max-w-lg mx-auto leading-tight">
                          Tous les systèmes sont opérationnels. AuditIQ est prêt à lancer votre analyse.
                        </p>
                      </div>

                      <Button
                        size="xl"
                        onClick={handleLaunchAudit}
                        disabled={launching}
                        className="h-20 px-20 rounded-3xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black text-xl uppercase tracking-[0.3em] shadow-2xl shadow-brand-primary/40 group/btn transition-all active:scale-95"
                      >
                        {launching ? (
                          <>
                            <Loader2 className="h-8 w-8 mr-4 animate-spin" />
                            SEQUENCING...
                          </>
                        ) : (
                          <>
                            DÉPLOYER L'INSPECTION
                            <ChevronRight className="h-6 w-6 ml-4 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Bar */}
                <div className="pt-16 border-t border-white/5 flex items-center justify-between z-10">
                  <Button
                    variant="ghost"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1 || launching}
                    className="h-14 px-10 rounded-2xl font-display font-black uppercase text-[10px] tracking-[0.3em] text-white/20 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-4" />
                    RETOUR
                  </Button>

                  {currentStep < 4 && (
                    <Button
                      onClick={handleNextStep}
                      className="h-14 px-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                      CONTINUER
                      <ArrowRight className="h-4 w-4 ml-4" />
                    </Button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
