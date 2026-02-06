'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, Mail, Shield, Trash2, Loader2, Crown } from 'lucide-react'
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
      owner: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-purple-100 text-purple-800',
      auditor: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    }
    const labels = {
      owner: 'Proprietaire',
      admin: 'Admin',
      auditor: 'Auditeur',
      viewer: 'Observateur',
    }
    return <Badge className={styles[role] || styles.viewer}>{labels[role] || role}</Badge>
  }

  const getStatusBadge = (status) => {
    if (status === 'pending') {
      return <Badge variant="outline" className="text-orange-600 border-orange-300">En attente</Badge>
    }
    return <Badge variant="outline" className="text-green-600 border-green-300">Actif</Badge>
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Equipe</h1>
          <p className="text-muted-foreground mt-1">
            Invitez et gerez les membres de votre equipe
          </p>
        </div>

        {/* Invite Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Inviter un Membre
            </CardTitle>
            <CardDescription>
              Envoyez une invitation par email pour ajouter un nouveau membre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="membre@exemple.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Acces complet</SelectItem>
                    <SelectItem value="auditor">Auditeur - Creer et gerer les audits</SelectItem>
                    <SelectItem value="viewer">Observateur - Lecture seule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleInvite} className="w-full" disabled={inviting}>
                  {inviting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Envoyer l'invitation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User (Owner) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Proprietaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold">{user?.email}</h4>
                  <p className="text-sm text-muted-foreground">Vous (Proprietaire)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getRoleBadge('owner')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membres de l'Equipe
            </CardTitle>
            <CardDescription>
              {members.length} membre(s) invite(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun membre invite pour le moment</p>
                <p className="text-sm">Utilisez le formulaire ci-dessus pour inviter des collaborateurs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.full_name || member.email}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(member.status)}
                      {getRoleBadge(member.role)}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Roles Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Description des Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getRoleBadge('admin')}
                </div>
                <h4 className="font-semibold mb-1">Admin</h4>
                <p className="text-sm text-muted-foreground">
                  Acces complet: gestion des audits, datasets, equipe et parametres
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getRoleBadge('auditor')}
                </div>
                <h4 className="font-semibold mb-1">Auditeur</h4>
                <p className="text-sm text-muted-foreground">
                  Peut creer et gerer les audits, uploader des datasets, generer des rapports
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getRoleBadge('viewer')}
                </div>
                <h4 className="font-semibold mb-1">Observateur</h4>
                <p className="text-sm text-muted-foreground">
                  Lecture seule: peut consulter les audits et rapports sans modifier
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
