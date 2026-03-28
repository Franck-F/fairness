'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { FileText, Download, Calendar, Loader2, FileBarChart, AlertTriangle, Search, Filter, BarChart3, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export default function ReportsPage() {
  const { session } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (session?.access_token) {
      fetchCompletedAudits()
    }
  }, [session])

  const fetchCompletedAudits = async () => {
    try {
      const response = await fetch('/api/audits', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Only show completed audits that have results
        const completed = (data.audits || []).filter(a => a.status === 'completed')
        setAudits(completed)
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des audits')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (audit, format = 'pdf') => {
    setDownloading(audit.id)
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
          toast.success('Rapport PDF telecharge !')
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
            toast.success('Rapport telecharge !')
          }
        }
      } else {
        throw new Error('Erreur lors de la generation du rapport')
      }
    } catch (error) {
      toast.error('Erreur lors du telechargement')
    } finally {
      setDownloading(null)
    }
  }

  const getRiskColor = (level) => {
    if (level === 'Low') return 'text-green-600 dark:text-green-400'
    if (level === 'Medium') return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.audit_name.toLowerCase().includes(searchQuery.toLowerCase())

    // Status in reports page is derived from risk_level for filtering purposes
    const status = audit.risk_level === 'Low' ? 'compliant' : audit.risk_level === 'Medium' ? 'warning' : 'non-compliant'
    const matchesStatus = statusFilter === 'all' || status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <PageHeader
          icon={FileText}
          title="Gestion des"
          titleHighlight="Rapports"
          description="Telechargez les rapports d'audit de vos analyses de fairness terminees."
          actions={
            <div className="flex items-center gap-3">
              <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Rechercher un rapport..."
                  className="pl-10 bg-card border-border rounded-xl focus:ring-1 focus:ring-primary transition-all text-xs h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-card border-border rounded-xl h-9 text-xs">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3 w-3 text-primary" />
                    <SelectValue placeholder="Niveau" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="compliant">Sains (Low)</SelectItem>
                  <SelectItem value="warning">Attention (Med)</SelectItem>
                  <SelectItem value="non-compliant">Critiques (High)</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 bg-card border border-border px-3 py-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">
                  {filteredAudits.length} disponible(s)
                </span>
              </div>
            </div>
          }
        />

        {/* Stats from real data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Audits Termines"
            value={audits.length.toString()}
            icon={FileBarChart}
          />
          <StatCard
            label="Score Moyen"
            value={audits.length > 0 ? `${Math.round(audits.reduce((s, a) => s + (a.overall_score || 0), 0) / audits.length)}%` : '--'}
            icon={BarChart3}
          />
          <StatCard
            label="Biais Detectes"
            value={audits.filter(a => a.bias_detected).length.toString()}
            icon={AlertTriangle}
          />
          <StatCard
            label="Derniere Analyse"
            value={audits.length > 0 ? new Date(audits[0].completed_at || audits[0].created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '--'}
            icon={Calendar}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && audits.length === 0 && (
          <EmptyState
            icon={FileBarChart}
            title="Aucun rapport disponible"
            description="Lancez un audit depuis la page Upload pour generer votre premier rapport d'analyse de fairness."
          />
        )}

        {/* Reports Grid -- Real Data */}
        {!loading && filteredAudits.length > 0 && (
          <div className="grid gap-4">
            {filteredAudits.map((audit) => (
              <Card
                key={audit.id}
                className="overflow-hidden hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-display font-semibold text-foreground">
                          {audit.audit_name}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <Badge className={cn(
                            "text-xs font-medium border",
                            audit.risk_level === 'Low' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                              audit.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' :
                                'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                          )}>
                            Score: {audit.overall_score || 0}%
                          </Badge>
                          <div className="flex items-center gap-1.5">
                            {audit.bias_detected ? (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            ) : null}
                            <span className={audit.bias_detected ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                              {audit.bias_detected ? 'Biais detecte' : 'Modele sain'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-muted-foreground/50" />
                            <span>
                              {new Date(audit.completed_at || audit.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        className="h-10 px-5 rounded-xl border-border text-foreground font-display font-medium text-xs"
                        onClick={() => downloadReport(audit, 'txt')}
                        disabled={downloading === audit.id}
                      >
                        {downloading === audit.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        TXT
                      </Button>
                      <Button
                        className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-medium text-xs"
                        onClick={() => downloadReport(audit, 'pdf')}
                        disabled={downloading === audit.id}
                      >
                        {downloading === audit.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
