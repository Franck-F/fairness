'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
      console.error('Error fetching team:', error)
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
      console.error('Invite error:', error)
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
      console.error('Remove error:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      owner: 'bg-brand-primary border-brand-primary/20 text-white',
      admin: 'bg-brand-cotton border-brand-cotton/20 text-[#0A0A0B]',
      auditor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      viewer: 'bg-white/5 border-white/10 text-white/40',
    }
    const labels = {
      owner: 'Propriétaire',
      admin: 'Admin',
      auditor: 'Auditeur',
      viewer: 'Observateur',
    }
    return <Badge className={cn("font-display font-black uppercase tracking-tighter text-[9px]", styles[role] || styles.viewer)}>{labels[role] || role}</Badge>
  }

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return (
        <Badge variant="outline" className="text-orange-400 border-orange-500/30 bg-orange-500/10 font-black uppercase text-[9px] tracking-tighter">
          En attente
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-brand-cotton border-brand-cotton/30 bg-brand-cotton/10 font-black uppercase text-[9px] tracking-tighter">
        Actif
      </Badge>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
              Gestion de l'<span className="text-brand-primary">Équipe</span>
            </h1>
            <p className="text-white/40 font-display font-medium text-lg max-w-2xl">
              Gérez les collaborateurs et définissez les protocoles d'accès pour vos audits de fairness.
            </p>
          </div>
          <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-2xl border-white/5 bg-white/5">
            <Users className="h-4 w-4 text-brand-primary" />
            <span className="text-[10px] text-white/60 font-black uppercase tracking-widest font-display">Hub Collaboratif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content (Team & Invite) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Invite Form Hub */}
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden bg-white/5">
              <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-black text-white">Nouveau Collaborateur</h2>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Propulsez votre équipe vers l'excellence</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">E-mail Professionnel</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@entreprise.ai"
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-brand-primary focus:border-brand-primary transition-all font-display font-medium text-white placeholder:text-white/10"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Attribution du Rôle</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10">
                        <SelectItem value="admin">Administrateur • Accès Complet</SelectItem>
                        <SelectItem value="auditor">Auditeur • Expert Analyse</SelectItem>
                        <SelectItem value="viewer">Observateur • Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleInvite}
                  className="w-full h-14 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
            </div>

            {/* Team Members List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xl font-display font-black text-white flex items-center gap-3">
                  Membres <span className="text-white/20 font-medium">({members.length + 1})</span>
                </h3>
                <div className="h-1 flex-1 mx-8 bg-white/5 rounded-full" />
                <Badge className="bg-white/5 text-white/40 border-white/10">{loading ? 'Syncing...' : 'Synced'}</Badge>
              </div>

              {/* Owner Entry */}
              <div className="glass-card p-6 rounded-[2rem] border-white/10 bg-gradient-to-r from-brand-primary/5 to-transparent relative group">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Shield className="h-12 w-12 text-brand-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center shadow-lg">
                      <Crown className="h-8 w-8 text-brand-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-2xl font-display font-black text-white">{user?.email?.split('@')[0]}</h4>
                        <Badge className="bg-brand-primary text-white text-[9px] font-black uppercase">Owner</Badge>
                      </div>
                      <p className="text-sm text-white/40 font-display font-medium mt-1">{user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">Status</p>
                    {getStatusBadge('active')}
                  </div>
                </div>
              </div>

              {/* Others */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                  <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
                  <p className="font-display font-black uppercase tracking-widest text-[10px]">Synchronisation de l'équipe...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="glass-card p-12 text-center rounded-[2rem] border-white/5 bg-white/5 border-dashed border-2">
                  <Users className="h-16 w-16 mx-auto mb-6 text-white/10" />
                  <p className="text-white/40 font-display font-medium text-lg italic">"Seul on va vite, ensemble on va plus loin."</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-4">Aucun collaborateur externe invite</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="glass-card p-5 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all group flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-primary/40 transition-colors">
                          <Users className="h-6 w-6 text-white/20 group-hover:text-brand-primary" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-white text-lg">{member.full_name || member.email?.split('@')[0]}</h4>
                          <p className="text-xs text-white/30 font-display font-medium">{member.email}</p>
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
                          className="h-12 w-12 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-white/20 transition-all border border-transparent hover:border-red-500/20"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Roles Legend) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-[2.5rem] border-white/5 bg-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-xl font-display font-black text-white">Hiérarchie des Accès</h3>
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Gouvernance AuditIQ</p>
              </div>
              <div className="p-8 space-y-6">
                {[
                  { role: 'admin', desc: 'Gestion totale de la plateforme : audits, datasets et gouvernance équipe.', icon: Shield, color: 'text-brand-cotton' },
                  { role: 'auditor', desc: 'Expertise analyse : création et gestion des audits, rapports et datasets.', icon: Rocket, color: 'text-brand-primary' },
                  { role: 'viewer', desc: 'Consultation avancée : lecture seule des rapports et métriques auditées.', icon: Eye, color: 'text-white/40' }
                ].map((r, i) => (
                  <div key={i} className="space-y-3 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/5", r.color)}>
                        <r.icon className="h-4 w-4" />
                      </div>
                      {getRoleBadge(r.role)}
                    </div>
                    <p className="text-xs text-white/40 font-display font-medium leading-relaxed group-hover:text-white/60 transition-colors">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Team Tip */}
            <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-brand-primary/5 text-center group">
              <Shield className="h-10 w-10 text-brand-primary mx-auto mb-4 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-2">Conseil Expert</p>
              <p className="text-xs text-white/40 font-display font-medium leading-relaxed">
                Maintenez un ratio de 1 Admin pour 5 Utilisateurs pour une sécurité optimale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
