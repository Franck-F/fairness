'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import {
  FileBarChart2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  TrendingUp,
  Shield,
  Sparkles,
  Zap,
  Activity,
  Cpu,
  Layers,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MoreVertical,
  BarChart3,
  Database,
  Loader2,
  ExternalLink,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const { user, session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [aiInsights, setAiInsights] = useState([])
  const [stats, setStats] = useState({
    totalAudits: 0,
    fairnessScore: 0,
    biasDetected: 0,
    totalDatasets: 0,
    recentAudits: [],
    evolutionData: [],
    radarMetrics: { maxDeviation: '0%', impactRatio: '0.00' },
    radarData: null
  })

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return

      try {
        const response = await fetch('/api/audits', {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch audits: ${response.status} ${errorText}`)
        }

        const { audits } = await response.json()

        if (audits && audits.length > 0) {
          const total = audits.length
          const completedAudits = audits.filter(a => a.status === 'completed')

          const avgScore = completedAudits.length > 0
            ? Math.round(completedAudits.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / completedAudits.length)
            : 0
          const biasedCount = audits.filter(a => a.bias_detected).length
          const uniqueDatasets = new Set(audits.map(a => a.dataset_id)).size

          const recent = audits.slice(0, 3).map(a => ({
            id: a.id,
            name: a.audit_name,
            time: new Date(a.created_at).toLocaleDateString(),
            size: a.datasets?.file_size ? `${(a.datasets.file_size / 1024 / 1024).toFixed(1)} MB` : 'N/A',
            status: a.status === 'completed' ? (a.bias_detected ? 'Critical Bias' : 'Audited') : a.status === 'failed' ? 'Failed' : 'Pending'
          }))

          const evolution = [...audits].reverse().slice(-20).map((a, i) => ({
            val: a.overall_score || 0,
            label: `C_${i + 1}`
          }))

          const latestCompleted = audits.find(a => a.status === 'completed')
          let radar = { maxDeviation: 'N/A', impactRatio: 'N/A' }
          let radarData = null

          if (latestCompleted && latestCompleted.metrics_results) {
            const allValues = Object.values(latestCompleted.metrics_results)
              .flatMap(m => Object.values(m))
              .filter(v => typeof v === 'number')

            if (allValues.length > 0) {
              const maxDev = Math.max(...allValues.map(v => Math.abs(1 - v)))
              const avgRatio = allValues.reduce((a, b) => a + b, 0) / allValues.length
              radar = {
                maxDeviation: `${(maxDev * 100).toFixed(1)}%`,
                impactRatio: avgRatio.toFixed(2)
              }

              const attributeNames = Object.keys(latestCompleted.metrics_results)
              if (attributeNames.length > 0) {
                const avgByAttr = attributeNames.map(attr => {
                  const metrics = Object.values(latestCompleted.metrics_results[attr])
                  return metrics.reduce((a, b) => a + b, 0) / metrics.length
                })
                radarData = { attributes: attributeNames, values: avgByAttr }
              }
            }
          }

          const auditStats = {
            byStatus: audits.reduce((acc, a) => {
              acc[a.status] = (acc[a.status] || 0) + 1
              return acc
            }, {}),
            byUseCase: audits.reduce((acc, a) => {
              const useCase = a.use_case || 'other'
              acc[useCase] = (acc[useCase] || 0) + 1
              return acc
            }, {}),
            byScoreRange: audits.reduce((acc, a) => {
              const score = a.overall_score || 0
              const range =
                score <= 20 ? '0-20%' :
                  score <= 40 ? '21-40%' :
                    score <= 60 ? '41-60%' :
                      score <= 80 ? '61-80%' : '81-100%'
              acc[range] = (acc[range] || 0) + 1
              return acc
            }, {}),
            biasDetectedCount: audits.filter(a => a.bias_detected).length,
            biasDetectedPercent: total > 0 ? Math.round((audits.filter(a => a.bias_detected).length / total) * 100) : 0
          }

          setStats({
            totalAudits: total,
            fairnessScore: avgScore,
            biasDetected: biasedCount,
            totalDatasets: uniqueDatasets,
            recentAudits: recent,
            evolutionData: evolution,
            radarMetrics: radar,
            radarData: radarData,
            latestAudit: latestCompleted,
            auditStats: auditStats
          })

          if (latestCompleted) {
            fetchAIInsights(latestCompleted.id)
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, session])

  const fetchAIInsights = async (auditId) => {
    setLoadingInsights(true)
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ audit_id: auditId })
      })

      if (response.ok) {
        const data = await response.json()
        setAiInsights(data.insights || [])
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const downloadReport = async (auditId, auditName) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ audit_id: auditId, format: 'pdf' })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rapport_${auditName.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
        toast.success('Rapport téléchargé !')
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement')
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">

        {/* Welcome Header */}
        <header className="pb-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-muted-foreground">Système opérationnel</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                Bonjour, <span className="text-primary">{user?.user_metadata?.full_name?.split(' ')[0] || 'Utilisateur'}</span>.
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {stats.totalAudits > 0
                  ? `AuditIQ a analysé ${stats.totalAudits} modèles pour vous.`
                  : "Commencez votre premier audit pour activer l'analyse."}
              </p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Audits"
            value={stats.totalAudits}
            icon={BarChart3}
            trend={stats.totalAudits > 0 ? 'up' : undefined}
            description="Analyses terminées"
          />
          <StatCard
            label="Score Moyen"
            value={`${stats.fairnessScore}%`}
            icon={Shield}
            description="Indice global"
          />
          <StatCard
            label="Biais Détectés"
            value={stats.biasDetected}
            icon={AlertTriangle}
            trend={stats.biasDetected > 0 ? 'down' : undefined}
            description="Priorité haute"
          />
          <StatCard
            label="Datasets"
            value={stats.totalDatasets}
            icon={Database}
            description="Sources de données"
          />
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Audits */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground">Derniers Audits</h2>
                <p className="text-sm text-muted-foreground">Historique récent de vos analyses.</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stats.recentAudits.length} analyses
              </Badge>
            </div>

            <div className="space-y-3">
              {stats.recentAudits.length > 0 ? (
                stats.recentAudits.slice(0, 6).map((audit, i) => {
                  const statusConfig = {
                    'Completed': { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20', label: 'Terminé' },
                    'Critical Bias': { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20', label: 'Biais Critique' },
                    'Failed': { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20', label: 'Échoué' },
                    'Running': { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', label: 'En cours' },
                    'Audited': { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20', label: 'Audité' },
                    'Pending': { bg: 'bg-gray-500/10', text: 'text-muted-foreground', border: 'border-border', label: 'En attente' },
                  }
                  const config = statusConfig[audit.status] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', label: audit.status }

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors cursor-pointer group/audit"
                      onClick={() => router.push(`/dashboard/audits/${audit.id || ''}`)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <FileBarChart2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-medium text-foreground truncate pr-2 group-hover/audit:text-primary transition-colors">
                            {audit.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {audit.time}
                            </span>
                            {audit.size && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-xs text-muted-foreground">{audit.size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium border",
                          config.bg, config.text, config.border
                        )}>
                          {config.label}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/audit:text-primary transition-colors" />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-muted-foreground text-center py-12 text-sm">Aucun audit disponible.</div>
              )}
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="p-6 border-primary/20 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground">Analyse IA</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {loadingInsights ? "Génération..." : stats.latestAudit ? "Analyse terminée" : "En attente"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              {loadingInsights ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              ) : aiInsights.length > 0 ? (
                aiInsights.map((insight, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Insight {i + 1}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                  </div>
                ))
              ) : stats.latestAudit ? (
                <>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap className={cn("h-3 w-3", stats.latestAudit.bias_detected ? "text-red-500" : "text-green-500")} />
                      <span className={cn("text-xs font-medium", stats.latestAudit.bias_detected ? "text-red-500" : "text-green-500")}>
                        {stats.latestAudit.bias_detected ? "Biais Détecté" : "Modèle Sain"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {stats.latestAudit.bias_detected
                        ? "AuditIQ a détecté des disparités significatives. Vérifiez les rapports détaillés."
                        : "Aucun biais majeur détecté. Votre modèle respecte les seuils établis."}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Layers className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Score Global</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Dernier score de <span className="text-primary font-semibold">{stats.latestAudit.overall_score || 0}%</span>.
                      {stats.latestAudit.overall_score < 80 ? " Des optimisations sont possibles." : " Performance optimale."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Lancez votre premier audit pour recevoir des recommandations IA personnalisées.
                  </p>
                </div>
              )}
            </div>

            {stats.latestAudit && (
              <Button
                onClick={() => router.push(`/dashboard/audits/${stats.latestAudit.id}`)}
                className="mt-6 w-full"
              >
                Voir le rapport
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </Card>
        </section>

        {/* Secondary Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Streams */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-lg font-display font-semibold text-foreground">Flux de Données Récent</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={() => router.push('/dashboard/audits')}
              >
                Voir tout
              </Button>
            </div>

            <div className="space-y-3">
              {stats.recentAudits.length > 0 ? (
                stats.recentAudits.map((ds, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer group/item">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        i === 0 ? "bg-primary/10 text-primary" : i === 1 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <FileBarChart2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h5 className="text-sm font-medium text-foreground truncate pr-2">{ds.name}</h5>
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-medium border flex-shrink-0",
                            ds.status === 'Critical Bias' ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" :
                              ds.status === 'Failed' ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" :
                                "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                          )}>{ds.status}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ds.time}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1"><Upload className="h-3 w-3" /> {ds.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pl-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => router.push(`/dashboard/audits/${ds.id}`)}
                        title="Voir les détails"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {(ds.status === 'Audited' || ds.status === 'Critical Bias') && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => downloadReport(ds.id, ds.name)}
                          title="Télécharger le rapport"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-10 text-sm">Aucun audit récent.</div>
              )}
            </div>
          </Card>

          {/* Audit Statistics */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-lg font-display font-semibold text-foreground">Statistiques d'Audits</h2>
              </div>
              <Badge variant="secondary" className="text-xs">En direct</Badge>
            </div>

            <div className="space-y-6">
              {stats.totalAudits > 0 ? (
                <>
                  {/* Status Distribution */}
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Distribution par Statut</p>
                    <div className="space-y-3">
                      {stats.auditStats && Object.entries(stats.auditStats.byStatus).map(([status, count]) => {
                        const percent = (count / stats.totalAudits) * 100
                        const statusColors = {
                          'completed': 'bg-green-500',
                          'running': 'bg-blue-500',
                          'failed': 'bg-red-500',
                          'pending': 'bg-gray-400 dark:bg-gray-500'
                        }
                        const statusLabels = {
                          'completed': 'Complétés',
                          'running': 'En cours',
                          'failed': 'Échoués',
                          'pending': 'En attente'
                        }
                        return (
                          <div key={status}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">{statusLabels[status] || status}</span>
                              <span className="text-xs font-medium text-foreground">{count}</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all duration-1000", statusColors[status] || 'bg-muted-foreground/30')}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Use Case Breakdown */}
                  {stats.auditStats && Object.keys(stats.auditStats.byUseCase).length > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Répartition par Cas d'Usage</p>
                      <div className="space-y-3">
                        {Object.entries(stats.auditStats.byUseCase).map(([useCase, count]) => {
                          const percent = (count / stats.totalAudits) * 100
                          const useCaseLabels = {
                            'healthcare': 'Santé',
                            'finance': 'Finance',
                            'retail': 'Commerce',
                            'other': 'Autres'
                          }
                          return (
                            <div key={useCase}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">{useCaseLabels[useCase] || useCase}</span>
                                <span className="text-xs font-medium text-foreground">{count}</span>
                              </div>
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all duration-1000"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bias Detection Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center hover:border-primary/20 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1">Biais Détectés</p>
                      <p className={cn(
                        "text-2xl font-display font-bold",
                        stats.auditStats?.biasDetectedCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      )}>
                        {stats.auditStats?.biasDetectedCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stats.auditStats?.biasDetectedPercent || 0}% des audits
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border text-center hover:border-primary/20 transition-colors">
                      <p className="text-xs text-muted-foreground mb-1">Score Moyen</p>
                      <p className="text-2xl font-display font-bold text-primary">{stats.fairnessScore}%</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stats.fairnessScore >= 80 ? 'Excellent' : stats.fairnessScore >= 60 ? 'Bon' : 'À améliorer'}
                      </p>
                    </div>
                  </div>

                  {/* Score Range Distribution */}
                  {stats.auditStats && Object.keys(stats.auditStats.byScoreRange).length > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Distribution des Scores</p>
                      <div className="space-y-3">
                        {Object.entries(stats.auditStats.byScoreRange)
                          .sort((a, b) => a[0].localeCompare(b[0]))
                          .map(([range, count]) => {
                            const percent = (count / stats.totalAudits) * 100
                            const rangeColors = {
                              '0-20%': 'bg-red-600',
                              '21-40%': 'bg-orange-500',
                              '41-60%': 'bg-yellow-500',
                              '61-80%': 'bg-green-500',
                              '81-100%': 'bg-emerald-500'
                            }
                            return (
                              <div key={range}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">{range}</span>
                                  <span className="text-xs font-medium text-foreground">{count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full transition-all duration-1000", rangeColors[range] || 'bg-muted-foreground/30')}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground text-center py-12 text-sm">Aucun audit disponible.</div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </DashboardShell>
  )
}
