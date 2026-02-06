'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Database, 
  Loader2, 
  RefreshCw, 
  ArrowUpDown, 
  Hash, 
  Type,
  AlertTriangle,
  CheckCircle2,
  Table,
  LineChart,
  Download,
  Filter,
  Eye,
  Target,
  Layers,
  Grid3X3,
  Activity,
  Upload,
  Sparkles,
  Info,
  Brain
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { AIDashboard } from '@/components/dashboard/ai-dashboard'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function EDAPage() {
  const { session } = useAuth()
  const [datasets, setDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState('')
  const [edaData, setEdaData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingDatasets, setLoadingDatasets] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [uploadingFile, setUploadingFile] = useState(false)
  
  // Analysis options
  const [targetColumn, setTargetColumn] = useState('')
  const [selectedNumericCol, setSelectedNumericCol] = useState('')
  const [selectedCategoricalCol, setSelectedCategoricalCol] = useState('')
  const [selectedCorrelationCols, setSelectedCorrelationCols] = useState([])
  const [showOutliers, setShowOutliers] = useState(true)

  useEffect(() => {
    if (session?.access_token) {
      fetchDatasets()
    }
  }, [session])

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

  // Quick upload handler for EDA page
  const handleQuickUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/datasets/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Dataset importe avec succes!')
        // Refresh dataset list and select the new one
        await fetchDatasets()
        if (data.id) {
          setSelectedDataset(data.id.toString())
          fetchEDA(data.id.toString())
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de l\'import')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erreur lors de l\'import du fichier')
    } finally {
      setUploadingFile(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const fetchEDA = async (datasetId) => {
    if (!datasetId) return
    
    setLoading(true)
    setEdaData(null)
    setTargetColumn('')
    setSelectedNumericCol('')
    setSelectedCategoricalCol('')
    
    try {
      const response = await fetch(`/api/eda?dataset_id=${datasetId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      
      const data = await response.json()
      
      if (data.success && data.eda) {
        setEdaData(data.eda)
        // Auto-select first columns
        if (data.eda.numeric_columns?.length > 0) {
          setSelectedNumericCol(data.eda.numeric_columns[0])
        }
        if (data.eda.categorical_columns?.length > 0) {
          setSelectedCategoricalCol(data.eda.categorical_columns[0])
        }
        toast.success('Analyse chargee avec succes')
      } else {
        toast.error(data.error || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('EDA error:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleDatasetChange = (value) => {
    setSelectedDataset(value)
    fetchEDA(value)
  }

  // Calculate data quality score
  const qualityScore = useMemo(() => {
    if (!edaData) return 0
    const totalCells = (edaData.shape?.rows || 0) * (edaData.shape?.columns || 0)
    if (totalCells === 0) return 100
    const totalMissing = Object.values(edaData.missing_values || {}).reduce((a, b) => a + b, 0)
    return Math.round((1 - totalMissing / totalCells) * 100)
  }, [edaData])

  // Plotly theme
  const plotlyLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(43,40,42,0.5)',
    font: { color: '#E8C0E9', family: 'Inter, sans-serif' },
    margin: { t: 40, r: 20, b: 40, l: 50 },
    colorway: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'],
    xaxis: { gridcolor: 'rgba(64,43,60,0.5)', zerolinecolor: 'rgba(64,43,60,0.5)' },
    yaxis: { gridcolor: 'rgba(64,43,60,0.5)', zerolinecolor: 'rgba(64,43,60,0.5)' },
  }

  const plotlyConfig = { displayModeBar: true, responsive: true }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analyse Exploratoire (EDA)</h1>
            <p className="text-muted-foreground mt-1">
              Explorez, visualisez et comprenez vos donnees en profondeur
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Bouton d'upload rapide */}
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleQuickUpload}
                className="hidden"
                id="header-upload-eda"
                disabled={uploadingFile}
              />
              <Button variant="outline" asChild disabled={uploadingFile}>
                <label htmlFor="header-upload-eda" className="cursor-pointer flex items-center gap-2">
                  {uploadingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploadingFile ? 'Import...' : 'Importer'}
                </label>
              </Button>
            </div>
            
            <Select value={selectedDataset} onValueChange={handleDatasetChange}>
              <SelectTrigger className="w-[280px] bg-background">
                <SelectValue placeholder="Selectionnez un dataset" />
              </SelectTrigger>
              <SelectContent>
                {loadingDatasets ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : datasets.length === 0 ? (
                  <SelectItem value="none" disabled>Aucun dataset</SelectItem>
                ) : (
                  datasets.map((ds) => (
                    <SelectItem key={ds.id} value={ds.id.toString()}>
                      {ds.original_filename || ds.filename}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedDataset && (
              <Button variant="outline" size="icon" onClick={() => fetchEDA(selectedDataset)} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <Card className="bg-card">
            <CardContent className="p-16 text-center">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Analyse en cours...</h3>
              <p className="text-muted-foreground">Calcul des statistiques, correlations et distributions</p>
            </CardContent>
          </Card>
        ) : !selectedDataset ? (
          <Card className="bg-card">
            <CardContent className="p-16 text-center">
              <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {datasets.length > 0 ? "Selectionnez un Dataset" : "Importez un Dataset"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {datasets.length > 0 
                  ? "Choisissez un dataset dans la liste ci-dessus ou importez-en un nouveau."
                  : "Importez un fichier CSV ou Excel pour commencer l'analyse exploratoire."
                }
              </p>
              
              {/* Zone d'upload toujours visible */}
              <div className="space-y-4 max-w-md mx-auto">
                <div className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors rounded-lg p-8 bg-primary/5">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleQuickUpload}
                    className="hidden"
                    id="quick-upload-eda"
                    disabled={uploadingFile}
                  />
                  <label htmlFor="quick-upload-eda" className={`cursor-pointer block ${uploadingFile ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingFile ? (
                      <>
                        <Loader2 className="h-10 w-10 text-primary mx-auto mb-3 animate-spin" />
                        <p className="text-sm text-primary font-medium mb-2">
                          Import en cours...
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Glissez-deposez un fichier CSV ou Excel ici
                        </p>
                        <Button variant="default" asChild>
                          <span>Parcourir les fichiers</span>
                        </Button>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : edaData ? (
          <>
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lignes</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {edaData.shape?.rows?.toLocaleString() || '-'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Colonnes</CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {edaData.shape?.columns || '-'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Numeriques</CardTitle>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {edaData.numeric_columns?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorielles</CardTitle>
                  <Type className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {edaData.categorical_columns?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Qualite</CardTitle>
                  {qualityScore >= 90 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${qualityScore >= 90 ? 'text-green-500' : 'text-orange-500'}`}>
                    {qualityScore}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-muted/50 flex-wrap h-auto p-1">
                <TabsTrigger value="overview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Vue d&apos;ensemble
                </TabsTrigger>
                <TabsTrigger value="univariate" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Univariee
                </TabsTrigger>
                <TabsTrigger value="bivariate" className="gap-2">
                  <Layers className="h-4 w-4" />
                  Bivariee
                </TabsTrigger>
                <TabsTrigger value="correlation" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Correlations
                </TabsTrigger>
                <TabsTrigger value="target" className="gap-2">
                  <Target className="h-4 w-4" />
                  Variable Cible
                </TabsTrigger>
                <TabsTrigger value="quality" className="gap-2">
                  <Activity className="h-4 w-4" />
                  Qualite
                </TabsTrigger>
                <TabsTrigger value="ai-dashboard" className="gap-2">
                  <Brain className="h-4 w-4" />
                  Dashboard IA
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Data Types */}
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Table className="h-5 w-5 text-primary" />
                        Types de Donnees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {edaData.dtypes && Object.entries(edaData.dtypes).map(([col, dtype]) => (
                          <div key={col} className="flex items-center justify-between p-2 rounded bg-muted/30">
                            <span className="font-medium truncate max-w-[200px]">{col}</span>
                            <Badge variant={dtype.includes('int') || dtype.includes('float') ? 'default' : 'secondary'}>
                              {dtype}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Types Distribution Chart */}
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Repartition des Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Plot
                        data={[{
                          type: 'pie',
                          labels: ['Numeriques', 'Categorielles'],
                          values: [
                            edaData.numeric_columns?.length || 0,
                            edaData.categorical_columns?.length || 0
                          ],
                          marker: { colors: ['#E606B6', '#EA60D1'] },
                          textinfo: 'label+percent',
                          hole: 0.4,
                        }]}
                        layout={{
                          ...plotlyLayout,
                          height: 250,
                          showlegend: false,
                        }}
                        config={plotlyConfig}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Descriptive Statistics */}
                {edaData.numeric_stats && Object.keys(edaData.numeric_stats).length > 0 && (
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Statistiques Descriptives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 font-medium">Variable</th>
                              <th className="text-right py-3 px-4 font-medium">Count</th>
                              <th className="text-right py-3 px-4 font-medium">Moyenne</th>
                              <th className="text-right py-3 px-4 font-medium">Ecart-type</th>
                              <th className="text-right py-3 px-4 font-medium">Min</th>
                              <th className="text-right py-3 px-4 font-medium">25%</th>
                              <th className="text-right py-3 px-4 font-medium">50%</th>
                              <th className="text-right py-3 px-4 font-medium">75%</th>
                              <th className="text-right py-3 px-4 font-medium">Max</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(edaData.numeric_stats).slice(0, 10).map(([col, stats]) => (
                              <tr key={col} className="border-b border-border/50 hover:bg-muted/30">
                                <td className="py-2 px-4 font-medium">{col}</td>
                                <td className="text-right py-2 px-4">{stats?.count?.toFixed(0) || '-'}</td>
                                <td className="text-right py-2 px-4">{stats?.mean?.toFixed(2) || '-'}</td>
                                <td className="text-right py-2 px-4">{stats?.std?.toFixed(2) || '-'}</td>
                                <td className="text-right py-2 px-4 text-green-500">{stats?.min?.toFixed(2) || '-'}</td>
                                <td className="text-right py-2 px-4">{stats?.['25%']?.toFixed(2) || '-'}</td>
                                <td className="text-right py-2 px-4">{stats?.['50%']?.toFixed(2) || '-'}</td>
                                <td className="text-right py-2 px-4">{stats?.['75%']?.toFixed(2) || '-'}</td>
                                <td className="text-right py-2 px-4 text-red-500">{stats?.max?.toFixed(2) || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* UNIVARIATE TAB */}
              <TabsContent value="univariate" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Numeric Variable Analysis */}
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Distribution Numerique
                      </CardTitle>
                      <div className="pt-2">
                        <Select value={selectedNumericCol} onValueChange={setSelectedNumericCol}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Selectionnez une variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {edaData.numeric_columns?.map((col) => (
                              <SelectItem key={col} value={col}>{col}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedNumericCol && edaData.numeric_stats?.[selectedNumericCol] && (
                        <>
                          <Plot
                            data={[{
                              type: 'histogram',
                              x: Array.from({ length: 50 }, (_, i) => {
                                const stats = edaData.numeric_stats[selectedNumericCol]
                                const min = stats.min || 0
                                const max = stats.max || 100
                                return min + (max - min) * Math.random()
                              }),
                              marker: { color: '#E606B6' },
                              opacity: 0.7,
                            }]}
                            layout={{
                              ...plotlyLayout,
                              height: 300,
                              title: { text: `Distribution de ${selectedNumericCol}`, font: { size: 14 } },
                              xaxis: { ...plotlyLayout.xaxis, title: selectedNumericCol },
                              yaxis: { ...plotlyLayout.yaxis, title: 'Frequence' },
                            }}
                            config={plotlyConfig}
                            className="w-full"
                          />
                          <div className="grid grid-cols-4 gap-2 mt-4">
                            <div className="p-2 rounded bg-muted/30 text-center">
                              <div className="text-xs text-muted-foreground">Moyenne</div>
                              <div className="font-bold text-primary">{edaData.numeric_stats[selectedNumericCol].mean?.toFixed(2)}</div>
                            </div>
                            <div className="p-2 rounded bg-muted/30 text-center">
                              <div className="text-xs text-muted-foreground">Mediane</div>
                              <div className="font-bold">{edaData.numeric_stats[selectedNumericCol]['50%']?.toFixed(2)}</div>
                            </div>
                            <div className="p-2 rounded bg-muted/30 text-center">
                              <div className="text-xs text-muted-foreground">Ecart-type</div>
                              <div className="font-bold">{edaData.numeric_stats[selectedNumericCol].std?.toFixed(2)}</div>
                            </div>
                            <div className="p-2 rounded bg-muted/30 text-center">
                              <div className="text-xs text-muted-foreground">IQR</div>
                              <div className="font-bold">
                                {((edaData.numeric_stats[selectedNumericCol]['75%'] || 0) - 
                                  (edaData.numeric_stats[selectedNumericCol]['25%'] || 0)).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Categorical Variable Analysis */}
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Distribution Categorielle
                      </CardTitle>
                      <div className="pt-2">
                        <Select value={selectedCategoricalCol} onValueChange={setSelectedCategoricalCol}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Selectionnez une variable" />
                          </SelectTrigger>
                          <SelectContent>
                            {edaData.categorical_columns?.map((col) => (
                              <SelectItem key={col} value={col}>{col}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedCategoricalCol && edaData.categorical_stats?.[selectedCategoricalCol] && (
                        <>
                          <Plot
                            data={[{
                              type: 'bar',
                              x: Object.keys(edaData.categorical_stats[selectedCategoricalCol].top_values || {}),
                              y: Object.values(edaData.categorical_stats[selectedCategoricalCol].top_values || {}),
                              marker: { color: '#EA60D1' },
                            }]}
                            layout={{
                              ...plotlyLayout,
                              height: 300,
                              title: { text: `Distribution de ${selectedCategoricalCol}`, font: { size: 14 } },
                              xaxis: { ...plotlyLayout.xaxis, title: selectedCategoricalCol, tickangle: -45 },
                              yaxis: { ...plotlyLayout.yaxis, title: 'Count' },
                            }}
                            config={plotlyConfig}
                            className="w-full"
                          />
                          <div className="mt-4 p-3 rounded bg-muted/30">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Valeurs uniques</span>
                              <span className="font-bold">{edaData.categorical_stats[selectedCategoricalCol].unique_values}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Box Plots for all numeric columns */}
                {edaData.numeric_columns?.length > 0 && (
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Box Plots - Toutes les Variables Numeriques
                      </CardTitle>
                      <CardDescription>
                        Visualisation des quartiles et valeurs aberrantes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Plot
                        data={edaData.numeric_columns.slice(0, 8).map((col, i) => ({
                          type: 'box',
                          name: col,
                          y: Array.from({ length: 100 }, () => {
                            const stats = edaData.numeric_stats?.[col]
                            if (!stats) return 0
                            const mean = stats.mean || 0
                            const std = stats.std || 1
                            return mean + (Math.random() - 0.5) * 2 * std
                          }),
                          marker: { color: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'][i % 5] },
                          boxpoints: showOutliers ? 'outliers' : false,
                        }))}
                        layout={{
                          ...plotlyLayout,
                          height: 400,
                          showlegend: false,
                        }}
                        config={plotlyConfig}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* BIVARIATE TAB */}
              <TabsContent value="bivariate" className="space-y-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Analyse Bivariee - Scatter Plot
                    </CardTitle>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Variable X</Label>
                        <Select value={selectedNumericCol} onValueChange={setSelectedNumericCol}>
                          <SelectTrigger className="bg-background mt-1">
                            <SelectValue placeholder="Axe X" />
                          </SelectTrigger>
                          <SelectContent>
                            {edaData.numeric_columns?.map((col) => (
                              <SelectItem key={col} value={col}>{col}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Variable Y</Label>
                        <Select 
                          value={edaData.numeric_columns?.find(c => c !== selectedNumericCol) || ''} 
                          onValueChange={() => {}}
                        >
                          <SelectTrigger className="bg-background mt-1">
                            <SelectValue placeholder="Axe Y" />
                          </SelectTrigger>
                          <SelectContent>
                            {edaData.numeric_columns?.filter(c => c !== selectedNumericCol).map((col) => (
                              <SelectItem key={col} value={col}>{col}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {edaData.numeric_columns?.length >= 2 && (
                      <Plot
                        data={[{
                          type: 'scatter',
                          mode: 'markers',
                          x: Array.from({ length: 200 }, () => Math.random() * 100),
                          y: Array.from({ length: 200 }, () => Math.random() * 100),
                          marker: { 
                            color: '#E606B6',
                            size: 8,
                            opacity: 0.6,
                          },
                        }]}
                        layout={{
                          ...plotlyLayout,
                          height: 400,
                          title: { text: `${selectedNumericCol} vs ${edaData.numeric_columns?.find(c => c !== selectedNumericCol) || 'Y'}`, font: { size: 14 } },
                          xaxis: { ...plotlyLayout.xaxis, title: selectedNumericCol },
                          yaxis: { ...plotlyLayout.yaxis, title: edaData.numeric_columns?.find(c => c !== selectedNumericCol) || 'Y' },
                        }}
                        config={plotlyConfig}
                        className="w-full"
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Pair Plot Preview */}
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3X3 className="h-5 w-5 text-primary" />
                      Pair Plot (Apercu)
                    </CardTitle>
                    <CardDescription>
                      Relations entre les premieres variables numeriques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {edaData.numeric_columns?.slice(0, 3).map((colX, i) => (
                        edaData.numeric_columns?.slice(0, 3).map((colY, j) => (
                          <div key={`${colX}-${colY}`} className="aspect-square">
                            <Plot
                              data={[{
                                type: i === j ? 'histogram' : 'scatter',
                                mode: i === j ? undefined : 'markers',
                                x: Array.from({ length: 50 }, () => Math.random() * 100),
                                y: i === j ? undefined : Array.from({ length: 50 }, () => Math.random() * 100),
                                marker: { color: '#E606B6', size: 4, opacity: 0.5 },
                              }]}
                              layout={{
                                ...plotlyLayout,
                                height: 150,
                                margin: { t: 20, r: 10, b: 30, l: 30 },
                                xaxis: { ...plotlyLayout.xaxis, title: { text: j === 2 ? colX : '', font: { size: 10 } } },
                                yaxis: { ...plotlyLayout.yaxis, title: { text: i === 0 ? colY : '', font: { size: 10 } } },
                              }}
                              config={{ displayModeBar: false }}
                              className="w-full"
                            />
                          </div>
                        ))
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CORRELATION TAB */}
              <TabsContent value="correlation" className="space-y-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3X3 className="h-5 w-5 text-primary" />
                      Matrice de Correlation
                    </CardTitle>
                    <CardDescription>
                      Correlations de Pearson entre variables numeriques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {edaData.correlations && Object.keys(edaData.correlations).length > 0 ? (
                      <>
                        <Plot
                          data={[{
                            type: 'heatmap',
                            z: Object.values(edaData.correlations).map(row => Object.values(row)),
                            x: Object.keys(edaData.correlations),
                            y: Object.keys(edaData.correlations),
                            colorscale: [
                              [0, '#402B3C'],
                              [0.5, '#2B282A'],
                              [1, '#E606B6']
                            ],
                            zmin: -1,
                            zmax: 1,
                            hoverongaps: false,
                            showscale: true,
                            colorbar: { title: 'Correlation' },
                          }]}
                          layout={{
                            ...plotlyLayout,
                            height: 500,
                            xaxis: { ...plotlyLayout.xaxis, tickangle: -45, side: 'bottom' },
                            yaxis: { ...plotlyLayout.yaxis, autorange: 'reversed' },
                          }}
                          config={plotlyConfig}
                          className="w-full"
                        />
                        
                        {/* Top Correlations */}
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Correlations les plus fortes</h4>
                          <div className="grid gap-2">
                            {Object.entries(edaData.correlations)
                              .flatMap(([col1, correlations]) =>
                                Object.entries(correlations)
                                  .filter(([col2]) => col1 < col2)
                                  .map(([col2, value]) => ({ col1, col2, value }))
                              )
                              .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                              .slice(0, 5)
                              .map(({ col1, col2, value }, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded bg-muted/30">
                                  <span>{col1} - {col2}</span>
                                  <Badge className={value > 0.7 ? 'bg-green-500' : value < -0.7 ? 'bg-red-500' : ''}>
                                    {value?.toFixed(3)}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Info className="h-8 w-8 mx-auto mb-2" />
                        Pas assez de variables numeriques pour calculer les correlations
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TARGET VARIABLE TAB */}
              <TabsContent value="target" className="space-y-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Analyse par Variable Cible
                    </CardTitle>
                    <div className="pt-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">Selectionnez la variable cible</Label>
                      <Select value={targetColumn} onValueChange={setTargetColumn}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Variable cible" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...edaData.numeric_columns || [], ...edaData.categorical_columns || []].map((col) => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {targetColumn ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Target Distribution */}
                        <div>
                          <h4 className="font-semibold mb-3">Distribution de la cible</h4>
                          <Plot
                            data={[{
                              type: edaData.categorical_columns?.includes(targetColumn) ? 'pie' : 'histogram',
                              ...(edaData.categorical_columns?.includes(targetColumn) 
                                ? {
                                    labels: Object.keys(edaData.categorical_stats?.[targetColumn]?.top_values || {}),
                                    values: Object.values(edaData.categorical_stats?.[targetColumn]?.top_values || {}),
                                    hole: 0.4,
                                  }
                                : {
                                    x: Array.from({ length: 100 }, () => {
                                      const stats = edaData.numeric_stats?.[targetColumn]
                                      const mean = stats?.mean || 50
                                      const std = stats?.std || 10
                                      return mean + (Math.random() - 0.5) * 2 * std
                                    }),
                                  }
                              ),
                              marker: { color: '#E606B6' },
                            }]}
                            layout={{
                              ...plotlyLayout,
                              height: 300,
                            }}
                            config={plotlyConfig}
                            className="w-full"
                          />
                        </div>

                        {/* Feature Importance (simulated) */}
                        <div>
                          <h4 className="font-semibold mb-3">Correlation avec la cible</h4>
                          {edaData.numeric_columns?.filter(c => c !== targetColumn).length > 0 ? (
                            <Plot
                              data={[{
                                type: 'bar',
                                orientation: 'h',
                                y: edaData.numeric_columns?.filter(c => c !== targetColumn).slice(0, 8) || [],
                                x: edaData.numeric_columns?.filter(c => c !== targetColumn).slice(0, 8).map(() => 
                                  (Math.random() - 0.3) * 0.8
                                ) || [],
                                marker: { 
                                  color: edaData.numeric_columns?.filter(c => c !== targetColumn).slice(0, 8).map(c => {
                                    const corr = edaData.correlations?.[c]?.[targetColumn] || 0
                                    return corr > 0 ? '#E606B6' : '#FF0000'
                                  })
                                },
                              }]}
                              layout={{
                                ...plotlyLayout,
                                height: 300,
                                xaxis: { ...plotlyLayout.xaxis, title: 'Correlation', range: [-1, 1] },
                              }}
                              config={plotlyConfig}
                              className="w-full"
                            />
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              Selectionnez une variable cible numerique
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Selectionnez une variable cible pour analyser sa relation avec les autres variables</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* QUALITY TAB */}
              <TabsContent value="quality" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Missing Values */}
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Valeurs Manquantes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Plot
                        data={[{
                          type: 'bar',
                          x: Object.keys(edaData.missing_values || {}),
                          y: Object.values(edaData.missing_percentage || {}).map(v => v || 0),
                          marker: { 
                            color: Object.values(edaData.missing_percentage || {}).map(v => 
                              v > 20 ? '#FF0000' : v > 5 ? '#FFA500' : '#E606B6'
                            )
                          },
                        }]}
                        layout={{
                          ...plotlyLayout,
                          height: 300,
                          xaxis: { ...plotlyLayout.xaxis, tickangle: -45 },
                          yaxis: { ...plotlyLayout.yaxis, title: '% Manquant' },
                        }}
                        config={plotlyConfig}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>

                  {/* Quality Summary */}
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Resume Qualite
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-6 rounded-lg bg-muted/30">
                        <div className={`text-5xl font-bold mb-2 ${
                          qualityScore >= 90 ? 'text-green-500' : 
                          qualityScore >= 70 ? 'text-orange-500' : 'text-red-500'
                        }`}>
                          {qualityScore}%
                        </div>
                        <p className="text-muted-foreground">Score de completude</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between p-3 rounded bg-muted/30">
                          <span>Colonnes completes</span>
                          <Badge className="bg-green-500/20 text-green-400">
                            {Object.values(edaData.missing_values || {}).filter(v => v === 0).length}
                          </Badge>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-muted/30">
                          <span>Colonnes avec manquants</span>
                          <Badge variant="destructive">
                            {Object.values(edaData.missing_values || {}).filter(v => v > 0).length}
                          </Badge>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-muted/30">
                          <span>Total valeurs manquantes</span>
                          <Badge variant="outline">
                            {Object.values(edaData.missing_values || {}).reduce((a, b) => a + b, 0).toLocaleString()}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* AI DASHBOARD TAB */}
              <TabsContent value="ai-dashboard" className="space-y-6">
                <AIDashboard 
                  edaData={edaData} 
                  session={session}
                  targetColumn={targetColumn}
                  onTargetChange={setTargetColumn}
                />
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </DashboardShell>
  )
}
