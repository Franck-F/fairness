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
  Camera,
  Rocket,
  Zap,
  HardDrive
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
      <div className="space-y-10 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header Section */}
        <div className="glass-card rounded-[3rem] border-white/5 bg-white/5 overflow-hidden p-8 md:p-12 relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <User className="h-64 w-64 text-brand-primary" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-primary via-brand-cotton to-brand-primary opacity-20 group-hover:opacity-40 transition-opacity blur-lg" />
              <Avatar className="h-32 w-32 border-4 border-white/10 relative">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-4xl bg-[#0A0A0B] text-brand-primary font-display font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center border-4 border-[#0A0A0B] hover:scale-110 transition-transform">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                  {profile.fullName || 'Data Explorer'}
                </h1>
                <p className="text-white/40 font-display font-medium text-lg flex items-center justify-center md:justify-start gap-2 italic">
                  <Mail className="h-4 w-4 text-brand-primary" />
                  {profile.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <Badge className="bg-brand-primary text-white border-none font-black uppercase text-[9px] tracking-[0.15em] px-4 py-1.5 h-auto">Expert Auditor</Badge>
                <div className="flex items-center gap-2 text-white/30 font-display font-black uppercase text-[10px] tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                  <Calendar className="h-3 w-3 text-brand-cotton" />
                  Depuis {new Date(stats.memberSince).getFullYear()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="glass-card px-8 py-6 rounded-3xl border-white/5 bg-white/5 text-center min-w-[140px] hover:bg-white/10 transition-colors">
                <div className="text-3xl font-display font-black text-brand-primary">{stats.auditsCount}</div>
                <div className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-1">Audits</div>
              </div>
              <div className="glass-card px-8 py-6 rounded-3xl border-white/5 bg-white/5 text-center min-w-[140px] hover:bg-white/10 transition-colors">
                <div className="text-3xl font-display font-black text-brand-cotton">{stats.datasetsCount}</div>
                <div className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-1">Datasets</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-10">
          <div className="flex justify-center">
            <TabsList className="bg-white/5 border border-white/10 p-1.5 h-16 rounded-2xl gap-2">
              {[
                { val: 'profile', label: 'Identité', icon: User },
                { val: 'notifications', label: 'Alertes', icon: Bell },
                { val: 'security', label: 'Confiance', icon: Shield },
                { val: 'billing', label: 'Privilèges', icon: CreditCard }
              ].map(t => (
                <TabsTrigger
                  key={t.val}
                  value={t.val}
                  className="px-8 flex items-center gap-3 data-[state=active]:bg-brand-primary data-[state=active]:text-white rounded-xl transition-all font-display font-black uppercase text-[10px] tracking-widest"
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                <div className="px-10 py-8 border-b border-white/5">
                  <h3 className="text-xl font-display font-black text-white">Détails de l'Entité</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Configurez votre signature professionnelle</p>
                </div>
                <div className="p-10 space-y-10">
                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nom Complet</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <Input
                          value={profile.fullName}
                          onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                          className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 opacity-60">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">E-mail (Protégé)</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
                        <Input value={profile.email} disabled className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white/50 cursor-not-allowed" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Téléphone</Label>
                      <div className="relative group">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+33 6 ..."
                          className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Localisation Hub</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          placeholder="Paris, France"
                          className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Organisation</Label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <Input
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Fonction</Label>
                      <div className="relative group">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
                        <Input
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                          className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full h-16 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-brand-primary/20 transition-all"
                  >
                    {loading ? (
                      <><Loader2 className="h-5 w-5 mr-3 animate-spin" /> Mise à jour en cours...</>
                    ) : (
                      'Sauvegarder les Paramètres'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card rounded-[2.5rem] border-white/5 p-10 space-y-8">
                <div>
                  <h3 className="text-xl font-display font-black text-white">Canaux de Transmission</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Orchestrez vos flux d'information</p>
                </div>

                <div className="grid gap-4">
                  {[
                    { key: 'emailNotifications', label: 'E-mail Broadcast', desc: 'Alertes système et communications critiques', icon: Mail },
                    { key: 'auditAlerts', label: 'Pulse d\'Audit', desc: 'Rapports de complétion et détection de biais', icon: CheckCircle2 },
                    { key: 'weeklyReports', label: 'Synthèse Hebdomadaire', desc: 'Rétrospective de performance IA', icon: Calendar }
                  ].map(pref => (
                    <div key={pref.key} className="glass-card p-6 rounded-3xl border-white/5 bg-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all text-brand-primary">
                          <pref.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display font-black text-white text-sm uppercase tracking-wider">{pref.label}</p>
                          <p className="text-xs text-white/40 font-display font-medium mt-1">{pref.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences[pref.key]}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, [pref.key]: checked })}
                        className="data-[state=checked]:bg-brand-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-black text-white">Contrôle d'Accès</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Renforcez votre périmètre de sécurité</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-cotton/10 border border-brand-cotton/20 flex items-center justify-center text-brand-cotton">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5 flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-brand-primary transition-colors">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display font-black text-white text-sm uppercase">Réinitialisation Clé</p>
                      <p className="text-xs text-white/40 font-display font-medium mt-1 italic">Actualisez votre mot de passe via e-mail crypté</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/10 hover:border-brand-primary/40 hover:bg-brand-primary/10 rounded-xl px-8 h-12 font-display font-black uppercase text-[10px] tracking-widest" onClick={handlePasswordReset}>
                    Actualiser
                  </Button>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60 ml-1">Zone de Révocation</p>
                  <div className="glass-card p-8 rounded-3xl border-red-500/10 bg-red-500/5 flex items-center justify-between group hover:bg-red-500/10 transition-all border-dashed border-2">
                    <div className="flex items-center gap-6">
                      <AlertTriangle className="h-10 w-10 text-red-500/40 group-hover:text-red-500 transition-colors" />
                      <div>
                        <p className="font-display font-black text-red-400 text-sm uppercase">Suppression de l'Identité</p>
                        <p className="text-xs text-red-400/40 font-display font-medium mt-1">Action irréversible : effacement total des données</p>
                      </div>
                    </div>
                    <Button variant="destructive" className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl px-10 h-12 font-display font-black uppercase text-[10px] tracking-widest">
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card p-12 rounded-[3rem] border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 via-brand-cotton/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform group-hover:scale-110 duration-700">
                  <Rocket className="h-48 w-48 text-brand-primary" />
                </div>

                <div className="relative space-y-10">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-brand-primary text-white font-black uppercase text-[9px] px-4 py-1.5 rounded-full">Prochain Niveau</Badge>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-5xl font-display font-black text-white tracking-tighter">Édition <span className="text-brand-primary">Elite</span></h2>
                    <p className="text-white/40 font-display font-medium text-lg">Libérez toute la puissance de l'audit prédictif.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Audits Illimités', val: '∞', icon: Zap },
                      { label: 'Stockage Cloud', val: '50GB', icon: HardDrive },
                      { label: 'Support Prioritaire', val: '24/7', icon: Shield }
                    ].map((stat, i) => (
                      <div key={i} className="glass-card p-6 rounded-3xl border-white/10 bg-black/40 text-center space-y-1">
                        <stat.icon className="h-5 w-5 text-brand-cotton mx-auto mb-2" />
                        <p className="text-2xl font-display font-black text-white">{stat.val}</p>
                        <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full h-16 rounded-2xl bg-white text-[#0A0A0B] hover:bg-brand-cotton transition-all font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl">
                    Élever mon Accès
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
