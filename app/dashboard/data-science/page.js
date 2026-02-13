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

// Step Components
import { InitialAnalysisStep } from '@/components/dashboard/data-science/initial-analysis'
import { AdvancedEDAStep } from '@/components/dashboard/data-science/advanced-eda'
import { FeatureEngineeringStep } from '@/components/dashboard/data-science/feature-engineering'
import { AdvancedModelingStep } from '@/components/dashboard/data-science/advanced-modeling'
import { ModelInterpretationStep } from '@/components/dashboard/data-science/model-interpretation'
import { FileUpload } from '@/components/dashboard/file-upload'
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

  useEffect(() => {
    if (session?.access_token) {
      fetchDatasets()
    }
  }, [session])

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
      console.error('Error fetching datasets:', error)
      toast.error('Erreur lors du chargement des datasets')
    } finally {
      setLoadingDatasets(false)
    }
  }

  const handleDatasetChange = (datasetId) => {
    const dataset = datasets.find(d => d.id.toString() === datasetId)
    setSelectedDataset(datasetId)
    setAnalysisData(null)
    setEdaData(null)
    setTargetColumn('')
    setCurrentStep(1)

    // Auto-run analysis if we have the dataset
    if (dataset) {
      const activeId = dataset.fastapi_dataset_id || dataset.id
      runInitialAnalysis(activeId)
    }
  }

  const runInitialAnalysis = async (datasetId) => {
    if (!datasetId) return
    setLoading(true)
    console.log('Running analysis for dataset:', datasetId)
    try {
      const response = await fetch('/api/ds/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: datasetId.toString(),
          target_column: targetColumn
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur serveur (${response.status})`)
      }

      if (data.status === 'success') {
        setAnalysisData(data)
        toast.success('Analyse initiale terminée')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      const isFetchError = error.message === 'fetch failed'
      toast.error(
        isFetchError
          ? 'Backend injoignable. Vérifiez que le serveur FastAPI est lancé (port 8000).'
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
          n_components: 2
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setEdaData(data)
        toast.success('Visualisations avancées calculées')
      } else {
        throw new Error(data.error || 'Erreur EDA')
      }
    } catch (error) {
      console.error('EDA error:', error)
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
          target_column: targetColumn
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        toast.success('Feature Engineering appliqué avec succès')
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
      toast.error('Veuillez sélectionner une variable cible')
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
          ...options
        }),
      })
      const data = await response.json()
      if (data.model_id) {
        setModelingResults(data)
        // Auto-run interpretation
        runInterpretation(data.model_id)
        toast.success('Modèle entraîné avec succès')
        setCurrentStep(5)
      }
    } catch (error) {
      toast.error('Erreur modélisation')
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
          dataset_id: activeId.toString()
        }),
      })
      const data = await response.json()
      if (data.status === 'success') {
        setShapData(data.shap)
      }
    } catch (error) {
      console.error('Interpretation error:', error)
    }
  }


  const nextStep = () => {
    if (currentStep === 1) runAdvancedEDA()
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const steps = [
    { id: 1, title: 'Analyse Initiale', icon: BarChart3 },
    { id: 2, title: 'Exploration Expert', icon: Sparkles },
    { id: 3, title: 'Feature Engineering', icon: Settings2 },
    { id: 4, title: 'Modélisation', icon: Rocket },
    { id: 5, title: 'Interprétation', icon: Eye },
  ]

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              Data Science Workflow
            </h1>
            <p className="text-muted-foreground mt-1 italic">
              Expérience guidée par un Senior Data Scientist Expert
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedDataset} onValueChange={handleDatasetChange}>
              <SelectTrigger className="w-[280px] bg-background border-primary/20">
                <SelectValue placeholder="Sélectionnez un dataset" />
              </SelectTrigger>
              <SelectContent>
                {loadingDatasets ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : datasets.map((ds) => (
                  <SelectItem key={ds.id} value={ds.id.toString()}>
                    {ds.original_filename || ds.filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={targetColumn} onValueChange={setTargetColumn}>
              <SelectTrigger className="w-[200px] bg-background border-primary/20">
                <SelectValue placeholder="Variable Cible" />
              </SelectTrigger>
              <SelectContent>
                {analysisData?.detailed_stats && Object.keys(analysisData.detailed_stats).map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-primary/20 hover:bg-primary/5">
                  <Plus className="h-4 w-4 text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nouveau Dataset</DialogTitle>
                  <DialogDescription>
                    Importez un fichier CSV ou Excel pour commencer l&apos;analyse.
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

        {/* Wizard Progress */}
        <div className="pt-4 px-4 overflow-x-auto">
          <div className="relative flex justify-between min-w-[600px] mb-8">
            <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0" />
            {steps.map((step) => (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.id
                  ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20'
                  : 'bg-background border-muted text-muted-foreground hover:border-primary/50'
                  }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${currentStep === step.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'
                  }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {!selectedDataset ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Card className="bg-card border-dashed border-2 p-10 text-center transition-all hover:border-primary/40 group">
                <div className="max-w-xl mx-auto space-y-6">
                  <div className="relative inline-flex mb-2">
                    <Database className="h-16 w-16 text-muted-foreground opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">Prêt pour l&apos;Analyse Expert ?</h3>
                    <p className="text-muted-foreground">
                      Pour lancer le workflow du Senior Data Scientist, déposez votre dataset ci-dessous ou sélectionnez-en un dans la liste.
                    </p>
                  </div>

                  <div className="pt-4">
                    <FileUpload onFileUploaded={(data) => {
                      fetchDatasets().then(() => {
                        if (data.id) handleDatasetChange(data.id.toString())
                      })
                    }} />
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {[
                  { title: "Statistiques Avancées", desc: "Skewness, Kurtosis et détection d'outliers automatique." },
                  { title: "Visualisation Cible", desc: "Analyse des distributions corrélées à votre variable cible." },
                  { title: "Interprétabilité", desc: "Comprenez les décisions du modèle grâce aux valeurs SHAP." }
                ].map((feature, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-lg font-medium animate-pulse">Le Senior Data Scientist analyse vos données...</p>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <InitialAnalysisStep
                  data={analysisData?.detailed_stats}
                  recommendations={analysisData?.recommendations || []}
                  qualityScore={analysisData?.quality_score || 0}
                />
              )}
              {currentStep === 2 && (
                <AdvancedEDAStep
                  targetDistributions={edaData?.target_distributions}
                  dimReduction={edaData?.dimensionality_reduction}
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
            </>
          )}
        </div>

        {/* Footer Navigation */}
        {selectedDataset && !loading && (
          <div className="flex justify-between items-center pt-6 border-t font-medium">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`w-2 h-2 rounded-full transition-all ${currentStep === s.id ? 'bg-primary w-6' : 'bg-muted'}`}
                />
              ))}
            </div>

            {currentStep < 5 ? (
              <Button onClick={nextStep} className="gap-2">
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-8 border-2" onClick={() => window.location.href = '/dashboard/audits'}>
                <FileBarChart2 className="h-4 w-4" />
                Lancer l&apos;Audit de Fairness
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
