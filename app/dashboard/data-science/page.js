'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Loader2,
  Database,
  ChevronRight,
  ChevronLeft,
  Brain,
  Sparkles,
  BarChart3,
  Settings2,
  Rocket,
  Eye,
  FileBarChart2
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Step Components
import { InitialAnalysisStep } from '@/components/dashboard/data-science/initial-analysis'
import { AdvancedEDAStep } from '@/components/dashboard/data-science/advanced-eda'
import { FeatureEngineeringStep } from '@/components/dashboard/data-science/feature-engineering'
import { AdvancedModelingStep } from '@/components/dashboard/data-science/advanced-modeling'
import { ModelInterpretationStep } from '@/components/dashboard/data-science/model-interpretation'
import { FileUpload } from '@/components/dashboard/file-upload'
import { DSAgentInterface } from '@/components/dashboard/data-science/ds-agent-interface'
import { PageHeader } from '@/components/dashboard/page-header'
import { EmptyState } from '@/components/dashboard/empty-state'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export default function DataSciencePage() {
  const { session } = useAuth()
  const [datasets, setDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState('')
  const [loadingDatasets, setLoadingDatasets] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // Workflow States
  const [targetColumn, setTargetColumn] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [edaData, setEdaData] = useState(null)
  const [modelingResults, setModelingResults] = useState(null)
  const [shapData, setShapData] = useState(null)
  const [intelligenceData, setIntelligenceData] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [loadingIntelligence, setLoadingIntelligence] = useState(false)

  // Projects state
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false)

  useEffect(() => {
    if (session?.access_token) {
      fetchDatasets()
      fetchProjects()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/ds/projects', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      const data = await response.json()
      if (data.projects && data.projects.length > 0) {
        setProjects(data.projects)
        // Auto-select most recent if none selected
        if (!selectedProjectId) {
          setSelectedProjectId(data.projects[0].id)
        }
      }
    } catch (error) {
      // silently handle fetch errors
    }
  }

  const createProject = async () => {
    if (!projectName) {
      toast.error('Veuillez donner un nom au projet')
      return
    }

    setIsCreatingProject(true)
    try {
      const response = await fetch('/api/ds/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: selectedDataset,
          project_name: projectName,
          target_column: targetColumn,
          problem_type: 'Classification' // Default
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setProjects([data.project, ...projects])
        setSelectedProjectId(data.project.id)
        toast.success('Projet cree avec succes')
        setIsNewProjectDialogOpen(false)
        setProjectName('')
        // Refresh intelligence with project link
        fetchIntelligence(selectedDataset, data.project.id)
      }
    } catch (error) {
      toast.error('Erreur lors de la creation du projet')
    } finally {
      setIsCreatingProject(false)
    }
  }

  useEffect(() => {
    if (selectedDataset && targetColumn) {
      runInitialAnalysis(selectedDataset)
    }
  }, [targetColumn])

  const fetchDatasets = async () => {
    setLoadingDatasets(true)
    try {
      const response = await fetch('/api/datasets', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      const data = await response.json()
      if (data.datasets) {
        setDatasets(data.datasets)
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des datasets')
    } finally {
      setLoadingDatasets(false)
    }
  }

  const handleDatasetChange = async (datasetId) => {
    const dataset = datasets.find(d => d.id.toString() === datasetId)
    setSelectedDataset(datasetId)
    setAnalysisData(null)
    setModelingResults(null)
    setEdaData(null)
    setShapData(null)
    setIntelligenceData(null)
    setPreviewData(null)
    setTargetColumn('')
    setCurrentStep(1)

    // Run intelligence analysis (will also link project and dataset in backend)
    if (datasetId) {
      fetchIntelligence(datasetId, selectedProjectId)
    }
    // Auto-run analysis if we have the dataset
    if (dataset && targetColumn) {
      const activeId = dataset.fastapi_dataset_id || dataset.id
      runInitialAnalysis(activeId)
    }
  }

  const fetchIntelligence = async (datasetId, projectId = null) => {
    setLoadingIntelligence(true)
    try {
      const response = await fetch('/api/ds/intelligence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: datasetId.toString(),
          project_id: projectId || selectedProjectId
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setIntelligenceData(data.intelligence)
        setPreviewData(data.preview)

        // Populate initial analysis data for Command Center (stats and health)
        setAnalysisData(prev => ({
          ...prev,
          detailed_stats: data.detailed_stats,
          quality_score: data.quality_score
        }))

        // Auto-select target if AI suggested it and we don't have one
        if (data.intelligence?.suggested_target && !targetColumn) {
          setTargetColumn(data.intelligence.suggested_target)
          toast.info(`IA suggere la cible : ${data.intelligence.suggested_target}`, {
            description: "Cliquez sur la carte d'intelligence pour confirmer."
          })
        }
      }
    } catch (error) {
      // silently handle intelligence errors
    } finally {
      setLoadingIntelligence(false)
    }
  }

  const runInitialAnalysis = async (datasetId) => {
    if (!datasetId) return
    setLoading(true)
    try {
      const response = await fetch('/api/ds/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: datasetId.toString(),
          target_column: targetColumn,
          project_id: selectedProjectId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur serveur (${response.status})`)
      }

      if (data.status === 'success') {
        setAnalysisData(data)
        toast.success('Analyse initiale terminee')
      }
    } catch (error) {
      const isFetchError = error.message === 'fetch failed'
      toast.error(
        isFetchError
          ? 'Backend injoignable. Verifiez que le serveur FastAPI est lance (port 8000).'
          : error.message || 'Erreur lors de l\'analyse'
      )
    } finally {
      setLoading(false)
    }
  }

  const runAdvancedEDA = async () => {
    if (!selectedDataset) return
    const dataset = datasets.find(d => d.id.toString() === selectedDataset)
    const activeId = dataset?.fastapi_dataset_id || selectedDataset

    setLoading(true)
    try {
      const response = await fetch('/api/ds/eda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: activeId.toString(),
          target_column: targetColumn,
          n_components: 2,
          project_id: selectedProjectId
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setEdaData(data)
        toast.success('Visualisations avancees calculees')
      } else {
        throw new Error(data.error || 'Erreur EDA')
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors du calcul EDA')
    } finally {
      setLoading(false)
    }
  }

  const applyFeatureEngineering = async (options) => {
    const dataset = datasets.find(d => d.id.toString() === selectedDataset)
    const activeId = dataset?.fastapi_dataset_id || selectedDataset

    setLoading(true)
    try {
      const response = await fetch('/api/ds/feature-engineering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: activeId.toString(),
          ...options,
          target_column: targetColumn,
          project_id: selectedProjectId
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        toast.success('Feature Engineering applique avec succes')
        setCurrentStep(4) // Move to modeling
      }
    } catch (error) {
      toast.error('Erreur feature engineering')
    } finally {
      setLoading(false)
    }
  }

  const runModeling = async (options) => {
    if (!targetColumn) {
      toast.error('Veuillez selectionner une variable cible')
      return
    }

    const dataset = datasets.find(d => d.id.toString() === selectedDataset)
    const activeId = dataset?.fastapi_dataset_id || selectedDataset

    setLoading(true)
    try {
      const response = await fetch('/api/ds/modeling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: activeId.toString(),
          target_column: targetColumn,
          project_id: selectedProjectId,
          ...options
        }),
      })
      const data = await response.json()
      if (data.model_id) {
        setModelingResults(data)
        // Auto-run interpretation
        runInterpretation(data.model_id)
        toast.success('Modele entraine avec succes')
        setCurrentStep(5)
      }
    } catch (error) {
      toast.error('Erreur modelisation')
    } finally {
      setLoading(false)
    }
  }

  const runInterpretation = async (modelId) => {
    const dataset = datasets.find(d => d.id.toString() === selectedDataset)
    const activeId = dataset?.fastapi_dataset_id || selectedDataset

    try {
      const response = await fetch('/api/ds/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          model_id: modelId,
          dataset_id: activeId.toString(),
          project_id: selectedProjectId
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setShapData(data.shap)
      }
    } catch (error) {
      // silently handle interpretation errors
    }
  }

  const handleAgentAction = (action) => {
    if (action.type === 'analysis' || action.type === 'eda') {
      if (action.params?.target_column) setTargetColumn(action.params.target_column)
      setCurrentStep(action.type === 'analysis' ? 1 : 2)
      if (action.type === 'eda') runAdvancedEDA()
    } else if (action.type === 'feature_engineering') {
      setCurrentStep(3)
    } else if (action.type === 'modeling') {
      setCurrentStep(4)
    }
    toast.info(`Action IA activee : ${action.label}`)
  }


  const nextStep = () => {
    if (currentStep === 1) runAdvancedEDA()
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const steps = [
    { id: 1, title: 'Analyse Initiale', icon: BarChart3 },
    { id: 2, title: 'Exploration Expert', icon: Sparkles },
    { id: 3, title: 'Feature Engineering', icon: Settings2 },
    { id: 4, title: 'Modelisation', icon: Rocket },
    { id: 5, title: 'Interpretation', icon: Eye },
  ]

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4 border-b border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground leading-none">
                  Science des <span className="text-primary">Donnees</span>
                </h1>
                <p className="text-muted-foreground font-display font-medium mt-1 uppercase tracking-widest text-[10px]">Workflow Expert Senior</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-card border border-border p-1.5 rounded-xl flex items-center gap-2">
              {/* Project Selection */}
              <Select
                value={selectedProjectId || ''}
                onValueChange={(val) => {
                  if (val === 'new_project') {
                    setIsNewProjectDialogOpen(true)
                  } else {
                    setSelectedProjectId(val)
                  }
                }}
              >
                <SelectTrigger className="w-[180px] h-11 bg-transparent border-none font-display font-bold focus:ring-0">
                  <Brain className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Choisir Projet" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.project_name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new_project" className="text-primary border-t border-border">
                    <Plus className="h-4 w-4 mr-2 inline" /> Nouveau Projet
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Outside Dialog to avoid focus trap */}
              <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Nouveau Projet Data Science</DialogTitle>
                    <DialogDescription>
                      Creez un espace de travail dedie pour vos analyses et modeles.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Nom du Projet</label>
                      <input
                        className="w-full bg-muted border border-border rounded-xl p-4 text-foreground outline-none focus:border-primary/50 transition-colors"
                        placeholder="Ex: Analyse Predictive Hiver..."
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <Button
                      onClick={createProject}
                      disabled={isCreatingProject || !projectName}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all"
                    >
                      {isCreatingProject ? <Loader2 className="animate-spin mr-2" /> : 'Creer le Projet'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="w-px h-6 bg-border mx-1" />

              <Select value={selectedDataset} onValueChange={handleDatasetChange}>
                <SelectTrigger className="w-[200px] h-11 bg-transparent border-none font-display font-bold focus:ring-0">
                  <Database className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Dataset" />
                </SelectTrigger>
                <SelectContent>
                  {datasets.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id.toString()}>
                      {ds.original_filename || ds.filename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="w-px h-6 bg-border mx-1" />

              <Select value={targetColumn} onValueChange={setTargetColumn}>
                <SelectTrigger className="w-[180px] h-11 bg-transparent border-none text-muted-foreground font-display font-bold focus:ring-0">
                  <Rocket className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Variable Cible" />
                </SelectTrigger>
                <SelectContent>
                  {analysisData?.detailed_stats && Object.keys(analysisData.detailed_stats).map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 w-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-110 active:scale-90 border-none">
                  <Plus className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl font-display font-black">Nouveau Projet</DialogTitle>
                  <DialogDescription>
                    Telechargez vos donnees pour initier le pipeline d'intelligence artificielle.
                  </DialogDescription>
                </DialogHeader>
                <FileUpload onFileUploaded={() => {
                  setIsUploadOpen(false)
                  fetchDatasets()
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Wizard Navigation Hub */}
        <div className="relative px-4 py-6 overflow-x-auto scrollbar-hide">
          <div className="relative flex justify-between min-w-[700px]">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 -z-10" />
            <div
              className="absolute top-1/2 left-0 h-[3px] bg-primary -translate-y-1/2 -z-10 transition-all duration-700"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center gap-4 group cursor-pointer"
                  onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-xl flex items-center justify-center border transition-all duration-500",
                    isActive
                      ? "bg-primary border-primary text-primary-foreground scale-110"
                      : isCompleted
                        ? "bg-muted border-border text-foreground"
                        : "bg-background border-border text-muted-foreground/70 hover:border-muted-foreground"
                  )}>
                    <step.icon className={cn("h-7 w-7", isActive ? "animate-pulse" : "")} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                      isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/50"
                    )}>
                      {step.title}
                    </span>
                    {isActive && (
                      <div className="h-1 w-6 bg-primary rounded-full mt-1 animate-in slide-in-from-top-2 duration-300" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Stage */}
        <div className="min-h-[500px] relative">
          {!selectedDataset ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <Card className="p-20 text-center relative overflow-hidden group">
                <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                  <div className="relative inline-flex">
                    <div className="w-24 h-24 rounded-xl bg-muted border border-border flex items-center justify-center">
                      <Database className="h-12 w-12 text-muted-foreground group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-primary border border-primary/50 flex items-center justify-center animate-bounce">
                      <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground leading-tight">
                      Pret pour l'Excellence <br /><span className="text-primary">Algorithmique ?</span>
                    </h3>
                    <p className="text-muted-foreground font-display font-medium text-base leading-relaxed">
                      Lancez le workflow Senior Data Scientist pour transformer vos donnees brutes en insights predictifs de haute precision.
                    </p>
                  </div>

                  <div className="pt-8">
                    <FileUpload onFileUploaded={(data) => {
                      fetchDatasets().then(() => {
                        if (data.id) handleDatasetChange(data.id.toString())
                      })
                    }} />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Statistiques Avancees", desc: "Skewness, Kurtosis et detection d'outliers automatique.", icon: BarChart3 },
                  { title: "Visualisation Cible", desc: "Analyse des distributions correlees a votre variable cible.", icon: Eye },
                  { title: "Interpretabilite AI", desc: "Comprenez les decisions du modele grace aux valeurs SHAP.", icon: Brain }
                ].map((feature, i) => (
                  <Card key={i} className="p-8 hover:bg-accent transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:border-primary/40 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-display font-black text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          ) : loading || loadingIntelligence ? (
            <div className="py-40 text-center animate-pulse">
              <div className="relative inline-flex mb-10">
                <Loader2 className="h-20 w-20 text-primary animate-spin" />
              </div>
              <h3 className="text-3xl font-display font-black text-foreground mb-2 tracking-tight">Analyse en cours...</h3>
              <p className="text-muted-foreground font-display font-black uppercase tracking-[0.3em] text-[10px]">Le moteur cognitif traite vos donnees</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                  <div className="xl:col-span-3">
                    <InitialAnalysisStep
                      data={analysisData?.detailed_stats}
                      preview={previewData}
                      intelligence={intelligenceData}
                      qualityScore={analysisData?.quality_score || intelligenceData?.quality_score || 0}
                      currentTarget={targetColumn}
                      onSelectTarget={(col) => {
                        setTargetColumn(col)
                        toast.success(`Cible selectionnee : ${col}`)
                      }}
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <DSAgentInterface
                      datasetId={selectedDataset}
                      targetColumn={targetColumn}
                      onActionTriggered={handleAgentAction}
                      token={session?.access_token}
                    />
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <AdvancedEDAStep
                  targetDistributions={edaData?.target_distributions}
                  dimReduction={edaData?.dimensionality_reduction}
                  correlations={edaData?.correlations}
                  outliers={edaData?.outliers}
                  expert_insights={edaData?.expert_insights}
                  targetColumn={targetColumn}
                />
              )}
              {currentStep === 3 && (
                <FeatureEngineeringStep
                  columns={analysisData ? Object.keys(analysisData) : []}
                  onApply={applyFeatureEngineering}
                  loading={loading}
                />
              )}
              {currentStep === 4 && (
                <AdvancedModelingStep
                  columns={analysisData ? Object.keys(analysisData) : []}
                  onTrain={runModeling}
                  loading={loading}
                />
              )}
              {currentStep === 5 && (
                <ModelInterpretationStep
                  shapData={shapData}
                  metrics={modelingResults?.metrics}
                />
              )}
            </div>
          )}
        </div>

        {/* Dynamic Navigation Dock */}
        {selectedDataset && !loading && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-card/95 backdrop-blur-sm border border-border h-20 px-4 rounded-xl flex items-center gap-6 shadow-lg">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                disabled={currentStep === 1}
                className="h-12 w-12 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <div className="flex items-center gap-3 px-4">
                {steps.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "h-1.5 transition-all duration-500 rounded-full",
                      currentStep === s.id ? 'bg-primary w-10' : 'bg-muted-foreground/20 w-3'
                    )}
                  />
                ))}
              </div>

              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105"
                >
                  Suivant
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105"
                  onClick={() => window.location.href = '/dashboard/audits'}
                >
                  <FileBarChart2 className="h-5 w-5 mr-3" />
                  Audit de Fairness
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
