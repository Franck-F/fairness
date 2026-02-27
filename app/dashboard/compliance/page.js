'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Scale,
  TrendingUp,
  Loader2,
  BarChart3,
  Search,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

export default function CompliancePage() {
  const { session } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (session?.access_token) {
      fetchAudits()
    }
  }, [session])

  const fetchAudits = async () => {
    try {
      const response = await fetch('/api/audits', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAudits((data.audits || []).filter(a => a.status === 'completed'))
      }
    } catch (error) {
      // Silently handle fetch errors
    } finally {
      setLoading(false)
    }
  }

  // Derive compliance scores from real audit results
  const computeCompliance = () => {
    if (audits.length === 0) return null

    const avgScore = Math.round(audits.reduce((s, a) => s + (a.overall_score || 0), 0) / audits.length)
    const biasCount = audits.filter(a => a.bias_detected).length
    const compliantCount = audits.filter(a => (a.overall_score || 0) >= 80).length

    // Build per-audit compliance entries
    const auditEntries = audits.map(audit => {
      const score = audit.overall_score || 0
      const status = score >= 80 ? 'compliant' : score >= 60 ? 'warning' : 'non-compliant'

      // Derive metric details from audit's metrics_results (Array structure)
      const metricDetails = []
      if (audit.metrics_results) {
        Object.entries(audit.metrics_results).forEach(([attr, metrics]) => {
          if (!Array.isArray(metrics)) return

          const attrAvg = metrics.reduce((acc, m) => acc + (m.value || 0), 0) / metrics.length
          const attrStatus = attrAvg >= 0.8 ? 'compliant' : attrAvg >= 0.7 ? 'warning' : 'non-compliant'

          metricDetails.push({
            name: `Attribut: ${attr}`,
            status: attrStatus,
            description: `Score: ${(attrAvg * 100).toFixed(1)}% -- ${metrics.map(m => `${m.name}: ${(m.value * 100).toFixed(0)}%`).join(', ')}`,
          })
        })
      }

      return {
        id: audit.id,
        name: audit.audit_name,
        score,
        status,
        riskLevel: audit.risk_level,
        biasDetected: audit.bias_detected,
        date: new Date(audit.completed_at || audit.created_at).toLocaleDateString('fr-FR'),
        requirements: metricDetails.length > 0 ? metricDetails : [{
          name: 'Analyse simplifiee',
          status: 'compliant',
          description: 'Metriques detaillees en attente de recalcul.',
        }],
      }
    })

    const filteredEntries = auditEntries.filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter
      return matchesSearch && matchesStatus
    })

    return {
      overall: avgScore,
      status: avgScore >= 80 ? 'compliant' : avgScore >= 60 ? 'warning' : 'non-compliant',
      label: avgScore >= 80 ? 'Conforme' : avgScore >= 60 ? 'Conformite Partielle' : 'Non Conforme',
      totalAudits: audits.length,
      compliantCount,
      biasCount,
      entries: filteredEntries,
    }
  }

  const compliance = computeCompliance()

  const getStatusBadge = (status) => {
    const styles = {
      compliant: { label: 'Conforme', icon: CheckCircle2, class: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' },
      warning: { label: 'Attention', icon: AlertTriangle, class: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' },
      'non-compliant': { label: 'Non conforme', icon: XCircle, class: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' },
    }
    const style = styles[status] || styles.warning
    const Icon = style.icon
    return (
      <Badge className={cn('border', style.class)}>
        <Icon className="h-3 w-3 mr-1" />
        {style.label}
      </Badge>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <PageHeader
          icon={Shield}
          title="Conformite"
          titleHighlight="AI Act"
          description="Evaluation rigoureuse de la conformite basee sur les standards FAIR et GIGO."
          actions={
            <div className="flex items-center gap-3">
              <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Filtrer les audits..."
                  className="pl-10 bg-card border-border rounded-xl focus:ring-1 focus:ring-primary transition-all text-xs h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-card border-border rounded-xl h-9 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3 w-3 text-primary" />
                    <SelectValue placeholder="Statut" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  <SelectItem value="all">Tous les audits</SelectItem>
                  <SelectItem value="compliant">Conformes</SelectItem>
                  <SelectItem value="warning">Attention</SelectItem>
                  <SelectItem value="non-compliant">Non conformes</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-xl">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  {compliance ? `${compliance.totalAudits} audit(s)` : 'Chargement'}
                </span>
              </div>
            </div>
          }
        />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && !compliance && (
          <EmptyState
            icon={Scale}
            title="Aucune donnee de conformite"
            description="Lancez un audit de fairness pour evaluer automatiquement votre conformite AI Act."
          />
        )}

        {/* Real Compliance Data */}
        {!loading && compliance && (
          <>
            {/* Global Compliance Score */}
            <Card className="p-8 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground leading-tight">Indice de Conformite Global</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Certifie sur {compliance.totalAudits} audit(s). Base sur les metriques Fairlearn 0.8.0.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(compliance.status)}
                    {compliance.biasCount > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 border text-xs font-medium">
                        {compliance.biasCount} audit(s) avec biais
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="w-40 h-40 flex items-center justify-center relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * compliance.overall) / 100} className={cn("transition-all duration-1000", compliance.overall >= 80 ? 'text-green-500' : compliance.overall >= 60 ? 'text-orange-400' : 'text-red-500')} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                      <span className="text-2xl font-display font-bold text-foreground">{compliance.overall}%</span>
                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider text-center leading-tight">{compliance.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-1000", compliance.overall >= 80 ? 'bg-green-500' : 'bg-primary')}
                  style={{ width: `${compliance.overall}%` }}
                />
              </div>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Audits Conformes" value={`${compliance.compliantCount}/${compliance.totalAudits}`} icon={CheckCircle2} />
              <StatCard label="Score Moyen" value={`${compliance.overall}%`} icon={BarChart3} />
              <StatCard label="Biais Detectes" value={compliance.biasCount.toString()} icon={AlertTriangle} />
              <StatCard label="Seuil AI Act" value="80%" icon={Shield} />
            </div>

            {/* Per-Audit Breakdown */}
            <div className="grid gap-6 md:grid-cols-2">
              {compliance.entries.map((entry, idx) => (
                <Card key={idx} className="overflow-hidden hover:border-primary/20 transition-all duration-300">
                  <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-display font-semibold text-foreground">{entry.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {entry.date} -- Risque: {entry.riskLevel === 'Low' ? 'Faible' : entry.riskLevel === 'Medium' ? 'Moyen' : 'Eleve'}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className={cn('text-xl font-display font-bold', getScoreColor(entry.score))}>{entry.score}%</span>
                      {getStatusBadge(entry.status)}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    {entry.requirements.map((req, reqIdx) => (
                      <div key={reqIdx} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border hover:bg-accent transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                          {req.status === 'compliant' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {req.status === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-400" />}
                          {req.status === 'non-compliant' && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-display font-medium text-foreground text-sm">{req.name}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1">{req.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            {compliance.biasCount > 0 && (
              <Card className="overflow-hidden relative">
                <div className="px-8 py-5 border-b border-border bg-muted/50">
                  <h3 className="text-lg font-display font-semibold text-foreground">Actions Recommandees</h3>
                  <p className="text-xs text-muted-foreground mt-1">Correction des disparites detectees</p>
                </div>
                <div className="p-8 space-y-4">
                  {compliance.entries.filter(e => e.biasDetected).map((entry, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <AlertTriangle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-display font-semibold text-foreground">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">Score: {entry.score}% -- Necessite des actions de mitigation</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        'text-xs font-medium border',
                        entry.score < 60 ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                      )}>
                        {entry.score < 60 ? 'Critique' : 'Haute'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Standards & Best Practices */}
            <Card className="overflow-hidden">
              <div className="px-8 py-5 border-b border-border bg-muted/50">
                <h3 className="text-lg font-display font-semibold text-foreground">Standards & Bonnes Pratiques</h3>
                <p className="text-xs text-muted-foreground mt-1">Methodologie AuditIQ (Sapient & Gov.lu)</p>
              </div>
              <div className="p-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "FAIR & GIGO",
                    desc: "Les donnees doivent etre Findable, Accessible, Interoperable, Reusable. La qualite de l'audit depend de la purete du dataset.",
                    icon: Shield
                  },
                  {
                    title: "Biais de Selection",
                    desc: "Verification systematique de la representativite statistique par rapport a la population de production.",
                    icon: AlertTriangle
                  },
                  {
                    title: "Inference Ethique",
                    desc: "Alignement sur Fairlearn 0.8.0 pour la mesure de Statistical Parity et Disparate Impact.",
                    icon: Scale
                  }
                ].map((std, i) => {
                  const Icon = std.icon
                  return (
                    <div key={i} className="p-5 rounded-xl bg-muted/50 border border-border">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="text-sm font-display font-semibold text-foreground mb-2">{std.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{std.desc}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
