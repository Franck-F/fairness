'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
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
          console.error('API Error Response:', response.status, errorText)
          throw new Error(`Failed to fetch audits: ${response.status} ${errorText}`)
        }

        const { audits } = await response.json()
        console.log('[DASHBOARD DEBUG] Fetched audits:', audits?.length || 0)

        if (audits && audits.length > 0) {
          console.log('[DASHBOARD DEBUG] First audit:', audits[0])

          const total = audits.length
          const completedAudits = audits.filter(a => a.status === 'completed')
          console.log('[DASHBOARD DEBUG] Completed audits:', completedAudits.length)

          const avgScore = completedAudits.length > 0
            ? Math.round(completedAudits.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / completedAudits.length)
            : 0
          const biasedCount = audits.filter(a => a.bias_detected).length

          // Count unique datasets
          const uniqueDatasets = new Set(audits.map(a => a.dataset_id)).size

          const recent = audits.slice(0, 3).map(a => ({
            id: a.id,
            name: a.audit_name,
            time: new Date(a.created_at).toLocaleDateString(),
            size: a.datasets?.file_size ? `${(a.datasets.file_size / 1024 / 1024).toFixed(1)} MB` : 'N/A',
            status: a.status === 'completed' ? (a.bias_detected ? 'Critical Bias' : 'Audited') : a.status === 'failed' ? 'Failed' : 'Pending'
          }))

          // Process evolution data (last 20 audits)
          const evolution = [...audits].reverse().slice(-20).map((a, i) => ({
            val: a.overall_score || 0,
            label: `C_${i + 1}`
          }))
          console.log('[DASHBOARD DEBUG] Evolution data points:', evolution.length)
          console.log('[DASHBOARD DEBUG] First 3 evolution values:', evolution.slice(0, 3).map(e => `${e.label}: ${e.val}%`))

          // Process radar metrics (from latest completed audit)
          const latestCompleted = audits.find(a => a.status === 'completed')
          console.log('[DASHBOARD DEBUG] Latest completed audit:', latestCompleted?.id, latestCompleted?.audit_name)
          console.log('[DASHBOARD DEBUG] Latest metrics_results:', latestCompleted?.metrics_results)

          let radar = { maxDeviation: 'N/A', impactRatio: 'N/A' }
          let radarData = null

          if (latestCompleted && latestCompleted.metrics_results) {
            const allValues = Object.values(latestCompleted.metrics_results)
              .flatMap(m => Object.values(m))
              .filter(v => typeof v === 'number')

            console.log('[DASHBOARD DEBUG] All metric values:', allValues.length, allValues.slice(0, 5))

            if (allValues.length > 0) {
              const maxDev = Math.max(...allValues.map(v => Math.abs(1 - v)))
              const avgRatio = allValues.reduce((a, b) => a + b, 0) / allValues.length
              radar = {
                maxDeviation: `${(maxDev * 100).toFixed(1)}%`,
                impactRatio: avgRatio.toFixed(2)
              }

              // Build radar polygon data from metrics
              const attributeNames = Object.keys(latestCompleted.metrics_results)
              if (attributeNames.length > 0) {
                const avgByAttr = attributeNames.map(attr => {
                  const metrics = Object.values(latestCompleted.metrics_results[attr])
                  return metrics.reduce((a, b) => a + b, 0) / metrics.length
                })
                radarData = {
                  attributes: attributeNames,
                  values: avgByAttr
                }
                console.log('[DASHBOARD DEBUG] Radar data created:', radarData)
              }
            }
          }

          // Calculate audit statistics for visualizations
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

          const newStats = {
            totalAudits: total,
            fairnessScore: avgScore,
            biasDetected: biasedCount,
            totalDatasets: uniqueDatasets,
            recentAudits: recent,
            evolutionData: evolution,
            radarMetrics: radar,
            radarData: radarData,
            latestAudit: latestCompleted,
            auditStats: auditStats  // Add new statistics
          }

          console.log('[DASHBOARD DEBUG] Final stats:', {
            evolutionDataLength: newStats.evolutionData.length,
            radarDataExists: !!newStats.radarData,
            latestAuditExists: !!newStats.latestAudit
          })

          setStats(newStats)

          // Fetch AI insights for latest completed audit
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
      } else {
        console.error('Failed to fetch insights')
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  // Calculate radar polygon path
  const getRadarPath = () => {
    if (!stats.radarData || stats.radarData.attributes.length === 0) return ''

    const centerX = 50
    const centerY = 50
    const maxRadius = 35
    const angleStep = (2 * Math.PI) / stats.radarData.attributes.length

    const points = stats.radarData.values.map((value, i) => {
      const angle = angleStep * i - Math.PI / 2
      const radius = Math.max(5, value * maxRadius)
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')

    return `M ${points.split(' ')[0]} L ${points.split(' ').slice(1).join(' L ')} Z`
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
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement')
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8 lg:space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        {/* Premium Welcome Header */}
        <header className="relative pb-8 border-b border-white/5">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-brand-primary animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary/60">System Ready</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-black tracking-tighter text-white leading-none">
                Bonjour, <span className="text-brand-primary">{user?.user_metadata?.full_name?.split(' ')[0] || 'Franck'}</span>.
              </h1>
              <p className="text-lg md:text-xl text-white/40 font-display font-medium max-w-2xl leading-none">
                {stats.totalAudits > 0
                  ? `AuditIQ a analysé ${stats.totalAudits} modèles pour vous.`
                  : "Commencez votre premier audit pour activer l'analyse."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card px-5 py-3 rounded-2xl border-white/5 bg-white/5 flex flex-col items-end">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">STATION_ID</span>
                <span className="text-xs font-display font-black text-white/60">AUDIT_IQ_NODE_04</span>
              </div>
            </div>
          </div>
        </header>

        {/* Holographic Stats Grid — NOW WITH 4 CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Total Audits', value: stats.totalAudits, sub: 'ANALYSES TERMINÉES', icon: BarChart3, color: 'text-brand-primary', trend: 'up' },
            { label: 'Score Moyen', value: `${stats.fairnessScore}%`, sub: 'GLOBAL NOMINAL', icon: Shield, color: 'text-brand-cotton', trend: 'stable' },
            { label: 'Biais Détectés', value: `${stats.biasDetected}`, sub: 'CRITICAL PRIORITY', icon: AlertTriangle, color: stats.biasDetected > 0 ? 'text-red-400' : 'text-green-400', trend: stats.biasDetected > 0 ? 'down' : 'up' },
            { label: 'Datasets Analysés', value: stats.totalDatasets, sub: 'SOURCES DE DONNÉES', icon: Database, color: 'text-blue-400', trend: 'up' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all duration-700 group relative overflow-hidden flex flex-col justify-between min-h-[160px] lg:h-[200px]">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <s.icon className="h-40 w-40" />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                {s.trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : s.trend === 'down' ? <ArrowDownRight className="h-4 w-4 text-red-500" /> : null}
              </div>

              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">{s.label}</p>
                <div className="flex items-baseline gap-3">
                  <h3 className={cn("text-4xl font-display font-black tracking-tighter", s.color)}>{s.value}</h3>
                  <span className="text-[9px] font-black text-white/20">{s.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Analysis Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Audits Timeline — REPLACING BROKEN CHART */}
          <div className="lg:col-span-2 glass-card rounded-[2.5rem] lg:rounded-[3.5rem] p-6 lg:p-10 bg-white/[0.03] border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
              <div>
                <h4 className="text-2xl font-display font-black text-white tracking-tight">Derniers Audits</h4>
                <p className="text-white/40 font-display font-medium">Historique récent de vos analyses de fairness.</p>
              </div>
              <Badge className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary font-black tracking-widest text-[9px] px-3 py-1">
                {stats.recentAudits.length} ANALYSES
              </Badge>
            </div>

            <div className="space-y-4 relative z-10">
              {stats.recentAudits.length > 0 ? (
                stats.recentAudits.slice(0, 6).map((audit, i) => {
                  const statusConfig = {
                    'Completed': { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'Terminé' },
                    'Critical Bias': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', label: 'Biais Critique' },
                    'Failed': { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', label: 'Échoué' },
                    'Running': { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', label: 'En cours' },
                  }
                  const config = statusConfig[audit.status] || { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20', label: audit.status }

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-5 lg:p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-brand-primary/30 transition-all group/audit cursor-pointer"
                      onClick={() => router.push(`/dashboard/audits/${audit.id || ''}`)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center flex-shrink-0">
                          <FileBarChart2 className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-display font-medium text-white tracking-tight truncate pr-2 group-hover/audit:text-brand-primary transition-colors">
                            {audit.name}
                          </h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-medium text-white/40 flex items-center gap-1.5">
                              <Clock className="h-3 w-3" /> {audit.time}
                            </span>
                            {audit.size && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-[10px] font-medium text-white/40">{audit.size}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Score Badge */}
                        {audit.score !== undefined && (
                          <div className="hidden sm:flex flex-col items-center">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-wider mb-1">Score</span>
                            <div className={cn(
                              "px-3 py-1.5 rounded-xl font-display font-black text-sm",
                              audit.score >= 80 ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                audit.score >= 60 ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                                  "bg-red-500/10 text-red-500 border border-red-500/20"
                            )}>
                              {audit.score}%
                            </div>
                          </div>
                        )}
                        {/* Status Badge */}
                        <div className={cn(
                          "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                          config.bg, config.text, config.border
                        )}>
                          {config.label}
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover/audit:text-brand-primary transition-colors" />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-white/20 text-center py-20 font-display font-medium">Aucun audit disponible.</div>
              )}
            </div>
          </div>

          {/* AI Strategy Cell — NOW WITH GEMINI INSIGHTS */}
          <div className="glass-card rounded-[2.5rem] lg:rounded-[3.5rem] p-6 lg:p-10 bg-brand-primary/5 border-brand-primary/30 relative flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-[1.25rem] bg-brand-primary flex items-center justify-center shadow-[0_0_30px_#FF1493]">
                  <Sparkles className="text-white h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-black text-white">Analyse d'AuditIQ</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic">
                      {loadingInsights ? "Génération..." : stats.latestAudit ? "Analyse terminée" : "En attente"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {loadingInsights ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 text-brand-primary animate-spin" />
                  </div>
                ) : aiInsights.length > 0 ? (
                  aiInsights.map((insight, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-3 w-3 text-brand-primary" />
                        <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Insight {i + 1}</span>
                      </div>
                      <p className="text-sm font-display font-medium text-white/80 leading-snug">{insight}</p>
                    </div>
                  ))
                ) : stats.latestAudit ? (
                  <>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all group/tip">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className={cn("h-3 w-3", stats.latestAudit.bias_detected ? "text-red-500" : "text-green-500")} />
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", stats.latestAudit.bias_detected ? "text-red-500" : "text-green-500")}>
                          {stats.latestAudit.bias_detected ? "Biais Détecté" : "Modèle Sain"}
                        </span>
                      </div>
                      <p className="text-sm font-display font-medium text-white/80 leading-snug">
                        {stats.latestAudit.bias_detected
                          ? "AuditIQ a détecté des disparités significatives. Vérifiez les rapports détaillés."
                          : "Aucun biais majeur détecté. Votre modèle respecte les seuils établis."}
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all group/tip">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-3 w-3 text-brand-cotton" />
                        <span className="text-[9px] font-black text-brand-cotton uppercase tracking-widest">Score Global</span>
                      </div>
                      <p className="text-sm font-display font-medium text-white/80 leading-snug">
                        Dernier score de <span className="text-brand-cotton font-black">{stats.latestAudit.overall_score || 0}%</span>.
                        {stats.latestAudit.overall_score < 80 ? " Des optimisations sont possibles." : " Performance optimale."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                    <p className="text-sm font-display font-medium text-white/40 leading-snug">
                      Lancez votre premier audit pour recevoir des recommandations IA personnalisées.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FIXED BUTTON LINK */}
            {stats.latestAudit && (
              <Button
                onClick={() => router.push(`/dashboard/audits/${stats.latestAudit.id}`)}
                className="h-auto py-4 lg:h-14 mt-8 lg:mt-10 w-full rounded-2xl bg-white text-black font-display font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-normal leading-tight text-center"
              >
                <span>VOIR LE RAPPORT</span>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </Button>
            )}
          </div>
        </section>

        {/* Operational Modules Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Recent Streams — NOW WITH ACTIONS */}
          <div className="glass-card rounded-[2.5rem] lg:rounded-[3rem] p-6 lg:p-10 bg-white/[0.02] border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-white/20" />
                <h4 className="text-2xl font-display font-black text-white tracking-tight">Flux de Données Récent</h4>
              </div>
              <Button
                variant="ghost"
                className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-brand-primary px-0"
                onClick={() => router.push('/dashboard/audits')}
              >
                Voir tout
              </Button>
            </div>

            <div className="space-y-4">
              {stats.recentAudits.length > 0 ? (
                stats.recentAudits.map((ds, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[1.75rem] border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group/item relative overflow-hidden">
                    <div className="flex items-center gap-5 relative z-10 min-w-0 flex-1">
                      <div className={cn(
                        "w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 flex-shrink-0",
                        i === 0 ? "bg-brand-cotton/10 text-brand-cotton" : i === 1 ? "bg-brand-primary/10 text-brand-primary" : "bg-white/5 text-white/40"
                      )}>
                        <FileBarChart2 className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className="font-display font-medium text-white tracking-tight truncate pr-2">{ds.name}</h5>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border flex-shrink-0",
                            ds.status === 'Critical Bias' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              ds.status === 'Failed' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                "bg-green-500/10 text-green-500 border-green-500/20"
                          )}>{ds.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-medium text-white/40">
                          <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {ds.time}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="flex items-center gap-1.5"><Upload className="h-3 w-3" /> {ds.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="relative z-10 flex items-center gap-2 pl-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-xl hover:bg-white/10 text-white/40 hover:text-white h-8 w-8"
                        onClick={() => router.push(`/dashboard/audits/${ds.id}`)}
                        title="Voir les détails"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {ds.status === 'Audited' || ds.status === 'Critical Bias' ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-xl hover:bg-white/10 text-white/40 hover:text-brand-primary h-8 w-8"
                          onClick={() => downloadReport(ds.id, ds.name)}
                          title="Télécharger le rapport"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/20 text-center py-10 font-display font-medium">Aucun audit récent.</div>
              )}
            </div>
          </div>

          {/* Audit Statistics Panel — ALWAYS USEFUL */}
          <div className="glass-card rounded-[3rem] p-10 bg-[#0A0A0B] border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial-gradient from-brand-primary/10 to-transparent opacity-50" />

            <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="flex items-center gap-4">
                <BarChart3 className="h-5 w-5 text-white/20" />
                <h4 className="text-2xl font-display font-black text-white tracking-tight">Statistiques d'Audits</h4>
              </div>
              <Badge className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary font-black tracking-widest text-[9px] px-3 py-1">LIVE DATA</Badge>
            </div>

            <div className="space-y-8 relative z-10">
              {stats.totalAudits > 0 ? (
                <>
                  {/* Status Distribution */}
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Distribution par Statut</p>
                    <div className="space-y-3">
                      {stats.auditStats && Object.entries(stats.auditStats.byStatus).map(([status, count]) => {
                        const percent = (count / stats.totalAudits) * 100
                        const statusColors = {
                          'completed': 'bg-green-500',
                          'running': 'bg-blue-500',
                          'failed': 'bg-red-500',
                          'pending': 'bg-gray-500'
                        }
                        const statusLabels = {
                          'completed': 'Complétés',
                          'running': 'En cours',
                          'failed': 'Échoués',
                          'pending': 'En attente'
                        }
                        return (
                          <div key={status} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-display font-medium text-white/60">{statusLabels[status] || status}</span>
                                <span className="text-xs font-black text-white/40">{count}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all duration-1000", statusColors[status] || 'bg-white/20')}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Use Case Breakdown */}
                  {stats.auditStats && Object.keys(stats.auditStats.byUseCase).length > 0 && (
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Répartition par Cas d'Usage</p>
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
                            <div key={useCase} className="flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-display font-medium text-white/60">{useCaseLabels[useCase] || useCase}</span>
                                  <span className="text-xs font-black text-white/40">{count}</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-brand-cotton rounded-full transition-all duration-1000"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Bias Detection Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center group hover:border-brand-primary/40 transition-all">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Biais Détectés</p>
                      <p className={cn(
                        "text-3xl font-display font-black",
                        stats.auditStats?.biasDetectedCount > 0 ? "text-red-400" : "text-green-400"
                      )}>
                        {stats.auditStats?.biasDetectedCount || 0}
                      </p>
                      <p className="text-[9px] font-medium text-white/40 mt-1">
                        {stats.auditStats?.biasDetectedPercent || 0}% des audits
                      </p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center group hover:border-brand-cotton/40 transition-all">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Score Moyen</p>
                      <p className="text-3xl font-display font-black text-brand-cotton">{stats.fairnessScore}%</p>
                      <p className="text-[9px] font-medium text-white/40 mt-1">
                        {stats.fairnessScore >= 80 ? 'Excellent' : stats.fairnessScore >= 60 ? 'Bon' : 'À améliorer'}
                      </p>
                    </div>
                  </div>

                  {/* Score Range Distribution */}
                  {stats.auditStats && Object.keys(stats.auditStats.byScoreRange).length > 0 && (
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Distribution des Scores</p>
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
                              <div key={range} className="flex items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-display font-medium text-white/60">{range}</span>
                                    <span className="text-xs font-black text-white/40">{count}</span>
                                  </div>
                                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                      className={cn("h-full rounded-full transition-all duration-1000", rangeColors[range] || 'bg-white/20')}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white/20 text-center py-20 font-display font-medium">Aucun audit disponible.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  )
}
