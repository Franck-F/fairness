'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileBarChart2,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  Trash2,
  Eye,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export default function AuditsPage() {
  const router = useRouter()
  const { session } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    medium: 0,
    low: 0,
    averageScore: 0,
  })

  useEffect(() => {
    if (session?.access_token) {
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

  const deleteAudit = async (id, e) => {
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
    const matchesSearch = audit.audit_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mes Audits</h1>
            <p className="text-muted-foreground mt-1">
              Gerez et consultez vos audits de fairness IA
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/upload')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Audit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">audits realises</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Risque Eleve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
              <p className="text-xs text-muted-foreground">necessite action</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Risque Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.medium}</div>
              <p className="text-xs text-muted-foreground">a surveiller</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Score Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">d'equite globale</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un audit..."
                  className="pl-10 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Termines</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Echoues</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadAudits}>
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audits List */}
        {loading ? (
          <Card className="bg-card">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <p className="text-muted-foreground mt-4">Chargement des audits...</p>
            </CardContent>
          </Card>
        ) : filteredAudits.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="p-12 text-center">
              <FileBarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun audit trouve</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Essayez une autre recherche ou filtre' 
                  : 'Creez votre premier audit pour commencer'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => router.push('/dashboard/upload')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Creer un audit
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAudits.map((audit) => (
              <Card
                key={audit.id}
                className="bg-card hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/audits/${audit.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{audit.audit_name || 'Audit sans nom'}</h3>
                        {getStatusBadge(audit.status)}
                        {audit.risk_level && getRiskBadge(audit.risk_level)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{audit.use_case || 'General'}</span>
                        <span>-</span>
                        <span>
                          Cree le {new Date(audit.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        {audit.dataset_name && (
                          <>
                            <span>-</span>
                            <span>Dataset: {audit.dataset_name}</span>
                          </>
                        )}
                      </div>
                      {audit.bias_detected && audit.critical_bias_count > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{audit.critical_bias_count} biais critique(s) detecte(s)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {audit.overall_score !== null && audit.overall_score !== undefined && (
                        <div className="text-right mr-4">
                          <div className={cn(
                            "text-3xl font-bold",
                            audit.overall_score >= 80 ? "text-green-500" :
                            audit.overall_score >= 60 ? "text-orange-500" : "text-red-500"
                          )}>
                            {audit.overall_score}%
                          </div>
                          <p className="text-xs text-muted-foreground">Score d'equite</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/audits/${audit.id}`)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={(e) => deleteAudit(audit.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
