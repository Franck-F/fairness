'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Download, Calendar, Loader2, FileBarChart, AlertTriangle, Search, Filter } from 'lucide-react'
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
      console.error('Error fetching audits:', error)
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

  const getRiskColor = (level) => {
    if (level === 'Low') return 'text-green-500'
    if (level === 'Medium') return 'text-yellow-500'
    return 'text-red-500'
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
      <div className="space-y-10 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-none">
              Gestion des <span className="text-brand-primary">Rapports</span>
            </h1>
            <p className="text-white/40 font-display font-medium text-xs max-w-2xl">
              Téléchargez les rapports d'audit de vos analyses de fairness terminées.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <Input
                placeholder="Rechercher un rapport..."
                className="pl-10 bg-white/5 border-white/10 rounded-2xl focus:ring-1 focus:ring-brand-primary transition-all text-[10px] h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10 rounded-2xl h-9 text-[10px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 text-brand-primary" />
                  <SelectValue placeholder="Niveau" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="compliant">Sains (Low)</SelectItem>
                <SelectItem value="warning">Attention (Med)</SelectItem>
                <SelectItem value="non-compliant">Critiques (High)</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-2xl border-white/5 bg-white/5">
              <div className="w-2 h-2 rounded-full bg-brand-cotton animate-pulse" />
              <span className="text-[9px] text-white/60 font-black uppercase tracking-widest font-display">
                {filteredAudits.length} disponible(s)
              </span>
            </div>
          </div>
        </div>

        {/* Stats from real data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          {[
            { label: 'Audits Terminés', val: audits.length.toString(), color: 'text-brand-primary' },
            { label: 'Score Moyen', val: audits.length > 0 ? `${Math.round(audits.reduce((s, a) => s + (a.overall_score || 0), 0) / audits.length)}%` : '--', color: 'text-brand-cotton' },
            { label: 'Biais Détectés', val: audits.filter(a => a.bias_detected).length.toString(), color: audits.some(a => a.bias_detected) ? 'text-red-500' : 'text-green-500' },
            { label: 'Dernière Analyse', val: audits.length > 0 ? new Date(audits[0].completed_at || audits[0].created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '--', color: 'text-white/40' }
          ].map((s, i) => (
            <div key={i} className="glass-card p-3 rounded-xl border-white/5 bg-white/5 text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">{s.label}</p>
              <p className={cn("text-sm font-display font-black", s.color)}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && audits.length === 0 && (
          <div className="glass-card p-12 text-center rounded-[3rem] border-white/5 border-dashed bg-transparent border-2">
            <FileBarChart className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-display font-black text-white/40 mb-2">Aucun rapport disponible</h3>
            <p className="text-white/20 font-display font-medium text-sm max-w-md mx-auto">
              Lancez un audit depuis la page Upload pour générer votre premier rapport d'analyse de fairness.
            </p>
          </div>
        )}

        {/* Reports Grid — Real Data */}
        {!loading && filteredAudits.length > 0 && (
          <div className="grid gap-4 px-4">
            {filteredAudits.map((audit) => (
              <div
                key={audit.id}
                className="glass-card rounded-3xl border-white/5 overflow-hidden hover:border-brand-primary/40 transition-all duration-500 group/report relative bg-white/5"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl group-hover/report:bg-brand-primary/10 transition-all" />

                <div className="p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 group-hover/report:scale-110 transition-transform duration-500">
                        <FileText className="h-8 w-8 text-brand-primary" />
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-lg font-display font-black text-white group-hover/report:text-brand-primary transition-colors">
                          {audit.audit_name}
                        </h3>
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/30">
                          <Badge className={cn(
                            "text-[9px] font-black border",
                            audit.risk_level === 'Low' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                              audit.risk_level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                'bg-red-500/10 text-red-500 border-red-500/20'
                          )}>
                            Score: {audit.overall_score || 0}%
                          </Badge>
                          <div className="flex items-center gap-2">
                            {audit.bias_detected ? (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            ) : null}
                            <span className={audit.bias_detected ? 'text-red-400' : 'text-green-400'}>
                              {audit.bias_detected ? 'Biais détecté' : 'Modèle sain'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-white/20" />
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
                        className="h-12 px-6 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-display font-black uppercase text-[10px] tracking-[0.15em]"
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
                        className="h-12 px-8 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase text-[10px] tracking-[0.15em] shadow-lg shadow-brand-primary/20"
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
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
