'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Database,
  Globe,
  Moon,
  Sun,
  Monitor,
  Zap,
  FileText,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Key,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  HardDrive,
  Clock,
  Languages,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { user, session } = useAuth()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    auditComplete: true,
    auditFailed: true,
    weeklyReports: false,
    biasAlerts: true,
    systemUpdates: true,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: true,
    showActivity: true,
    publicProfile: false,
  })

  const [auditSettings, setAuditSettings] = useState({
    defaultThreshold: 80,
    autoGenerateReports: true,
    includeRecommendations: true,
    reportFormat: 'pdf',
    retentionDays: 90,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveGeneral = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Parametres generaux sauvegardes')
    setLoading(false)
  }

  const handleSaveNotifications = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Preferences de notifications sauvegardees')
    setLoading(false)
  }

  const handleSaveAudit = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Parametres d\'audit sauvegardes')
    setLoading(false)
  }

  const handleExportData = () => {
    toast.success('Export de vos donnees en cours...')
  }

  const handleDeleteData = () => {
    if (confirm('Etes-vous sur de vouloir supprimer toutes vos donnees ? Cette action est irreversible.')) {
      toast.success('Demande de suppression envoyee')
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-10 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-none">
              Configurateur <span className="text-brand-primary">Système</span>
            </h1>
            <p className="text-white/40 font-display font-medium text-lg max-w-2xl">
              Personnalisez l'intelligence et l'esthétique de votre instance AuditIQ.
            </p>
          </div>
          <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-2xl border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-cotton animate-pulse" />
              <span className="text-[10px] text-white/60 font-black uppercase tracking-widest font-display">Synchronisé à AuditIQ</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-10">
          <div className="flex justify-start">
            <TabsList className="bg-white/5 border border-white/10 p-1.5 h-auto flex-wrap rounded-2xl gap-2">
              {[
                { val: 'general', label: 'Général', icon: Settings },
                { val: 'appearance', label: 'Apparence', icon: Palette },
                { val: 'notifications', label: 'Flux', icon: Bell },
                { val: 'audit', label: 'Algorithme', icon: Zap },
                { val: 'privacy', label: 'Anonymisation', icon: Shield },
                { val: 'data', label: 'Coffre-fort', icon: Database }
              ].map(t => (
                <TabsTrigger
                  key={t.val}
                  value={t.val}
                  className="px-6 py-3 flex items-center gap-3 data-[state=active]:bg-brand-primary data-[state=active]:text-white rounded-xl transition-all font-display font-black uppercase text-[10px] tracking-widest"
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Settings Panel */}
            <div className="lg:col-span-8 space-y-10">

              {/* General Settings */}
              <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                  <div className="px-10 py-8 border-b border-white/5 bg-white/5">
                    <h3 className="text-xl font-display font-black text-white">Localisation Hub</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Configurez vos paramètres de base</p>
                  </div>
                  <div className="p-10 space-y-10">
                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Langue de l'Interface</Label>
                        <Select value={generalSettings.language} onValueChange={(v) => setGeneralSettings({ ...generalSettings, language: v })}>
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10 text-white">
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English (Legacy)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Fuseau Horaire</Label>
                        <Select value={generalSettings.timezone} onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}>
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10 text-white">
                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                            <SelectItem value="America/New_York">New York (EST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSaveGeneral} className="w-full h-16 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-brand-primary/20 transition-all">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Synchroniser les Paramètres'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-card rounded-[2.5rem] border-white/5 p-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-display font-black text-white">Signature Visuelle</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Adaptez l'interface à votre environnement</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { id: 'light', label: 'Clarté Standard', icon: Sun, color: 'text-yellow-400', bg: 'bg-white' },
                      { id: 'dark', label: 'Obsidienne (Premium)', icon: Moon, color: 'text-brand-primary', bg: 'bg-[#0A0A0B]' },
                      { id: 'system', label: 'Adaptation Native', icon: Monitor, color: 'text-brand-cotton', bg: 'bg-gradient-to-br from-white to-[#0A0A0B]' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "group p-6 rounded-[2rem] border-2 transition-all text-left space-y-4",
                          mounted && theme === t.id
                            ? "border-brand-primary bg-brand-primary/5 shadow-2xl shadow-brand-primary/10"
                            : "border-white/5 bg-white/5 hover:border-white/20"
                        )}
                      >
                        <div className={cn("w-full h-32 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden", t.bg)}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                          <t.icon className={cn("h-10 w-10 group-hover:scale-110 transition-transform duration-500", t.color)} />
                        </div>
                        <div>
                          <p className="font-display font-black text-white text-xs uppercase tracking-wider">{t.label}</p>
                          <p className="text-[9px] text-white/30 font-display font-medium mt-1 uppercase tracking-widest italic">{t.id === 'dark' ? 'Haut de gamme' : 'Générique'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-card rounded-[2.5rem] border-white/5 p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-display font-black text-white">Protocole de Diffusion</h3>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Maîtrisez vos flux d'alertes stratégiques</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Maître Switch</span>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, emailNotifications: v })}
                        className="data-[state=checked]:bg-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { key: 'auditComplete', label: 'Validation d\'Audit', desc: 'Notification immédiate lors de la finalisation des calculs.', icon: CheckCircle2 },
                      { key: 'biasAlerts', label: 'Indice de Risque', desc: 'Alerte haute priorité en cas de détection de biais algorithmique.', icon: AlertTriangle },
                      { key: 'weeklyReports', label: 'Synthèse AuditIQ', desc: 'Rétrospective hebdomadaire des performances de vos modèles.', icon: FileText }
                    ].map(pref => (
                      <div key={pref.key} className="glass-card p-6 rounded-3xl border-white/5 bg-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                            <pref.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-display font-black text-white text-sm uppercase tracking-wider">{pref.label}</p>
                            <p className="text-xs text-white/40 font-display font-medium mt-1 italic">{pref.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings[pref.key]}
                          onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, [pref.key]: v })}
                          disabled={!notificationSettings.emailNotifications}
                          className="data-[state=checked]:bg-brand-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Audit Settings */}
              <TabsContent value="audit" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-card rounded-[2.5rem] border-white/5 p-10 space-y-10">
                  <div>
                    <h3 className="text-xl font-display font-black text-white">Moteur de Fairness</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">Ajustez la sensibilité de l'algorithme de détection</p>
                  </div>

                  <div className="space-y-8">
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Seuil d'Équité Critique</p>
                          <p className="text-xs text-white/40 font-display font-medium">Sensibilité minimum pour la certification Fairness V2</p>
                        </div>
                        <span className="text-4xl font-display font-black text-white">{auditSettings.defaultThreshold}<span className="text-brand-primary text-xl">%</span></span>
                      </div>
                      <Slider
                        value={[auditSettings.defaultThreshold]}
                        onValueChange={([v]) => setAuditSettings({ ...auditSettings, defaultThreshold: v })}
                        min={50}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[9px] text-white/20 font-black uppercase mt-4 tracking-[0.2em]">
                        <span>Niveau Standard</span>
                        <span>Certification Elite</span>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4 p-6 rounded-3xl border border-white/5 bg-white/5 group hover:border-brand-primary/20 transition-colors">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Format Master Report</Label>
                        <Select value={auditSettings.reportFormat} onValueChange={(v) => setAuditSettings({ ...auditSettings, reportFormat: v })}>
                          <SelectTrigger className="h-14 bg-black/40 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10 text-white">
                            <SelectItem value="pdf">PDF • Archivage Scellé</SelectItem>
                            <SelectItem value="json">JSON • Flux de Données</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4 p-6 rounded-3xl border border-white/5 bg-white/5 group hover:border-brand-primary/20 transition-colors">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Archive Temporelle</Label>
                        <Select value={String(auditSettings.retentionDays)} onValueChange={(v) => setAuditSettings({ ...auditSettings, retentionDays: parseInt(v) })}>
                          <SelectTrigger className="h-14 bg-black/40 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10 text-white">
                            <SelectItem value="90">90 Jours • Standard</SelectItem>
                            <SelectItem value="365">1 An • Enterprise</SelectItem>
                            <SelectItem value="0">Indéfini • Elite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Sidebar / Quick Settings */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 rounded-[3rem] border-brand-primary/20 bg-brand-primary/5 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:rotate-0 duration-700">
                  <Zap className="h-40 w-40 text-brand-primary" />
                </div>

                <div className="relative space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-primary italic">Status Système</p>
                  <p className="text-xl font-display font-black text-white leading-tight">Optimisez vos résultats par 40%</p>
                  <p className="text-xs text-white/40 font-display font-medium leading-relaxed">
                    L'activation des rapports automatiques Elite permet une certification plus rapide auprès des instances de régulations.
                  </p>
                  <div className="h-[2px] w-12 bg-brand-primary rounded-full" />
                  <Button className="w-full h-14 rounded-2xl bg-brand-primary text-white hover:bg-brand-primary/90 font-display font-black uppercase text-[10px] tracking-widest shadow-xl shadow-brand-primary/20">
                    Explorer les Optimisations
                  </Button>
                </div>
              </div>

              <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-white/5 space-y-8">
                <h4 className="text-lg font-display font-black text-white">Zone de Révocation</h4>
                <p className="text-xs text-white/30 font-display font-medium leading-relaxed italic">
                  Les actions suivantes entraineront la suppression permanente de vos clés et données scellées.
                </p>
                <Button variant="ghost" className="w-full h-14 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-display font-black uppercase text-[10px] tracking-widest transition-all">
                  Effacer le Hub de Données
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
