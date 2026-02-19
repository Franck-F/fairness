'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      console.error('Load audits error:', error)
      toast.error('Erreur lors du chargement des audits')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async (e, audit, format = 'pdf') => {
    e.stopPropagation() // Prevent navigating to detail page
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
      Low: 'bg-green-500/20 text-green-400 border-green-500/30',
      Medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      High: 'bg-red-500/20 text-red-400 border-red-500/30',
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
      pending: { label: 'En attente', class: 'bg-gray-500/20 text-gray-400' },
      processing: { label: 'En cours', class: 'bg-blue-500/20 text-blue-400' },
      completed: { label: 'Termine', class: 'bg-green-500/20 text-green-400' },
      failed: { label: 'Echoue', class: 'bg-red-500/20 text-red-400' },
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
    const pollInterval = 5000 // 5 seconds
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    const poll = async () => {
      attempts++
      if (attempts > maxAttempts) {
        toast.error('Analyse trop longue. Veuillez rafraîchir plus tard.')
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

          // Check status of our audit
          const currentAudit = updatedAudits.find(a => a.id === auditId)

          if (currentAudit) {
            if (currentAudit.status === 'completed') {
              toast.success('Analyse terminée avec succès !')
              // Update stats
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
              setLoading(false) // Validation
              return // Stop polling
            } else if (currentAudit.status === 'failed') {
              toast.error(`Échec de l'analyse: ${currentAudit.error_message || 'Erreur inconnue'}`)
              setLoading(false)
              return // Stop polling
            }
          }
        }

        // Continue polling
        setTimeout(poll, pollInterval)

      } catch (error) {
        console.error('Polling error:', error)
        // Keep polling even if one request fails? Yes.
        setTimeout(poll, pollInterval)
      }
    }

    poll()
  }

  return (
    <DashboardShell>
      <div className="space-y-6 lg:space-y-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
              Mes <span className="text-brand-primary">Audits de Fairness</span>
            </h1>
            <p className="text-sm md:text-base text-white/40 font-display font-medium">
              Consultez l'historique de vos analyses et leur statut.
            </p>
          </div>
          <Button
            className="w-full lg:w-auto bg-gradient-to-r from-brand-primary to-brand-cotton hover:opacity-90 text-white font-display font-black tracking-tight rounded-2xl shadow-lg shadow-brand-primary/20 group h-11"
            asChild
          >
            <Link href="/dashboard/upload">
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
              NOUVEL AUDIT
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-2xl">
            <div className="relative group flex-1">
              <Input
                placeholder="Rechercher par nom..."
                className="pl-4 bg-white/5 border-white/10 rounded-2xl focus:ring-1 focus:ring-brand-primary transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 rounded-2xl">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: 'Total Audits', value: stats.total, icon: FileBarChart2, color: 'text-white' },
            { label: 'Risque Élevé', value: stats.critical, icon: AlertTriangle, color: 'text-red-500' },
            { label: 'Risque Moyen', value: stats.medium, icon: Clock, color: 'text-orange-400' },
            { label: 'Score Moyen', value: `${stats.averageScore}%`, icon: TrendingUp, color: 'text-brand-primary' }
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl border-white/5 hover:border-brand-primary/20 transition-all group relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl transition-transform group-hover:scale-150" />
              <item.icon className={cn("h-5 w-5 mb-4 group-hover:scale-110 transition-transform", item.color)} />
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">{item.label}</p>
              <h3 className={cn("text-3xl font-display font-black transition-colors", item.color)}>{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Audits Feed Section */}
        <div className="space-y-6">
          {loading ? (
            <div className="glass-card p-20 text-center rounded-[2.5rem] border-white/5 backdrop-blur-xl">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-brand-primary/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="h-12 w-12 text-brand-primary relative z-10 animate-spin" />
              </div>
              <p className="text-white/40 font-display font-black uppercase tracking-[0.2em] text-xs">Synchronisation des Audits...</p>
            </div>
          ) : filteredAudits.length === 0 ? (
            <div className="glass-card p-20 text-center rounded-[2.5rem] border-white/5 backdrop-blur-xl">
              <FileBarChart2 className="h-20 w-20 text-white/5 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-black text-white mb-2">Silence Radio</h3>
              <p className="text-white/40 font-display font-medium text-lg mb-8">
                {searchTerm || statusFilter !== 'all'
                  ? 'Aucun résultat ne correspond à votre recherche.'
                  : 'Votre liste d\'audits est vide. Commençons par analyser un dataset.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  size="lg"
                  onClick={() => router.push('/dashboard/upload')}
                  className="h-14 px-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-display font-black uppercase text-[11px] tracking-[0.2em]"
                >
                  <Plus className="h-5 w-5 mr-3 text-brand-primary" />
                  Initialiser un Audit
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="glass-card hover:bg-white/5 border-white/5 hover:border-brand-primary/40 rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden group/audit relative flex flex-col h-full"
                  onClick={() => router.push(`/dashboard/audits/${audit.id}`)}
                >
                  {/* Hover Glow Gradient */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-0 group-hover/audit:opacity-100 transition-opacity duration-700" />

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {getStatusBadge(audit.status)}
                        {audit.risk_level && getRiskBadge(audit.risk_level)}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white/5 hover:bg-brand-primary/10 text-white/20 hover:text-brand-primary transition-all"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/audits/${audit.id}`)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          {audit.status === 'completed' && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-xl text-white/40 hover:text-brand-primary hover:bg-brand-primary/10"
                              onClick={(e) => downloadReport(e, audit, 'pdf')}
                              disabled={downloading === audit.id}
                              title="Télécharger le rapport PDF"
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
                            className="h-8 w-8 rounded-xl text-white/40 hover:text-red-500 hover:bg-red-500/10"
                            onClick={(e) => handleDeleteAudit(e, audit.id)}
                            title="Supprimer l'audit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-display font-black text-white group-hover/audit:text-brand-primary transition-colors mb-2 line-clamp-1" title={audit.audit_name}>
                      {audit.audit_name || 'Analyse non identifiée'}
                    </h3>

                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                      <Clock className="h-3 w-3 text-white/20" />
                      <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      {audit.overall_score !== null && audit.overall_score !== undefined ? (
                        <div>
                          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Score</p>
                          <div className={cn(
                            "text-2xl font-display font-black leading-none",
                            audit.overall_score >= 80 ? "text-green-500" :
                              audit.overall_score >= 60 ? "text-orange-500" : "text-red-500"
                          )}>
                            {Math.round(audit.overall_score)}%
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Non calculé</p>
                        </div>
                      )}

                      {audit.critical_bias_count > 0 && (
                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold" title={`${audit.critical_bias_count} biais critiques`}>
                          <AlertTriangle className="h-4 w-4" />
                          <span>{audit.critical_bias_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </DashboardShell>
  )
}
