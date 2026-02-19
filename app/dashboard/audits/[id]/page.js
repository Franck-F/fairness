'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { LLMAnalysis } from '@/components/audit/LLMAnalysis'
import { DataBiasAnalysis } from '@/components/audit/DataBiasAnalysis'
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Shield,
  FileText,
  BarChart3,
  Lightbulb,
  Users,
  Target,
  Activity,
  PieChart,
  Info,
  Zap,
  Bot,
  Sparkles,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

export default function AuditDetailPage({ params }) {
  const router = useRouter()
  const { id } = params
  const { session } = useAuth()
  const [audit, setAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [llmAnalyzing, setLlmAnalyzing] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (session) {
      loadAudit()
    }
  }, [id, session])

  const loadAudit = async () => {
    try {
      const response = await fetch(`/api/audits/${id}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) throw new Error('Session expirée ou non autorisée')
        throw new Error('Audit introuvable')
      }

      const data = await response.json()
      setAudit(data.audit)

      // Auto-trigger analysis if pending and no metrics
      if (data.audit.status === 'pending' && !data.audit.metrics_results) {
        runFairnessAnalysis(data.audit, false)
      }
    } catch (error) {
      console.error('Load audit error:', error)
      toast.error(error.message || 'Erreur lors du chargement de l\'audit')
      setAudit(null)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (format = 'pdf') => {
    if (!audit) return
    setDownloading(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          audit_id: audit.id,
          format: format,
        }),
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type')

        if (contentType?.includes('application/pdf')) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `rapport_${audit.audit_name.replace(/\s+/g, '_')}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          a.remove()
          toast.success('Rapport PDF téléchargé !')
        } else {
          const data = await response.json()
          if (data.content) {
            const blob = new Blob([data.content], { type: data.content_type || 'text/html' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = data.filename || `rapport_${audit.id}.html`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            a.remove()
            toast.success('Rapport téléchargé !')
          }
        }
      } else {
        throw new Error('Erreur lors de la génération du rapport')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setDownloading(false)
    }
  }

  // Polling mechanism
  const startPolling = async (auditId) => {
    const pollInterval = 5000 // 5 seconds
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    const poll = async () => {
      attempts++
      if (attempts > maxAttempts) {
        toast.error('Analyse trop longue. Veuillez rafraîchir plus tard.')
        setAnalyzing(false)
        setLlmAnalyzing(false)
        return
      }

      try {
        // Silent fetch to check status
        const response = await fetch(`/api/audits/${auditId}`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        })

        if (response.ok) {
          const data = await response.json()
          const currentAudit = data.audit

          if (currentAudit) {
            if (currentAudit.status === 'completed') {
              setAudit(currentAudit)
              toast.success('Analyse terminée avec succès !')
              setAnalyzing(false)
              setLlmAnalyzing(false)
              return // Stop polling
            } else if (currentAudit.status === 'failed') {
              setAudit(currentAudit)
              toast.error(`Échec de l'analyse: ${currentAudit.error_message || 'Erreur inconnue'}`)
              setAnalyzing(false)
              setLlmAnalyzing(false)
              return // Stop polling
            }
          }
        }

        // Continue polling if still processing or pending
        setTimeout(poll, pollInterval)

      } catch (error) {
        console.error('Polling error:', error)
        // Keep polling
        setTimeout(poll, pollInterval)
      }
    }

    poll()
  }

  // Run real fairness analysis via FastAPI (with optional LLM)
  const runFairnessAnalysis = async (auditData = audit, enableLLM = false) => {
    if (enableLLM) {
      setLlmAnalyzing(true)
    } else {
      setAnalyzing(true)
    }

    const endpoint = enableLLM ? '/api/fairness/calculate-enhanced' : '/api/fairness/calculate'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          audit_id: auditData.id,
          dataset_id: auditData.dataset_id,
          dataset_id_post: auditData.dataset_id_post,
          target_column: auditData.target_column,
          sensitive_attributes: auditData.sensitive_attributes || [],
          favorable_outcome: 1, // Default or from config
          model_type: auditData.model_type || 'classification',
          ia_type: auditData.ia_type || 'tabular',
          enable_llm: enableLLM
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.detail || 'Erreur lors de l\'analyse')
      }

      const result = await response.json()

      // Handle Async Processing
      if (result.status === 'processing' || (result.message && result.message.includes('background'))) {
        toast.info(result.message || "Analyse lancée en arrière-plan...")
        // Start polling
        startPolling(auditData.id)
        return
      }

      // Handle Synchronous Success (Fallback)
      setAudit(prev => ({
        ...prev,
        status: 'completed',
        overall_score: result.overall_score,
        risk_level: result.risk_level === 'faible' ? 'Low' : result.risk_level === 'moyen' ? 'Medium' : 'High',
        bias_detected: result.bias_detected,
        metrics_results: result.metrics_by_attribute,
        comparison_results: result.comparison_results || null,
        recommendations: result.recommendations || [],
        llm_insights: result.llm_insights || null
      }))

      toast.success(enableLLM ? 'Analyse IA terminée avec succès !' : 'Analyse terminée avec succès')
      setAnalyzing(false)
      setLlmAnalyzing(false)

    } catch (error) {
      console.error('Detailed Analysis Error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        endpoint: endpoint
      })

      const isNetworkError = error instanceof TypeError && error.message.includes('fetch')
      const errorMessage = isNetworkError
        ? "Erreur de connexion au serveur (Possible suspension réseau). Veuillez redémarrer les serveurs dev."
        : (error.message || 'Erreur lors de l\'analyse')

      toast.error(errorMessage)
      setAnalyzing(false)
      setLlmAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardShell>
    )
  }

  if (!audit) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <h2 className="text-xl font-semibold">Audit introuvable ou accès refusé</h2>
          <Button onClick={() => router.push('/dashboard/audits')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
      </DashboardShell>
    )
  }

  const metricsResults = audit.metrics_results || {}
  const criticalBiasCount = Object.values(metricsResults)
    .flat()
    .filter(m => m.status === 'fail')
    .length

  const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard/audits" className="hover:text-primary transition-colors">
                Audits
              </Link>
              <span>/</span>
              <span>{audit.audit_name}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{audit.audit_name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/dashboard/audits')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            {audit?.status === 'completed' && (
              <Button
                variant="outline"
                onClick={() => downloadReport('pdf')}
                disabled={downloading}
                className="border-brand-primary/20 hover:bg-brand-primary/5 text-brand-primary"
              >
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Rapport PDF
              </Button>
            )}
            <Button onClick={() => runFairnessAnalysis(audit, false)} disabled={analyzing || llmAnalyzing}>
              {analyzing ? (
                <>
                  <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Relancer l'analyse
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Global</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audit.overall_score || 0}/100</div>
              <Progress value={audit.overall_score || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niveau de Risque</CardTitle>
              <Shield className={cn(
                "h-4 w-4",
                audit.risk_level === 'Low' ? "text-green-500" :
                  audit.risk_level === 'Medium' ? "text-orange-500" : "text-red-500"
              )} />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                audit.risk_level === 'Low' ? "text-green-500" :
                  audit.risk_level === 'Medium' ? "text-orange-500" : "text-red-500"
              )}>
                {audit.risk_level || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Basé sur les biais détectés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Biais Critiques</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalBiasCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Métriques hors seuils tolérés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conformité AI Act</CardTitle>
              {audit.overall_score >= 80 ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {audit.overall_score >= 80 ? 'Conforme' : 'Non conforme'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimation préliminaire
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="metrics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Métriques
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="text-indigo-400 data-[state=active]:text-indigo-400">
              <Sparkles className="h-4 w-4 mr-2" />
              Insights IA
            </TabsTrigger>
            {audit.comparison_results && (
              <TabsTrigger value="comparison" className="text-brand-primary">
                <Zap className="h-4 w-4 mr-2" />
                Mitigation
              </TabsTrigger>
            )}
            <TabsTrigger value="analysis">
              <PieChart className="h-4 w-4 mr-2" />
              Bias Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => runFairnessAnalysis(audit, true)}
                disabled={analyzing || llmAnalyzing}
              >
                {llmAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Génération des insights...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Lancer l'analyse IA Avancée
                  </>
                )}
              </Button>
            </div>

            {Object.keys(metricsResults).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(metricsResults).map(([attr, metrics]) => (
                  <Card key={attr}>
                    <CardHeader>
                      <CardTitle className="capitalize flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Attribut Sensible: {attr}
                      </CardTitle>
                      <CardDescription>
                        Métriques de fairness calculées pour cet attribut
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.isArray(metrics) && metrics.map((metric, idx) => {
                          const isRatioMetric = metric.name.includes('Impact Disparate')
                          const targetDirection = isRatioMetric ? 'higher' : 'lower'

                          return (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-xs font-bold uppercase text-white/40">
                                  {metric.name}
                                </p>
                                <Badge
                                  className={cn(
                                    "text-xs font-black",
                                    metric.status === 'pass'
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-red-500/20 text-red-500"
                                  )}
                                >
                                  {metric.status === 'pass' ? '✓ PASS' : '✗ FAIL'}
                                </Badge>
                              </div>
                              <div className="text-3xl font-black text-white">
                                {(metric.value * 100).toFixed(1)}%
                              </div>
                              <p className="text-xs text-white/60">
                                {metric.description}
                              </p>
                              <div className="pt-2 border-t border-white/10 space-y-1">
                                <p className="text-xs text-white/40">
                                  Seuil: {isRatioMetric ? `≥ ${metric.threshold}` : `< ${metric.threshold}`}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-white/50">
                                  {targetDirection === 'lower' ? (
                                    <>
                                      <TrendingUp className="h-3 w-3 rotate-180 text-green-400" />
                                      <span>Plus proche de 0% = mieux</span>
                                    </>
                                  ) : (
                                    <>
                                      <TrendingUp className="h-3 w-3 text-green-400" />
                                      <span>Plus proche de 100% = mieux</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucune métrique disponible. Lancez une analyse pour générer les résultats.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4">
            {audit?.llm_insights ? (
              <LLMAnalysis insights={audit.llm_insights} />
            ) : (
              <Card className="border-dashed border-indigo-500/50 bg-indigo-500/5">
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <Bot className="h-12 w-12 text-indigo-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Analyse IA non disponible</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Lancez une "Analyse IA Avancée" pour obtenir des interprétations sémantiques, des recommandations contextuelles et un résumé exécutif généré par Gemini.
                  </p>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => runFairnessAnalysis(audit, true)}
                    disabled={analyzing || llmAnalyzing}
                  >
                    {llmAnalyzing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Lancer l'analyse IA
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {audit.comparison_results && (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-brand-primary/20 bg-brand-primary/5">
                    <CardHeader>
                      <CardTitle className="text-brand-primary flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Progression d'Équité
                      </CardTitle>
                      <CardDescription>Impact de la stratégie de mitigation</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="text-6xl font-black text-brand-primary mb-2">
                        {audit.comparison_results.improvement >= 0 ? '+' : ''}{audit.comparison_results.improvement}%
                      </div>
                      <p className="text-sm font-display font-bold uppercase tracking-widest text-white/40">Gain de conformité global</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Comparaison des Scores</CardTitle>
                      <CardDescription>Pre-processing vs Post-processing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[
                          { name: 'Global Score', pre: audit.overall_score - audit.comparison_results.improvement, post: audit.overall_score }
                        ]}>
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="pre" fill="#ec4899" name="Original (Pre)" />
                          <Bar dataKey="post" fill="#10b981" name="Mitigé (Post)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact sur les Attributs Sensibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {Object.entries(audit.comparison_results.pre).map(([attr, preMetrics]) => {
                        const postMetrics = audit.comparison_results.post[attr] || []
                        return (
                          <div key={attr} className="space-y-4">
                            <h4 className="text-lg font-bold capitalize border-l-4 border-brand-primary pl-4">{attr}</h4>
                            <div className="grid gap-4 md:grid-cols-3">
                              {preMetrics.map((m, idx) => {
                                const pm = postMetrics.find(p => p.name === m.name)
                                const diff = pm ? Math.round((pm.value - m.value) * 100) : 0
                                return (
                                  <div key={m.name} className="p-4 rounded-2xl bg-white/5 border border-white/10 group">
                                    <p className="text-[10px] font-black uppercase text-white/20 mb-2">{m.name.replace(/_/g, ' ')}</p>
                                    <div className="flex items-end justify-between">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-white/40 line-through">{(m.value * 100).toFixed(1)}%</span>
                                        <span className="text-xl font-black text-white">{(pm?.value * 100).toFixed(1)}%</span>
                                      </div>
                                      <Badge className={cn(
                                        "font-black",
                                        diff > 0 ? "bg-green-500/20 text-green-500" : diff < 0 ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white/40"
                                      )}>
                                        {diff > 0 ? '+' : ''}{diff}%
                                      </Badge>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <DataBiasAnalysis
              auditId={audit.id}
              datasetId={audit.dataset_id}
              sensitiveAttributes={audit.sensitive_attributes || []}
              targetColumn={audit.target_column}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
