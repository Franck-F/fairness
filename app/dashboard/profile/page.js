'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Calendar,
  MapPin,
  Smartphone,
  Key,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Camera,
  Rocket,
  Zap,
  HardDrive,
  FileBarChart2,
  Database,
  Brain,
  FolderOpen,
  Clock,
  TrendingUp,
  ExternalLink,
  BarChart3,
  Sparkles,
  Eye,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, session } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    location: '',
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    auditAlerts: true,
    weeklyReports: false,
  })

  const [stats, setStats] = useState({
    auditsCount: 0,
    datasetsCount: 0,
    projectsCount: 0,
    reportsCount: 0,
    completedAudits: 0,
    avgScore: 0,
    memberSince: null,
  })

  const [audits, setAudits] = useState([])
  const [datasets, setDatasets] = useState([])
  const [dsProjects, setDsProjects] = useState([])

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {}
      setProfile({
        fullName: meta.full_name || '',
        email: user.email || '',
        company: meta.company || '',
        role: meta.role || '',
        phone: meta.phone || '',
        location: meta.location || '',
      })
      setAvatarUrl(user.user_metadata?.avatar_url || null)
      setStats(prev => ({ ...prev, memberSince: user.created_at }))
      loadAllData()
    }
  }, [user])

  const loadAllData = async () => {
    if (!session?.access_token) return
    setLoadingProjects(true)

    try {
      const headers = { 'Authorization': `Bearer ${session.access_token}` }

      const [auditsRes, datasetsRes, projectsRes] = await Promise.all([
        fetch('/api/audits', { headers }).then(r => r.ok ? r.json() : { audits: [] }),
        fetch('/api/datasets', { headers }).then(r => r.ok ? r.json() : { datasets: [] }),
        fetch('/api/ds/projects', { headers }).then(r => r.ok ? r.json() : { projects: [] }),
      ])

      const allAudits = auditsRes.audits || []
      const allDatasets = datasetsRes.datasets || []
      const allProjects = projectsRes.projects || []

      setAudits(allAudits)
      setDatasets(allDatasets)
      setDsProjects(allProjects)

      const completed = allAudits.filter(a => a.status === 'completed')
      const avgScore = completed.length > 0
        ? Math.round(completed.reduce((s, a) => s + (a.overall_score || 0), 0) / completed.length)
        : 0

      setStats(prev => ({
        ...prev,
        auditsCount: allAudits.length,
        datasetsCount: allDatasets.length,
        projectsCount: allProjects.length,
        completedAudits: completed.length,
        avgScore,
      }))
    } catch {
      // silently handle
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          company: profile.company,
          role: profile.role,
          phone: profile.phone,
          location: profile.location,
        }
      })
      if (error) throw error
      toast.success('Profil mis a jour avec succes')
    } catch {
      toast.error('Erreur lors de la mise a jour')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success('Email de reinitialisation envoye')
    } catch {
      toast.error("Erreur lors de l'envoi")
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    try {
      const token = session?.access_token
      if (!token) throw new Error('Session expiree')

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur upload')

      setAvatarUrl(data.avatar_url)

      // Also update via client to refresh the session
      await supabase.auth.updateUser({ data: { avatar_url: data.avatar_url } })

      toast.success('Photo de profil mise a jour')
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'upload')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'SUPPRIMER') return

    setDeleting(true)
    try {
      // Sign out and clear session
      await supabase.auth.signOut()
      toast.success('Compte deconnecte. Contactez le support pour la suppression definitive.')
      router.push('/')
    } catch {
      toast.error('Erreur lors de la deconnexion')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const initials = profile.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  const getStatusBadge = (status) => {
    if (status === 'completed') return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 border text-[10px]">Termine</Badge>
    if (status === 'processing') return <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 border text-[10px]">En cours</Badge>
    if (status === 'failed') return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 border text-[10px]">Echoue</Badge>
    return <Badge variant="outline" className="text-[10px]">En attente</Badge>
  }

  const getRiskBadge = (level) => {
    if (level === 'Low') return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 border text-[10px]">Faible</Badge>
    if (level === 'Medium') return <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 border text-[10px]">Moyen</Badge>
    if (level === 'High') return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 border text-[10px]">Eleve</Badge>
    return null
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const totalProjects = stats.auditsCount + stats.datasetsCount + stats.projectsCount

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Profile Header */}
        <Card className="overflow-hidden p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-border">
                <AvatarImage src={avatarUrl || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-3xl bg-muted text-primary font-display font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-1 right-1 w-9 h-9 bg-primary rounded-full flex items-center justify-center border-4 border-background hover:scale-110 transition-transform disabled:opacity-50"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                )}
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight">
                  {profile.fullName || 'Utilisateur'}
                </h1>
                <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {profile.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {profile.company && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                    <Building2 className="h-3 w-3" />
                    {profile.company}
                  </div>
                )}
                {profile.role && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                    <Shield className="h-3 w-3" />
                    {profile.role}
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                  <Calendar className="h-3 w-3" />
                  Membre depuis {stats.memberSince ? new Date(stats.memberSince).getFullYear() : '--'}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <Card className="px-5 py-4 text-center min-w-[100px] hover:bg-accent transition-colors">
                <div className="text-2xl font-display font-bold text-primary">{stats.auditsCount}</div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium tracking-wider mt-0.5">Audits</div>
              </Card>
              <Card className="px-5 py-4 text-center min-w-[100px] hover:bg-accent transition-colors">
                <div className="text-2xl font-display font-bold text-foreground">{stats.datasetsCount}</div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium tracking-wider mt-0.5">Datasets</div>
              </Card>
              <Card className="px-5 py-4 text-center min-w-[100px] hover:bg-accent transition-colors">
                <div className="text-2xl font-display font-bold text-foreground">{stats.projectsCount}</div>
                <div className="text-[9px] text-muted-foreground uppercase font-medium tracking-wider mt-0.5">Projets DS</div>
              </Card>
            </div>
          </div>

          {/* Score bar */}
          {stats.completedAudits > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Score moyen de fairness</span>
                <span className="text-sm font-display font-bold text-foreground">{stats.avgScore}%</span>
              </div>
              <Progress value={stats.avgScore} className="h-2" />
            </div>
          )}
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-muted border border-border p-1 h-auto rounded-xl gap-1 flex-wrap">
            {[
              { val: 'projects', label: 'Mes Projets', icon: FolderOpen },
              { val: 'profile', label: 'Identite', icon: User },
              { val: 'notifications', label: 'Alertes', icon: Bell },
              { val: 'security', label: 'Securite', icon: Shield },
              { val: 'billing', label: 'Abonnement', icon: CreditCard },
            ].map(t => (
              <TabsTrigger
                key={t.val}
                value={t.val}
                className="px-5 py-2.5 flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all font-display font-semibold text-xs"
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* === PROJECTS TAB === */}
          <TabsContent value="projects" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileBarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stats.auditsCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Audits Total</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stats.completedAudits}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Termines</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Database className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stats.datasetsCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Datasets</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Brain className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">{stats.projectsCount}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Projets DS</p>
                  </div>
                </div>
              </Card>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : totalProjects === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground">Aucun projet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Lancez votre premier audit ou importez un dataset pour commencer.
                </p>
                <Button asChild className="bg-primary text-primary-foreground rounded-xl">
                  <Link href="/dashboard/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Nouvel Audit
                  </Link>
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Audits Section */}
                {audits.length > 0 && (
                  <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileBarChart2 className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-display font-semibold text-foreground">Audits de Fairness</h3>
                        <Badge variant="outline" className="text-[10px]">{audits.length}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/audits">
                          Voir tout <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="divide-y divide-border">
                      {audits.slice(0, 8).map((audit) => (
                        <Link
                          key={audit.id}
                          href={`/dashboard/audits/${audit.id}`}
                          className="flex items-center gap-4 px-6 py-3.5 hover:bg-accent/50 transition-colors group"
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                            audit.status === 'completed'
                              ? audit.bias_detected ? "bg-orange-500/10" : "bg-green-500/10"
                              : audit.status === 'failed' ? "bg-red-500/10" : "bg-muted"
                          )}>
                            {audit.status === 'completed' ? (
                              audit.bias_detected
                                ? <AlertTriangle className="h-4 w-4 text-orange-500" />
                                : <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : audit.status === 'failed' ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {audit.audit_name}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px] text-muted-foreground">{audit.use_case || 'Audit'}</span>
                              {audit.dataset_name && (
                                <span className="text-[11px] text-muted-foreground/60 truncate max-w-[150px]">
                                  {audit.dataset_name}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {audit.status === 'completed' && audit.overall_score != null && (
                              <span className={cn(
                                "text-sm font-display font-bold",
                                audit.overall_score >= 80 ? "text-green-600 dark:text-green-400" :
                                audit.overall_score >= 60 ? "text-orange-600 dark:text-orange-400" :
                                "text-red-600 dark:text-red-400"
                              )}>
                                {audit.overall_score}%
                              </span>
                            )}
                            {getRiskBadge(audit.risk_level)}
                            {getStatusBadge(audit.status)}
                            <span className="text-[11px] text-muted-foreground/60 w-20 text-right hidden sm:block">
                              {formatDate(audit.completed_at || audit.created_at)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {audits.length > 8 && (
                      <div className="px-6 py-3 border-t border-border bg-muted/30 text-center">
                        <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                          <Link href="/dashboard/audits">
                            Voir les {audits.length - 8} audits restants
                          </Link>
                        </Button>
                      </div>
                    )}
                  </Card>
                )}

                {/* Datasets Section */}
                {datasets.length > 0 && (
                  <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-display font-semibold text-foreground">Datasets</h3>
                        <Badge variant="outline" className="text-[10px]">{datasets.length}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/upload">
                          Importer <Upload className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="divide-y divide-border">
                      {datasets.slice(0, 6).map((ds) => (
                        <div key={ds.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-accent/50 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Database className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {ds.original_filename || ds.filename}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {ds.rows_count && (
                                <span className="text-[11px] text-muted-foreground">{ds.rows_count.toLocaleString()} lignes</span>
                              )}
                              {ds.columns_count && (
                                <span className="text-[11px] text-muted-foreground">{ds.columns_count} colonnes</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] text-muted-foreground/60 shrink-0">
                            {formatDate(ds.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {datasets.length > 6 && (
                      <div className="px-6 py-3 border-t border-border bg-muted/30 text-center">
                        <span className="text-xs text-muted-foreground">+ {datasets.length - 6} autres datasets</span>
                      </div>
                    )}
                  </Card>
                )}

                {/* DS Projects Section */}
                {dsProjects.length > 0 && (
                  <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-border bg-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Brain className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-display font-semibold text-foreground">Projets Data Science</h3>
                        <Badge variant="outline" className="text-[10px]">{dsProjects.length}</Badge>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/data-science">
                          Ouvrir <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="divide-y divide-border">
                      {dsProjects.slice(0, 6).map((project) => (
                        <Link
                          key={project.id}
                          href="/dashboard/data-science"
                          className="flex items-center gap-4 px-6 py-3.5 hover:bg-accent/50 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {project.project_name}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {project.problem_type && (
                                <span className="text-[11px] text-muted-foreground">{project.problem_type}</span>
                              )}
                              {project.target_column && (
                                <span className="text-[11px] text-muted-foreground/60">Cible: {project.target_column}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Badge variant="outline" className="text-[10px] capitalize">{project.status || 'active'}</Badge>
                            <span className="text-[11px] text-muted-foreground/60 hidden sm:block">
                              {formatDate(project.created_at)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* === PROFILE TAB === */}
          <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <div className="px-8 py-6 border-b border-border">
                <h3 className="text-lg font-display font-semibold text-foreground">Informations personnelles</h3>
                <p className="text-xs text-muted-foreground mt-1">Mettez a jour vos coordonnees</p>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground ml-1">Nom Complet</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="h-11 pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 opacity-60">
                    <Label className="text-xs font-medium text-muted-foreground ml-1">E-mail (protege)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                      <Input value={profile.email} disabled className="h-11 pl-10 rounded-xl cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground ml-1">Telephone</Label>
                    <div className="relative group">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+33 6 ..."
                        className="h-11 pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground ml-1">Localisation</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        placeholder="Paris, France"
                        className="h-11 pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground ml-1">Organisation</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        className="h-11 pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground ml-1">Fonction</Label>
                    <div className="relative group">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="h-11 pl-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold text-sm"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Mise a jour...</>
                  ) : (
                    'Sauvegarder'
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* === NOTIFICATIONS TAB === */}
          <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8 space-y-6">
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground mt-1">Gerez vos preferences de notification</p>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Notifications par e-mail', desc: 'Alertes et communications importantes', icon: Mail },
                  { key: 'auditAlerts', label: "Alertes d'audit", desc: 'Rapports de completion et detection de biais', icon: CheckCircle2 },
                  { key: 'weeklyReports', label: 'Synthese hebdomadaire', desc: 'Resume hebdomadaire de vos audits', icon: Calendar },
                ].map(pref => (
                  <Card key={pref.key} className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <pref.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{pref.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[pref.key]}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, [pref.key]: checked })}
                    />
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* === SECURITY TAB === */}
          <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground">Securite du compte</h3>
                <p className="text-xs text-muted-foreground mt-1">Gerez votre mot de passe et la securite</p>
              </div>

              <Card className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Reinitialiser le mot de passe</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Recevez un lien par e-mail</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl text-xs" onClick={handlePasswordReset}>
                  Envoyer le lien
                </Button>
              </Card>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-medium text-destructive/60 ml-1">Zone dangereuse</p>
                <Card className="p-5 border-destructive/20 bg-destructive/5 flex items-center justify-between border-dashed border-2">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-8 w-8 text-destructive/40" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Supprimer le compte</p>
                      <p className="text-xs text-destructive/60 mt-0.5">Suppression permanente de toutes les donnees</p>
                    </div>
                  </div>
                  <Button variant="destructive" className="rounded-xl text-xs" onClick={() => setShowDeleteDialog(true)}>
                    Supprimer
                  </Button>
                </Card>
              </div>
            </Card>
          </TabsContent>

          {/* === BILLING TAB === */}
          <TabsContent value="billing" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-10 border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Rocket className="h-40 w-40 text-primary" />
              </div>
              <div className="relative space-y-8">
                <Badge className="bg-primary text-primary-foreground text-[10px] px-3 py-1 rounded-full">Offre Premium</Badge>
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground">Plan <span className="text-primary">Premium</span></h2>
                  <p className="text-muted-foreground mt-1">Accedez a toutes les fonctionnalites avancees.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Audits Illimites', val: '\u221E', icon: Zap },
                    { label: 'Stockage Cloud', val: '50GB', icon: HardDrive },
                    { label: 'Support Prioritaire', val: '24/7', icon: Shield },
                  ].map((s, i) => (
                    <Card key={i} className="p-5 bg-muted text-center space-y-1">
                      <s.icon className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xl font-display font-bold text-foreground">{s.val}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    </Card>
                  ))}
                </div>
                <Button
                  asChild
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm"
                >
                  <Link href="/pricing">
                    <Rocket className="h-4 w-4 mr-2" />
                    Passer au Premium
                  </Link>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Account Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Supprimer le compte
              </DialogTitle>
              <DialogDescription className="pt-2">
                Cette action est irreversible. Toutes vos donnees, audits, datasets et projets seront definitivement supprimes.
                Tapez <strong className="text-foreground">SUPPRIMER</strong> pour confirmer.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Tapez SUPPRIMER"
              className="rounded-xl"
            />
            <DialogFooter className="gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText('') }}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl"
                disabled={deleteConfirmText !== 'SUPPRIMER' || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Suppression...</>
                ) : (
                  'Confirmer la suppression'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
