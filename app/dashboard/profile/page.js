'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  CreditCard, 
  Upload, 
  Mail,
  Calendar,
  MapPin,
  Globe,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Camera
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { user, session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    location: '',
    website: '',
    timezone: 'Europe/Paris',
    language: 'fr',
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    auditAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  })

  const [stats, setStats] = useState({
    auditsCount: 0,
    datasetsCount: 0,
    memberSince: null,
  })

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
      }))
      setStats(prev => ({
        ...prev,
        memberSince: user.created_at,
      }))
      loadUserStats()
    }
  }, [user])

  const loadUserStats = async () => {
    if (!session?.access_token) return
    
    try {
      // Load audits count
      const { count: auditsCount } = await supabase
        .from('audits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      
      // Load datasets count
      const { count: datasetsCount } = await supabase
        .from('datasets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      
      setStats(prev => ({
        ...prev,
        auditsCount: auditsCount || 0,
        datasetsCount: datasetsCount || 0,
      }))
    } catch (error) {
      console.error('Error loading stats:', error)
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
          website: profile.website,
          timezone: profile.timezone,
          language: profile.language,
        }
      })

      if (error) throw error
      toast.success('Profil mis a jour avec succes')
    } catch (error) {
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
    } catch (error) {
      toast.error('Erreur lors de l\'envoi')
    }
  }

  const initials = profile.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.fullName || 'Mon Profil'}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
              {stats.memberSince && (
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  Membre depuis {new Date(stats.memberSince).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Card className="px-6 py-4 bg-card">
              <div className="text-2xl font-bold text-primary">{stats.auditsCount}</div>
              <div className="text-xs text-muted-foreground">Audits</div>
            </Card>
            <Card className="px-6 py-4 bg-card">
              <div className="text-2xl font-bold text-primary">{stats.datasetsCount}</div>
              <div className="text-xs text-muted-foreground">Datasets</div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Securite</TabsTrigger>
            <TabsTrigger value="billing">Abonnement</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos informations de base visibles sur votre profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={profile.email} 
                      disabled 
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Telephone
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Paris, France"
                      className="bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Informations professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Nom de votre entreprise"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Poste</Label>
                    <Input
                      id="role"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="Data Scientist, ML Engineer..."
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Site web
                    </Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://votre-site.com"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT)</SelectItem>
                        <SelectItem value="America/New_York">New York (EST)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Los Angeles (PST)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sauvegarde...</>
                  ) : (
                    'Sauvegarder les modifications'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Preferences de notification
                </CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez etre notifie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Notifications par email</p>
                      <p className="text-sm text-muted-foreground">Recevez des emails pour les evenements importants</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Alertes d'audit</p>
                      <p className="text-sm text-muted-foreground">Notifications quand un audit est termine</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.auditAlerts}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, auditAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Rapports hebdomadaires</p>
                      <p className="text-sm text-muted-foreground">Resume hebdomadaire de vos audits par email</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Emails marketing</p>
                      <p className="text-sm text-muted-foreground">Nouveautes, conseils et mises a jour produit</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, marketingEmails: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Mot de passe
                </CardTitle>
                <CardDescription>
                  Gerez votre mot de passe de connexion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">Changer le mot de passe</p>
                    <p className="text-sm text-muted-foreground">Un email sera envoye a {profile.email}</p>
                  </div>
                  <Button variant="outline" onClick={handlePasswordReset}>
                    Reinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Authentification a deux facteurs
                </CardTitle>
                <CardDescription>
                  Ajoutez une couche de securite supplementaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Application d'authentification</p>
                      <p className="text-sm text-muted-foreground">Utilisez une app comme Google Authenticator</p>
                    </div>
                  </div>
                  <Badge variant="outline">Bientot disponible</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-500">Zone de danger</CardTitle>
                <CardDescription>
                  Actions irreversibles sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10">
                  <div>
                    <p className="font-medium">Supprimer mon compte</p>
                    <p className="text-sm text-muted-foreground">Cette action est irreversible</p>
                  </div>
                  <Button variant="destructive">Supprimer</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Abonnement actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 rounded-lg bg-primary/10 border border-primary/20">
                  <div>
                    <Badge className="mb-2">Plan Actuel</Badge>
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-muted-foreground">Gratuit - 5 audits/mois</p>
                  </div>
                  <Button>Passer a Pro</Button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <div className="text-2xl font-bold">{stats.auditsCount}/5</div>
                    <div className="text-sm text-muted-foreground">Audits ce mois</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <div className="text-2xl font-bold">{stats.datasetsCount}</div>
                    <div className="text-sm text-muted-foreground">Datasets</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-sm text-muted-foreground">Metriques</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
