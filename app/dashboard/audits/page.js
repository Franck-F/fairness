'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard/shell'
import { PageHeader } from '@/components/dashboard/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileBarChart2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Search,
  Filter,
  Plus,
  ArrowRight,
  MoreVertical,
  Trash2,
  Eye,
  Loader2,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export default function AuditsPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    medium: 0,
    low: 0,
    averageScore: 0,
  })

  useEffect(() => {
    if (session) {
      loadAudits()
    }
  }, [session])

  const loadAudits = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/audits', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })

      if (!response.ok) throw new Error('Erreur chargement')

      const data = await response.json()
      const auditsList = data.audits || []
      setAudits(auditsList)

      // Calculate stats from real data
      const completed = auditsList.filter(a => a.status === 'completed')
      const avgScore = completed.length > 0
        ? completed.reduce((sum, a) => sum + (a.overall_score || 0), 0) / completed.length
        : 0

      setStats({
        total: auditsList.length,
        critical: auditsList.filter(a => a.risk_level === 'High').length,
        medium: auditsList.filter(a => a.risk_level === 'Medium').length,
        low: auditsList.filter(a => a.risk_level === 'Low').length,
        averageScore: Math.round(avgScore),
      })
    } catch (error) {
      toast.error('Erreur lors du chargement des audits')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (e, audit, format = 'pdf') => {
    e.stopPropagation()
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

  const handleDeleteAudit = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Supprimer cet audit ?')) return

    try {
      const response = await fetch(`/api/audits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })

      if (response.ok) {
        toast.success('Audit supprime')
        loadAudits()
      } else {
        throw new Error('Erreur suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRiskBadge = (risk) => {
    if (!risk) return null

    const styles = {
      Low: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
      Medium: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
      High: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    }

    return (
      <Badge className={cn('border', styles[risk])}>
        {risk === 'Low' && 'Faible'}
        {risk === 'Medium' && 'Moyen'}
        {risk === 'High' && 'Eleve'}
      </Badge>
    )
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: { label: 'En attente', class: 'bg-gray-500/20 text-gray-600 dark:text-gray-400' },
      processing: { label: 'En cours', class: 'bg-blue-500/20 text-blue-600 dark:text-blue-400' },
      completed: { label: 'Termine', class: 'bg-green-500/20 text-green-600 dark:text-green-400' },
      failed: { label: 'Echoue', class: 'bg-red-500/20 text-red-600 dark:text-red-400' },
    }

    const style = styles[status] || styles.pending
    return <Badge className={style.class}>{style.label}</Badge>
  }

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.audit_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Polling mechanism
  const startPolling = async (auditId) => {
    const pollInterval = 5000
    const maxAttempts = 60
    let attempts = 0

    const poll = async () => {
      attempts++
      if (attempts > maxAttempts) {
        toast.error('Analyse trop longue. Veuillez rafraichir plus tard.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/audits', {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        })
        if (response.ok) {
          const data = await response.json()
          const updatedAudits = data.audits || []
          setAudits(updatedAudits)

          const currentAudit = updatedAudits.find(a => a.id === auditId)

          if (currentAudit) {
            if (currentAudit.status === 'completed') {
              toast.success('Analyse terminee avec succes !')
              const completed = updatedAudits.filter(a => a.status === 'completed')
              const avgScore = completed.length > 0
                ? completed.reduce((sum, a) => sum + (a.overall_score || 0), 0) / completed.length
                : 0
              setStats({
                total: updatedAudits.length,
                critical: updatedAudits.filter(a => a.risk_level === 'High').length,
                medium: updatedAudits.filter(a => a.risk_level === 'Medium').length,
                low: updatedAudits.filter(a => a.risk_level === 'Low').length,
                averageScore: Math.round(avgScore),
              })
              setLoading(false)
              return
            } else if (currentAudit.status === 'failed') {
              toast.error(`Echec de l'analyse: ${currentAudit.error_message || 'Erreur inconnue'}`)
              setLoading(false)
              return
            }
          }
        }

        setTimeout(poll, pollInterval)

      } catch (error) {
        setTimeout(poll, pollInterval)
      }
    }

    poll()
  }

  return (
    <DashboardShell>
      <div className="space-y-6 lg:space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <PageHeader
          icon={FileBarChart2}
          title="Mes"
          titleHighlight="Audits de Fairness"
          description="Consultez l'historique de vos analyses et leur statut."
          actions={
            <Button
              className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold rounded-xl group h-11"
              asChild
            >
              <Link href="/dashboard/upload">
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Nouvel Audit
              </Link>
            </Button>
          }
        />

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-2xl">
            <div className="relative group flex-1">
              <Input
                placeholder="Rechercher par nom..."
                className="pl-4 bg-muted border-border rounded-xl focus:ring-1 focus:ring-primary transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-muted border-border rounded-xl">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Termine</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Echoue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total Audits"
            value={stats.total}
            icon={FileBarChart2}
          />
          <StatCard
            label="Risque Eleve"
            value={stats.critical}
            icon={AlertTriangle}
          />
          <StatCard
            label="Risque Moyen"
            value={stats.medium}
            icon={Clock}
          />
          <StatCard
            label="Score Moyen"
            value={`${stats.averageScore}%`}
            icon={TrendingUp}
          />
        </div>

        {/* Audits Feed Section */}
        <div className="space-y-6">
          {loading ? (
            <Card className="p-16 text-center">
              <div className="inline-block mb-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Synchronisation des Audits...</p>
            </Card>
          ) : filteredAudits.length === 0 ? (
            <EmptyState
              icon={FileBarChart2}
              title="Aucun audit"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'Aucun resultat ne correspond a votre recherche.'
                  : 'Votre liste d\'audits est vide. Commençons par analyser un dataset.'
              }
              action={
                !searchTerm && statusFilter === 'all' ? (
                  <Button
                    size="lg"
                    onClick={() => router.push('/dashboard/upload')}
                    className="rounded-xl bg-accent hover:bg-accent text-foreground font-display font-semibold"
                  >
                    <Plus className="h-5 w-5 mr-2 text-primary" />
                    Creer un audit
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredAudits.map((audit) => (
                <Card
                  key={audit.id}
                  className="hover:bg-accent/50 hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden group/audit relative flex flex-col h-full"
                  onClick={() => router.push(`/dashboard/audits/${audit.id}`)}
                >
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {getStatusBadge(audit.status)}
                        {audit.risk_level && getRiskBadge(audit.risk_level)}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-primary transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/audits/${audit.id}`)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                          {audit.status === 'completed' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent"
                              onClick={(e) => downloadReport(e, audit, 'pdf')}
                              disabled={downloading === audit.id}
                              title="Telecharger le rapport PDF"
                            >
                              {downloading === audit.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={(e) => handleDeleteAudit(e, audit.id)}
                            title="Supprimer l'audit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-display font-semibold text-foreground group-hover/audit:text-primary transition-colors mb-2 line-clamp-1" title={audit.audit_name}>
                      {audit.audit_name || 'Analyse non identifiee'}
                    </h3>

                    <div className="text-xs font-medium text-muted-foreground mb-4 flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      {audit.overall_score !== null && audit.overall_score !== undefined ? (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Score</p>
                          <div className={cn(
                            "text-2xl font-display font-bold leading-none",
                            audit.overall_score >= 80 ? "text-green-600 dark:text-green-500" :
                              audit.overall_score >= 60 ? "text-orange-600 dark:text-orange-500" : "text-red-600 dark:text-red-500"
                          )}>
                            {Math.round(audit.overall_score)}%
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Non calcule</p>
                        </div>
                      )}

                      {audit.critical_bias_count > 0 && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-bold" title={`${audit.critical_bias_count} biais critiques`}>
                          <AlertTriangle className="h-4 w-4" />
                          <span>{audit.critical_bias_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

    </DashboardShell>
  )
}
