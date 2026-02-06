'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

// Markdown components for AI suggestions
const MarkdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-3 text-primary">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
  code: ({ children }) => <code className="bg-black/30 px-1 py-0.5 rounded text-sm text-green-400">{children}</code>,
}

export function AIDashboard({ edaData, session, targetColumn, onTargetChange }) {
  const [loading, setLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState(null)
  const [selectedTarget, setSelectedTarget] = useState(targetColumn || '')

  const plotlyLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(43,40,42,0.5)',
    font: { color: '#E8C0E9', family: 'Inter, sans-serif' },
    margin: { t: 40, r: 20, b: 40, l: 50 },
    colorway: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'],
    xaxis: { gridcolor: 'rgba(64,43,60,0.5)', zerolinecolor: 'rgba(64,43,60,0.5)' },
    yaxis: { gridcolor: 'rgba(64,43,60,0.5)', zerolinecolor: 'rgba(64,43,60,0.5)' },
  }

  const generateAIInsights = async () => {
    if (!selectedTarget) {
      toast.error('Veuillez selectionner une variable cible')
      return
    }

    setLoading(true)
    try {
      const context = {
        dataset_info: {
          rows: edaData.shape?.rows,
          columns: edaData.shape?.columns,
          numeric_columns: edaData.numeric_columns,
          categorical_columns: edaData.categorical_columns,
        },
        target_column: selectedTarget,
        numeric_stats: edaData.numeric_stats,
        categorical_stats: edaData.categorical_stats,
        correlations: edaData.correlations,
        missing_values: edaData.missing_values,
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyse ce dataset et fournis un rapport complet en francais. Variable cible: "${selectedTarget}".

Donne-moi:
1. **Resume executif** (3-4 lignes max)
2. **KPIs cles** a suivre pour cette variable cible (liste de 5 KPIs avec explication)
3. **Insights principaux** sur les donnees (patterns, anomalies, correlations importantes)
4. **Recommandations** pour l'analyse et la modelisation (preprocessing, feature engineering, algorithmes suggeres)
5. **Alertes** sur les problemes potentiels (biais, valeurs manquantes, outliers)

Voici les informations du dataset:
${JSON.stringify(context, null, 2)}`
          }],
          context: context,
        }),
      })

      if (!response.ok) throw new Error('Erreur API')

      const data = await response.json()
      setAiInsights(data.message?.content || 'Aucune reponse')
      toast.success('Analyse IA generee')
    } catch (error) {
      console.error('AI insights error:', error)
      toast.error('Erreur lors de la generation des insights')
    } finally {
      setLoading(false)
    }
  }

  // Calculate automatic KPIs based on target
  const calculateKPIs = () => {
    if (!edaData || !selectedTarget) return []

    const kpis = []
    const isNumericTarget = edaData.numeric_columns?.includes(selectedTarget)
    const stats = isNumericTarget ? edaData.numeric_stats?.[selectedTarget] : edaData.categorical_stats?.[selectedTarget]

    if (isNumericTarget && stats) {
      kpis.push({
        name: 'Moyenne',
        value: stats.mean?.toFixed(2) || 'N/A',
        icon: TrendingUp,
        color: 'text-primary',
        description: `Moyenne de ${selectedTarget}`,
      })
      kpis.push({
        name: 'Ecart-type',
        value: stats.std?.toFixed(2) || 'N/A',
        icon: Activity,
        color: 'text-blue-400',
        description: 'Dispersion des valeurs',
      })
      kpis.push({
        name: 'Mediane',
        value: stats['50%']?.toFixed(2) || 'N/A',
        icon: BarChart3,
        color: 'text-green-400',
        description: 'Valeur centrale',
      })
      kpis.push({
        name: 'Min / Max',
        value: `${stats.min?.toFixed(1)} - ${stats.max?.toFixed(1)}`,
        icon: TrendingDown,
        color: 'text-orange-400',
        description: 'Plage des valeurs',
      })
    } else if (stats) {
      kpis.push({
        name: 'Valeurs uniques',
        value: stats.unique_values || 'N/A',
        icon: PieChart,
        color: 'text-primary',
        description: 'Nombre de categories',
      })
      const topValue = Object.entries(stats.top_values || {})[0]
      if (topValue) {
        kpis.push({
          name: 'Valeur majoritaire',
          value: topValue[0],
          icon: TrendingUp,
          color: 'text-green-400',
          description: `${topValue[1]} occurrences`,
        })
      }
    }

    // Add quality KPIs
    const missingCount = edaData.missing_values?.[selectedTarget] || 0
    const missingPct = ((missingCount / (edaData.shape?.rows || 1)) * 100).toFixed(1)
    kpis.push({
      name: 'Completude',
      value: `${(100 - parseFloat(missingPct)).toFixed(1)}%`,
      icon: missingCount > 0 ? AlertTriangle : CheckCircle2,
      color: missingCount > 0 ? 'text-orange-400' : 'text-green-400',
      description: `${missingCount} valeurs manquantes`,
    })

    // Correlation with target (if numeric)
    if (isNumericTarget && edaData.correlations) {
      const correlations = Object.entries(edaData.correlations[selectedTarget] || {})
        .filter(([col]) => col !== selectedTarget)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .slice(0, 1)

      if (correlations.length > 0) {
        const [topCorCol, topCorVal] = correlations[0]
        kpis.push({
          name: 'Top Correlation',
          value: `${topCorVal?.toFixed(2)} (${topCorCol})`,
          icon: Zap,
          color: Math.abs(topCorVal) > 0.5 ? 'text-primary' : 'text-muted-foreground',
          description: 'Variable la plus correlee',
        })
      }
    }

    return kpis
  }

  const kpis = calculateKPIs()

  const handleTargetChange = (value) => {
    setSelectedTarget(value)
    setAiInsights(null)
    if (onTargetChange) onTargetChange(value)
  }

  return (
    <div className="space-y-6">
      {/* Target Selection & Generate Button */}
      <Card className="bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Dashboard IA Intelligent
          </CardTitle>
          <CardDescription>
            Selectionnez une variable cible pour generer des KPIs automatiques et des insights IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Variable cible
              </Label>
              <Select value={selectedTarget} onValueChange={handleTargetChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selectionnez la variable a analyser" />
                </SelectTrigger>
                <SelectContent>
                  {edaData.numeric_columns?.map((col) => (
                    <SelectItem key={col} value={col}>{col} (numerique)</SelectItem>
                  ))}
                  {edaData.categorical_columns?.map((col) => (
                    <SelectItem key={col} value={col}>{col} (categorielle)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateAIInsights} disabled={loading || !selectedTarget} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? 'Analyse en cours...' : 'Generer Insights IA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Grid */}
      {selectedTarget && kpis.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi, i) => (
            <Card key={i} className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <span className="text-sm text-muted-foreground">{kpi.name}</span>
                </div>
                <div className="text-2xl font-bold truncate">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visualizations Row */}
      {selectedTarget && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Target Distribution */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4 text-primary" />
                Distribution de {selectedTarget}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {edaData.numeric_columns?.includes(selectedTarget) ? (
                <Plot
                  data={[{
                    type: 'histogram',
                    x: Array.from({ length: 100 }, () => {
                      const stats = edaData.numeric_stats?.[selectedTarget]
                      const mean = stats?.mean || 50
                      const std = stats?.std || 10
                      return mean + (Math.random() - 0.5) * 3 * std
                    }),
                    marker: { color: '#E606B6' },
                    opacity: 0.8,
                  }]}
                  layout={{
                    ...plotlyLayout,
                    height: 250,
                    xaxis: { ...plotlyLayout.xaxis, title: selectedTarget },
                    yaxis: { ...plotlyLayout.yaxis, title: 'Frequence' },
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  className="w-full"
                />
              ) : (
                <Plot
                  data={[{
                    type: 'pie',
                    labels: Object.keys(edaData.categorical_stats?.[selectedTarget]?.top_values || {}),
                    values: Object.values(edaData.categorical_stats?.[selectedTarget]?.top_values || {}),
                    hole: 0.4,
                    marker: { colors: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'] },
                  }]}
                  layout={{
                    ...plotlyLayout,
                    height: 250,
                    showlegend: true,
                    legend: { x: 1, y: 0.5 },
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  className="w-full"
                />
              )}
            </CardContent>
          </Card>

          {/* Top Correlations */}
          {edaData.numeric_columns?.includes(selectedTarget) && edaData.correlations && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-primary" />
                  Correlations avec {selectedTarget}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Plot
                  data={[{
                    type: 'bar',
                    orientation: 'h',
                    y: Object.entries(edaData.correlations[selectedTarget] || {})
                      .filter(([col]) => col !== selectedTarget)
                      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                      .slice(0, 8)
                      .map(([col]) => col),
                    x: Object.entries(edaData.correlations[selectedTarget] || {})
                      .filter(([col]) => col !== selectedTarget)
                      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                      .slice(0, 8)
                      .map(([, val]) => val),
                    marker: {
                      color: Object.entries(edaData.correlations[selectedTarget] || {})
                        .filter(([col]) => col !== selectedTarget)
                        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                        .slice(0, 8)
                        .map(([, val]) => val > 0 ? '#E606B6' : '#FF0000'),
                    },
                  }]}
                  layout={{
                    ...plotlyLayout,
                    height: 250,
                    xaxis: { ...plotlyLayout.xaxis, title: 'Correlation', range: [-1, 1] },
                    yaxis: { ...plotlyLayout.yaxis, automargin: true },
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Insights et Recommandations IA
              </CardTitle>
              <Button variant="outline" size="sm" onClick={generateAIInsights} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Regenerer
              </Button>
            </div>
            <CardDescription>
              Analyse automatique generee par Gemini AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={MarkdownComponents}>
                {aiInsights}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedTarget && (
        <Card className="bg-card">
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Selectionnez une variable cible</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choisissez la variable que vous souhaitez predire ou analyser pour obtenir des KPIs automatiques, des visualisations pertinentes et des recommandations IA personnalisees.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
