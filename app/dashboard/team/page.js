'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/dashboard/page-header'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Users, UserPlus, Mail, Shield, Trash2, Loader2, Crown, Rocket, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export default function TeamPage() {
  const { session, user } = useAuth()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('auditor')
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    if (session?.access_token) {
      fetchTeamMembers()
    }
  }, [session])

  const fetchTeamMembers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/team', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })
      const data = await response.json()
      if (data.members) {
        setMembers(data.members)
      }
    } catch (error) {
      // silently handle fetch errors
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error('Veuillez entrer un email')
      return
    }

    setInviting(true)
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Invitation envoyee a ${inviteEmail}`)
        setInviteEmail('')
        fetchTeamMembers()
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi de l\'invitation')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'invitation')
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(`/api/team?memberId=${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })

      if (response.ok) {
        toast.success('Membre supprime')
        fetchTeamMembers()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      owner: 'bg-primary border-primary/20 text-primary-foreground',
      admin: 'bg-muted border-border text-foreground',
      auditor: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      viewer: 'bg-muted border-border text-muted-foreground',
    }
    const labels = {
      owner: 'Proprietaire',
      admin: 'Admin',
      auditor: 'Auditeur',
      viewer: 'Observateur',
    }
    return <Badge className={cn("font-display font-black uppercase tracking-tighter text-[9px]", styles[role] || styles.viewer)}>{labels[role] || role}</Badge>
  }

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-500/30 bg-orange-500/10 font-black uppercase text-[9px] tracking-tighter">
          En attente
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/10 font-black uppercase text-[9px] tracking-tighter">
        Actif
      </Badge>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <PageHeader
          title="Gestion de l'"
          titleHighlight="Equipe"
          description="Gerez les collaborateurs et les droits d'acces pour vos audits."
          icon={Users}
          actions={
            <div className="flex items-center gap-3 bg-muted px-5 py-3 rounded-xl border border-border">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-display">Espace collaboratif</span>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Team & Invite) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Invite Form Hub */}
            <Card className="overflow-hidden">
              <div className="px-10 py-8 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-black text-foreground">Nouveau Collaborateur</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Invitez un nouveau membre dans votre equipe</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail Professionnel</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@entreprise.ai"
                      className="h-14 rounded-xl font-display font-medium"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Attribution du Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="h-14 rounded-xl font-display font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur - Acces Complet</SelectItem>
                        <SelectItem value="auditor">Auditeur - Expert Analyse</SelectItem>
                        <SelectItem value="viewer">Observateur - Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleInvite}
                  className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase tracking-[0.2em] text-[11px] transition-all"
                  disabled={inviting}
                >
                  {inviting ? (
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  ) : (
                    <Mail className="h-5 w-5 mr-3" />
                  )}
                  Envoyer l'Invitation Officielle
                </Button>
              </div>
            </Card>

            {/* Team Members List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-display font-black text-foreground flex items-center gap-3">
                  Membres <span className="text-muted-foreground font-medium">({members.length + 1})</span>
                </h3>
                <div className="h-1 flex-1 mx-8 bg-border rounded-full" />
                <Badge variant="outline">{loading ? 'Synchronisation...' : 'A jour'}</Badge>
              </div>

              {/* Owner Entry */}
              <Card className="p-6 border-primary/20 bg-primary/5 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Crown className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-2xl font-display font-black text-foreground">{user?.email?.split('@')[0]}</h4>
                        <Badge className="bg-primary text-primary-foreground text-[9px] font-black uppercase">Owner</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-display font-medium mt-1">{user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status</p>
                    {getStatusBadge('active')}
                  </div>
                </div>
              </Card>

              {/* Others */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="font-display font-black uppercase tracking-widest text-[10px]">Synchronisation de l'equipe...</p>
                </div>
              ) : members.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Aucun collaborateur externe invite"
                  description="Seul on va vite, ensemble on va plus loin."
                />
              ) : (
                <div className="grid gap-4">
                  {members.map((member) => (
                    <Card key={member.id} className="p-4 hover:bg-accent transition-all group flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:border-primary/40 transition-colors">
                          <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-foreground text-lg">{member.full_name || member.email?.split('@')[0]}</h4>
                          <p className="text-xs text-muted-foreground font-display font-medium">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right flex flex-col items-end gap-1">
                          {getStatusBadge(member.status)}
                          {getRoleBadge(member.role)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all border border-transparent hover:border-destructive/20"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Roles Legend) */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="overflow-hidden">
              <div className="p-8 border-b border-border">
                <h3 className="text-xl font-display font-black text-foreground">Roles et acces</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Niveaux d'autorisation</p>
              </div>
              <div className="p-8 space-y-6">
                {[
                  { role: 'admin', desc: 'Gestion totale de la plateforme : audits, datasets et gouvernance equipe.', icon: Shield, color: 'text-muted-foreground' },
                  { role: 'auditor', desc: 'Expertise analyse : creation et gestion des audits, rapports et datasets.', icon: Rocket, color: 'text-primary' },
                  { role: 'viewer', desc: 'Consultation avancee : lecture seule des rapports et metriques auditees.', icon: Eye, color: 'text-muted-foreground' }
                ].map((r, i) => (
                  <Card key={i} className="p-4 space-y-3 hover:border-border transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border", r.color)}>
                        <r.icon className="h-4 w-4" />
                      </div>
                      {getRoleBadge(r.role)}
                    </div>
                    <p className="text-xs text-muted-foreground font-display font-medium leading-relaxed group-hover:text-foreground/60 transition-colors">{r.desc}</p>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Premium Team Tip */}
            <Card className="p-8 border-primary/20 bg-primary/5 text-center group">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Conseil Expert</p>
              <p className="text-xs text-muted-foreground font-display font-medium leading-relaxed">
                Maintenez un ratio de 1 Admin pour 5 Utilisateurs pour une securite optimale.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
