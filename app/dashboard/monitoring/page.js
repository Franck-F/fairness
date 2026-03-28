'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Shield,
  RefreshCw,
  Loader2,
  BarChart3,
  Zap,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

export default function MonitoringPage() {
  const { session } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/monitoring', {
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      })
      if (res.ok) {
        setData(await res.json())
      }
    } catch (e) {
      console.error('Monitoring fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) fetchData()
  }, [session])

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </DashboardShell>
    )
  }

  const summary = data?.summary
  const monitors = data?.monitors || []
  const driftAlerts = data?.drift_alerts || []
  const timeline = data?.timeline || []

  const healthConfig = {
    healthy: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Sain' },
    degraded: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle, label: 'Degrade' },
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, label: 'Critique' },
    warning: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle, label: 'Attention' },
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Monitoring & Drift Detection</h1>
            <p className="text-muted-foreground">Surveillance continue de la fairness de vos modeles</p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Rafraichir
          </Button>
        </div>

        {!summary ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucune donnee de monitoring disponible. Completez des audits pour commencer le suivi.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Sante Globale</CardTitle>
                  {(() => {
                    const h = healthConfig[summary.health] || healthConfig.healthy
                    return <h.icon className={cn("h-5 w-5", h.color)} />
                  })()}
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", healthConfig[summary.health]?.color)}>
                    {healthConfig[summary.health]?.label}
                  </div>
                  <p className="text-xs text-muted-foreground">Score actuel: {summary.latest_score}/100</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.avg_score}/100</div>
                  <p className="text-xs text-muted-foreground">Sur {summary.total_audits} audits</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tendance</CardTitle>
                  {summary.trend >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", summary.trend >= 0 ? "text-green-500" : "text-red-500")}>
                    {summary.trend >= 0 ? '+' : ''}{summary.trend} pts
                  </div>
                  <p className="text-xs text-muted-foreground">Depuis le dernier audit</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Alertes Drift</CardTitle>
                  <Zap className={cn("h-4 w-4", summary.drift_alerts_count > 0 ? "text-orange-500" : "text-muted-foreground")} />
                </CardHeader>
                <CardContent>
                  <div className={cn("text-2xl font-bold", summary.drift_alerts_count > 0 ? "text-orange-500" : "")}>
                    {summary.drift_alerts_count}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {summary.critical_alerts > 0 ? `${summary.critical_alerts} critique(s)` : 'Aucune alerte critique'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline Chart */}
            {timeline.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evolution Temporelle</CardTitle>
                  <CardDescription>Score de fairness au fil du temps</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeline.map(t => ({
                      ...t,
                      date: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                    }))}>
                      <defs>
                        <linearGradient id="monitorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="date" tick={{ fill: '#ffffff60', fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#ffffff60', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1a1a1b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        formatter={(val) => [`${val}%`, 'Score']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={2} fill="url(#monitorGradient)"
                        dot={{ r: 4, fill: '#ec4899', stroke: '#0a0a0b', strokeWidth: 2 }} />
                      {/* Threshold line at 80 */}
                      <Line type="monotone" dataKey={() => 80} stroke="#10b981" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Seuil conformite" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Drift Alerts */}
            {driftAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Alertes de Drift
                  </CardTitle>
                  <CardDescription>Deviations significatives detectees par rapport a la moyenne mobile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {driftAlerts.map((alert, i) => {
                      const config = healthConfig[alert.severity] || healthConfig.warning
                      return (
                        <div key={i} className={cn("p-4 rounded-xl border", config.bg, config.border)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <config.icon className={cn("h-5 w-5", config.color)} />
                              <div>
                                <p className="font-medium text-sm">{alert.audit_name}</p>
                                <p className="text-xs text-muted-foreground">{alert.message}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={cn(config.bg, config.color, 'font-bold')}>
                                {alert.deviation > 0 ? '+' : ''}{alert.deviation} pts
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(alert.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monitors by Use Case */}
            <Card>
              <CardHeader>
                <CardTitle>Monitoring par Domaine</CardTitle>
                <CardDescription>Etat de sante par cas d'usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {monitors.map((monitor, i) => {
                    const config = healthConfig[monitor.status] || healthConfig.healthy
                    return (
                      <div key={i} className={cn("p-4 rounded-xl border bg-white/5", config.border)}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-white/60">{monitor.use_case}</span>
                          <Badge className={cn(config.bg, config.color, 'text-xs')}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold mb-1">{monitor.latest_score}/100</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Moy: {monitor.avg_score}</span>
                          <span>|</span>
                          <span>{monitor.audit_count} audits</span>
                          <span>|</span>
                          <span className={cn(monitor.trend >= 0 ? "text-green-500" : "text-red-500")}>
                            {monitor.trend >= 0 ? '+' : ''}{monitor.trend} pts
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
