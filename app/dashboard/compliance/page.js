'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
      console.error('Error fetching audits:', error)
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
            description: `Score: ${(attrAvg * 100).toFixed(1)}% — ${metrics.map(m => `${m.name}: ${(m.value * 100).toFixed(0)}%`).join(', ')}`,
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
          name: 'Analyse simplifiée',
          status: 'compliant',
          description: 'Métriques détaillées en attente de recalcul.',
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
      label: avgScore >= 80 ? 'Conforme' : avgScore >= 60 ? 'Conformité Partielle' : 'Non Conforme',
      totalAudits: audits.length,
      compliantCount,
      biasCount,
      entries: filteredEntries,
    }
  }

  const compliance = computeCompliance()

  const getStatusBadge = (status) => {
    const styles = {
      compliant: { label: 'Conforme', icon: CheckCircle2, class: 'bg-green-100 text-green-800 border-green-200' },
      warning: { label: 'Attention', icon: AlertTriangle, class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'non-compliant': { label: 'Non conforme', icon: XCircle, class: 'bg-red-100 text-red-800 border-red-200' },
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
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-none">
              Conformité <span className="text-brand-primary">AI Act</span>
            </h1>
            <p className="text-white/40 font-display font-medium text-sm max-w-2xl">
              Évaluation rigoureuse de la conformité basée sur les standards FAIR et GIGO.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <Input
                placeholder="Filtrer les audits..."
                className="pl-10 bg-white/5 border-white/10 rounded-2xl focus:ring-1 focus:ring-brand-primary transition-all text-xs h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 rounded-2xl h-9 text-xs">
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 text-brand-primary" />
                  <SelectValue placeholder="Statut" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                <SelectItem value="all">Tous les audits</SelectItem>
                <SelectItem value="compliant">Conformes</SelectItem>
                <SelectItem value="warning">Attention</SelectItem>
                <SelectItem value="non-compliant">Non conformes</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-2xl border-white/5 bg-white/5">
              <Shield className="h-4 w-4 text-brand-primary animate-pulse" />
              <span className="text-[9px] text-white/60 font-black uppercase tracking-widest font-display">
                {compliance ? `${compliance.totalAudits} audit(s)` : 'Chargement'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && !compliance && (
          <div className="glass-card p-16 text-center rounded-[3rem] border-white/5 bg-white/[0.02]">
            <Scale className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-display font-black text-white/40 mb-2">Aucune donnée de conformité</h3>
            <p className="text-white/20 font-display font-medium text-sm max-w-md mx-auto">
              Lancez un audit de fairness pour évaluer automatiquement votre conformité AI Act.
            </p>
          </div>
        )}

        {/* Real Compliance Data */}
        {!loading && compliance && (
          <>
            {/* Global Compliance Score */}
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-primary/5 rounded-[3rem] blur-3xl pointer-events-none" />
              <div className="relative glass-card p-10 rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-3xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-display font-black text-white leading-tight">Indice de Conformité Global</h3>
                        <p className="text-white/40 font-display font-medium text-xs mt-1">
                          Certifié sur {compliance.totalAudits} audit(s). Basé sur les métriques Fairlearn 0.8.0.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(compliance.status)}
                      {compliance.biasCount > 0 && (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 border text-[9px] font-black">
                          {compliance.biasCount} audit(s) avec biais
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-40 h-40 flex items-center justify-center relative">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * compliance.overall) / 100} className={cn("transition-all duration-1000", compliance.overall >= 80 ? 'text-brand-cotton' : compliance.overall >= 60 ? 'text-orange-400' : 'text-red-500')} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-display font-black text-white">{compliance.overall}%</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{compliance.label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]", compliance.overall >= 80 ? 'bg-brand-cotton' : 'bg-brand-primary')}
                    style={{ width: `${compliance.overall}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Audits Conformes', val: `${compliance.compliantCount}/${compliance.totalAudits}`, color: 'text-green-500' },
                { label: 'Score Moyen', val: `${compliance.overall}%`, color: getScoreColor(compliance.overall) },
                { label: 'Biais Détectés', val: compliance.biasCount.toString(), color: compliance.biasCount > 0 ? 'text-red-500' : 'text-green-500' },
                { label: 'Seuil AI Act', val: '80%', color: 'text-white/40' },
              ].map((s, i) => (
                <div key={i} className="glass-card p-3 rounded-2xl border-white/5 bg-white/5 text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-0.5">{s.label}</p>
                  <p className={cn("text-base font-display font-black", s.color)}>{s.val}</p>
                </div>
              ))}
            </div>

            {/* Per-Audit Breakdown */}
            <div className="grid gap-6 md:grid-cols-2">
              {compliance.entries.map((entry, idx) => (
                <div key={idx} className="glass-card rounded-3xl border-white/5 overflow-hidden group hover:border-brand-primary/20 transition-all duration-500">
                  <div className="px-8 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-display font-black text-white">{entry.name}</h4>
                      <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-0.5">
                        {entry.date} • Risque: {entry.riskLevel === 'Low' ? 'Faible' : entry.riskLevel === 'Medium' ? 'Moyen' : 'Élevé'}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className={cn('text-xl font-display font-black', getScoreColor(entry.score))}>{entry.score}%</span>
                      {getStatusBadge(entry.status)}
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    {entry.requirements.map((req, reqIdx) => (
                      <div key={reqIdx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0 border border-white/5">
                          {req.status === 'compliant' && <CheckCircle2 className="h-5 w-5 text-brand-cotton" />}
                          {req.status === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-400" />}
                          {req.status === 'non-compliant' && <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-display font-bold text-white text-sm">{req.name}</p>
                          <p className="text-xs text-white/40 leading-relaxed mt-1">{req.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {compliance.biasCount > 0 && (
              <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <TrendingUp className="h-40 w-40 text-brand-primary" />
                </div>
                <div className="px-10 py-6 border-b border-white/5 bg-white/5">
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">Actions Recommandées</h3>
                  <p className="text-[9px] text-white/40 font-display font-medium mt-1 uppercase tracking-widest">Correction des disparités détectées</p>
                </div>
                <div className="p-10 space-y-4">
                  {compliance.entries.filter(e => e.biasDetected).map((entry, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-brand-primary/5 border border-brand-primary/10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
                          <AlertTriangle className="h-6 w-6 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-display font-black text-white">{entry.name}</p>
                          <p className="text-sm text-white/40 font-display font-medium">Score: {entry.score}% — Nécessite des actions de mitigation</p>
                        </div>
                      </div>
                      <Badge className={cn(
                        'text-[9px] font-black border uppercase',
                        entry.score < 60 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      )}>
                        {entry.score < 60 ? 'Critique' : 'Haute'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Standards & Best Practices */}
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
              <div className="px-10 py-6 border-b border-white/5 bg-white/5">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tighter">Standards & Bonnes Pratiques</h3>
                <p className="text-[9px] text-white/40 font-display font-medium mt-1 uppercase tracking-widest">Méthodologie AuditIQ (Sapient & Gov.lu)</p>
              </div>
              <div className="p-8 grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "FAIR & GIGO",
                    desc: "Les données doivent être Findable, Accessible, Interoperable, Reusable. La qualité de l'audit dépend de la pureté du dataset.",
                    icon: Shield
                  },
                  {
                    title: "Biais de Sélection",
                    desc: "Vérification systématique de la représentativité statistique par rapport à la population de production.",
                    icon: AlertTriangle
                  },
                  {
                    title: "Inférence Éthique",
                    desc: "Alignement sur Fairlearn 0.8.0 pour la mesure de Statistical Parity et Disparate Impact.",
                    icon: Scale
                  }
                ].map((std, i) => {
                  const Icon = std.icon
                  return (
                    <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 border border-brand-primary/20">
                        <Icon className="h-5 w-5 text-brand-primary" />
                      </div>
                      <h4 className="text-sm font-display font-black text-white mb-2 uppercase tracking-wide">{std.title}</h4>
                      <p className="text-[11px] text-white/30 leading-relaxed">{std.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
