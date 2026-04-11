'use client'

import { useEffect, useMemo, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Database,
  Target,
  Users,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  Info,
  Scale,
  Play,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

const RISK_STYLES = {
  vert: {
    label: 'Risque faible',
    badge: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
    dot: 'bg-green-500',
    ring: 'ring-green-500/30',
    text: 'text-green-600 dark:text-green-400',
  },
  orange: {
    label: 'Risque moyen',
    badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    dot: 'bg-orange-500',
    ring: 'ring-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
  },
  rouge: {
    label: 'Risque eleve',
    badge: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    dot: 'bg-red-500',
    ring: 'ring-red-500/30',
    text: 'text-red-600 dark:text-red-400',
  },
}

function riskStyle(level) {
  return RISK_STYLES[level] || RISK_STYLES.vert
}

function extractColumnNames(dataset) {
  if (!dataset) return []
  const info = dataset.columns_info
  if (info?.columns && Array.isArray(info.columns)) {
    return info.columns.map((c) => c.name).filter(Boolean)
  }
  if (Array.isArray(info)) {
    return info.map((c) => c.name).filter(Boolean)
  }
  return []
}

export default function UnsupervisedPage() {
  const { session } = useAuth()
  const [datasets, setDatasets] = useState([])
  const [loadingDatasets, setLoadingDatasets] = useState(true)
  const [selectedDatasetId, setSelectedDatasetId] = useState('')
  const [predictionColumn, setPredictionColumn] = useState('')
  const [favorableValue, setFavorableValue] = useState('1')
  const [nClusters, setNClusters] = useState(5)
  const [disparityThreshold, setDisparityThreshold] = useState(0.1)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (session?.access_token) {
      fetchDatasets()
    }
  }, [session])

  const fetchDatasets = async () => {
    setLoadingDatasets(true)
    try {
      const response = await fetch('/api/datasets', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      if (!response.ok) {
        throw new Error('Impossible de charger vos datasets.')
      }
      const data = await response.json()
      setDatasets(data.datasets || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoadingDatasets(false)
    }
  }

  const selectedDataset = useMemo(
    () => datasets.find((d) => String(d.id) === String(selectedDatasetId)),
    [datasets, selectedDatasetId]
  )

  const columnNames = useMemo(() => extractColumnNames(selectedDataset), [selectedDataset])

  useEffect(() => {
    // Reset prediction column when dataset changes
    setPredictionColumn('')
    setResult(null)
  }, [selectedDatasetId])

  const handleRun = async () => {
    if (!selectedDataset) {
      toast.error('Selectionnez d\'abord un dataset.')
      return
    }
    if (!predictionColumn) {
      toast.error('Choisissez la colonne qui contient les predictions du modele.')
      return
    }

    const backendDatasetId = selectedDataset.fastapi_dataset_id || selectedDataset.id
    if (!backendDatasetId) {
      toast.error('Ce dataset n\'a pas d\'identifiant exploitable cote moteur d\'analyse.')
      return
    }

    // Coerce favorable value to number when possible
    let coercedFavorable = favorableValue
    if (favorableValue !== '' && !isNaN(Number(favorableValue))) {
      coercedFavorable = Number(favorableValue)
    }

    setRunning(true)
    setResult(null)
    try {
      const response = await fetch('/api/unsupervised', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          dataset_id: backendDatasetId,
          prediction_column: predictionColumn,
          favorable_value: coercedFavorable,
          feature_columns: null,
          n_clusters: nClusters,
          disparity_threshold: disparityThreshold,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'La detection a echoue.')
      }
      setResult(data)
      toast.success('Detection terminee.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setRunning(false)
    }
  }

  const overall = result ? riskStyle(result.overall_risk) : null

  return (
    <DashboardShell>
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

        <PageHeader
          icon={Search}
          title="Detection"
          titleHighlight="Non Supervisee"
          description="Identifiez des sous-groupes traites differemment par votre modele, meme sans colonne demographique. Aucune expertise data science requise."
          actions={
            <Card className="hidden lg:flex px-4 py-2.5 items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Aucun attribut sensible collecte</span>
            </Card>
          }
        />

        {/* Explication pedagogique */}
        <Card className="p-5 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-display font-semibold text-foreground">Comment ca fonctionne ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous regroupons automatiquement vos donnees en clusters similaires, puis comparons
                le taux de decision positive de chaque cluster. Si un groupe recoit nettement plus
                (ou moins) de decisions favorables, c'est un signal possible de biais que vous devrez
                examiner, en conformite avec l'article 10 de l'AI Act.
              </p>
            </div>
          </div>
        </Card>

        {/* Formulaire */}
        <Card className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground">Parametres de la detection</h2>
              <p className="text-sm text-muted-foreground">Quatre reglages suffisent. Nous nous occupons du reste.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dataset */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Database className="h-3 w-3" /> Dataset a analyser
              </Label>
              <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId} disabled={loadingDatasets}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={loadingDatasets ? 'Chargement...' : 'Choisissez un dataset'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {datasets.length === 0 && !loadingDatasets ? (
                    <SelectItem value="none" disabled>
                      Aucun dataset disponible
                    </SelectItem>
                  ) : (
                    datasets.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.original_filename || d.filename}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedDataset && (
                <p className="text-xs text-muted-foreground">
                  {selectedDataset.row_count || 0} lignes - {selectedDataset.column_count || columnNames.length} colonnes
                </p>
              )}
            </div>

            {/* Prediction column */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Target className="h-3 w-3" /> Colonne de prediction
              </Label>
              <Select
                value={predictionColumn}
                onValueChange={setPredictionColumn}
                disabled={!selectedDataset || columnNames.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ex: prediction, decision, score..." />
                </SelectTrigger>
                <SelectContent>
                  {columnNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                La colonne qui contient la decision finale du modele (accepte/refuse, embauche, etc.).
              </p>
            </div>

            {/* Favorable value */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" /> Valeur favorable
              </Label>
              <Input
                value={favorableValue}
                onChange={(e) => setFavorableValue(e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                La valeur qui represente une decision positive (souvent 1, "oui" ou "accepte").
              </p>
            </div>

            {/* Clusters slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-3 w-3" /> Nombre de groupes
                </Label>
                <Badge variant="secondary">{nClusters}</Badge>
              </div>
              <Slider
                value={[nClusters]}
                onValueChange={(v) => setNClusters(v[0])}
                min={2}
                max={12}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                Plus il y a de groupes, plus l'analyse est fine. 5 groupes conviennent dans la plupart des cas.
              </p>
            </div>

            {/* Threshold slider */}
            <div className="space-y-3 lg:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Scale className="h-3 w-3" /> Seuil d'alerte (ecart entre groupes)
                </Label>
                <Badge variant="secondary">{(disparityThreshold * 100).toFixed(0)} %</Badge>
              </div>
              <Slider
                value={[disparityThreshold]}
                onValueChange={(v) => setDisparityThreshold(Number(v[0].toFixed(2)))}
                min={0.05}
                max={0.5}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">
                A partir de cet ecart de taux de decisions positives entre deux groupes, nous declenchons une alerte.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              onClick={handleRun}
              disabled={running || !selectedDataset || !predictionColumn}
              className="min-w-[200px]"
            >
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyse en cours...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Lancer la detection
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Resultats */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Risque global */}
            <Card className={cn('p-6 border', overall?.badge?.includes('red') ? 'border-red-500/30' : overall?.badge?.includes('orange') ? 'border-orange-500/30' : 'border-green-500/30')}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center ring-4', overall?.ring)}>
                    <div className={cn('w-8 h-8 rounded-full', overall?.dot)} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risque global</p>
                    <h2 className={cn('text-2xl font-display font-bold', overall?.text)}>{overall?.label}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Base sur l'analyse de {result.n_samples} observations reparties en {result.n_clusters} groupes.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center min-w-[90px]">
                    <p className="text-[10px] text-muted-foreground uppercase">Taux positif global</p>
                    <p className="text-lg font-display font-bold text-foreground">
                      {(result.global_positive_rate * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center min-w-[90px]">
                    <p className="text-[10px] text-muted-foreground uppercase">Khi-deux</p>
                    <p className="text-lg font-display font-bold text-foreground">{result.chi2_statistic}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center min-w-[90px]">
                    <p className="text-[10px] text-muted-foreground uppercase">p-value</p>
                    <p className={cn('text-lg font-display font-bold', result.is_statistically_significant ? 'text-red-500' : 'text-foreground')}>
                      {result.chi2_p_value}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Resume NL */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-display font-semibold text-foreground">En clair</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.natural_language_summary}</p>
                  {result.is_statistically_significant && (
                    <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Ecart statistiquement significatif
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Pertinence AI Act */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-display font-semibold text-foreground">Pertinence AI Act</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.ai_act_relevance}</p>
                </div>
              </div>
            </Card>

            {/* Clusters */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-display font-semibold text-foreground">Groupes identifies</h2>
                <Badge variant="secondary">{result.findings?.length || 0}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(result.findings || []).map((finding) => {
                  const style = riskStyle(finding.risk_level)
                  const deviationPct = (finding.deviation_from_global * 100).toFixed(1)
                  const deviationLabel = finding.deviation_from_global >= 0 ? `+${deviationPct}` : deviationPct

                  return (
                    <Card key={finding.cluster_id} className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center ring-2', style.ring)}>
                            <span className="text-sm font-display font-bold text-foreground">#{finding.cluster_id}</span>
                          </div>
                          <div>
                            <p className="text-sm font-display font-semibold text-foreground">
                              Groupe {finding.cluster_id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {finding.size} individus
                            </p>
                          </div>
                        </div>
                        <Badge className={cn('border', style.badge)}>{style.label}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <p className="text-[10px] text-muted-foreground uppercase">Taux positif</p>
                          <p className="text-base font-display font-bold text-foreground">
                            {(finding.positive_rate * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border">
                          <p className="text-[10px] text-muted-foreground uppercase">Ecart vs global</p>
                          <p className={cn('text-base font-display font-bold', style.text)}>
                            {deviationLabel} pts
                          </p>
                        </div>
                      </div>

                      {finding.dominant_features && Object.keys(finding.dominant_features).length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Caracteristiques dominantes</p>
                          <div className="space-y-1.5">
                            {Object.entries(finding.dominant_features).map(([col, info]) => (
                              <div key={col} className="flex items-start justify-between gap-3 p-2 rounded-md bg-muted/30 border border-border">
                                <span className="text-xs font-medium text-foreground">{col}</span>
                                <span className="text-xs text-muted-foreground text-right">
                                  {info.type === 'numeric'
                                    ? `moyenne ${info.cluster_mean} (vs ${info.rest_mean})`
                                    : `${info.dominant_value} a ${(info.cluster_frequency * 100).toFixed(0)}%`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-foreground/80 leading-relaxed">{finding.interpretation}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
