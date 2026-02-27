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
import { PageHeader } from '@/components/dashboard/page-header'
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
      <div className="space-y-8 max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header Section */}
        <PageHeader
          title="Parametres"
          titleHighlight="generaux"
          description="Personnalisez votre instance AuditIQ selon vos preferences."
          icon={Settings}
          actions={
            <div className="flex items-center gap-3 bg-muted px-5 py-3 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest font-display">Synchronise a AuditIQ</span>
              </div>
            </div>
          }
        />

        <Tabs defaultValue="general" className="space-y-8">
          <div className="flex justify-start">
            <TabsList className="bg-muted border border-border p-1.5 h-auto flex-wrap rounded-xl gap-2">
              {[
                { val: 'general', label: 'General', icon: Settings },
                { val: 'appearance', label: 'Apparence', icon: Palette },
                { val: 'notifications', label: 'Flux', icon: Bell },
                { val: 'audit', label: 'Algorithme', icon: Zap },
                { val: 'privacy', label: 'Confidentialite', icon: Shield },
                { val: 'data', label: 'Donnees', icon: Database }
              ].map(t => (
                <TabsTrigger
                  key={t.val}
                  value={t.val}
                  className="px-6 py-3 flex items-center gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl transition-all font-display font-black uppercase text-[10px] tracking-widest"
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Settings Panel */}
            <div className="lg:col-span-8 space-y-8">

              {/* General Settings */}
              <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <div className="px-10 py-8 border-b border-border bg-muted/50">
                    <h3 className="text-xl font-display font-black text-foreground">Localisation</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Configurez vos parametres de base</p>
                  </div>
                  <div className="p-10 space-y-10">
                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Langue de l'Interface</Label>
                        <Select value={generalSettings.language} onValueChange={(v) => setGeneralSettings({ ...generalSettings, language: v })}>
                          <SelectTrigger className="h-14 rounded-xl font-display font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Francais</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fuseau Horaire</Label>
                        <Select value={generalSettings.timezone} onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}>
                          <SelectTrigger className="h-14 rounded-xl font-display font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                            <SelectItem value="America/New_York">New York (EST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSaveGeneral} className="w-full h-16 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase tracking-[0.2em] text-[11px] transition-all">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Synchroniser les Parametres'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 space-y-8">
                  <div>
                    <h3 className="text-xl font-display font-black text-foreground">Apparence</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Adaptez l'interface a votre environnement</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { id: 'light', label: 'Theme clair', icon: Sun, color: 'text-yellow-400', bg: 'bg-white' },
                      { id: 'dark', label: 'Theme sombre', icon: Moon, color: 'text-primary', bg: 'bg-neutral-950' },
                      { id: 'system', label: 'Automatique', icon: Monitor, color: 'text-muted-foreground', bg: 'bg-gradient-to-br from-white to-neutral-950' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={cn(
                          "group p-6 rounded-xl border-2 transition-all text-left space-y-4",
                          mounted && theme === t.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-muted/50 hover:border-muted-foreground/30"
                        )}
                      >
                        <div className={cn("w-full h-32 rounded-xl border border-border flex items-center justify-center relative overflow-hidden", t.bg)}>
                          <t.icon className={cn("h-10 w-10 group-hover:scale-110 transition-transform duration-500", t.color)} />
                        </div>
                        <div>
                          <p className="font-display font-black text-foreground text-xs uppercase tracking-wider">{t.label}</p>
                          <p className="text-[9px] text-muted-foreground font-display font-medium mt-1 uppercase tracking-widest">{t.id === 'dark' ? 'Recommande' : t.id === 'system' ? 'Suit le systeme' : 'Standard'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-display font-black text-foreground">Notifications</h3>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Gerez vos alertes et notifications</p>
                    </div>
                    <Card className="p-4 flex items-center gap-4">
                      <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Activer tout</span>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, emailNotifications: v })}
                      />
                    </Card>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { key: 'auditComplete', label: 'Validation d\'Audit', desc: 'Notification immediate lors de la finalisation des calculs.', icon: CheckCircle2 },
                      { key: 'biasAlerts', label: 'Indice de Risque', desc: 'Alerte haute priorite en cas de detection de biais algorithmique.', icon: AlertTriangle },
                      { key: 'weeklyReports', label: 'Synthese AuditIQ', desc: 'Retrospective hebdomadaire des performances de vos modeles.', icon: FileText }
                    ].map(pref => (
                      <Card key={pref.key} className="p-4 flex items-center justify-between group hover:bg-accent transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <pref.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-display font-black text-foreground text-sm uppercase tracking-wider">{pref.label}</p>
                            <p className="text-xs text-muted-foreground font-display font-medium mt-1">{pref.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={notificationSettings[pref.key]}
                          onCheckedChange={(v) => setNotificationSettings({ ...notificationSettings, [pref.key]: v })}
                          disabled={!notificationSettings.emailNotifications}
                        />
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Audit Settings */}
              <TabsContent value="audit" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-10 space-y-10">
                  <div>
                    <h3 className="text-xl font-display font-black text-foreground">Parametres d'audit</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Ajustez la sensibilite de la detection de biais</p>
                  </div>

                  <div className="space-y-8">
                    <Card className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Seuil d'Equite Critique</p>
                          <p className="text-xs text-muted-foreground font-display font-medium">Sensibilite minimum pour la certification Fairness V2</p>
                        </div>
                        <span className="text-4xl font-display font-black text-foreground">{auditSettings.defaultThreshold}<span className="text-primary text-xl">%</span></span>
                      </div>
                      <Slider
                        value={[auditSettings.defaultThreshold]}
                        onValueChange={([v]) => setAuditSettings({ ...auditSettings, defaultThreshold: v })}
                        min={50}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground/50 font-black uppercase mt-4 tracking-[0.2em]">
                        <span>Niveau Standard</span>
                        <span>Certification Elite</span>
                      </div>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="p-4 space-y-4 hover:border-primary/20 transition-colors">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Format Master Report</Label>
                        <Select value={auditSettings.reportFormat} onValueChange={(v) => setAuditSettings({ ...auditSettings, reportFormat: v })}>
                          <SelectTrigger className="h-14 rounded-xl font-display font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF - Archivage Scelle</SelectItem>
                            <SelectItem value="json">JSON - Flux de Donnees</SelectItem>
                          </SelectContent>
                        </Select>
                      </Card>
                      <Card className="p-4 space-y-4 hover:border-primary/20 transition-colors">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Conservation des donnees</Label>
                        <Select value={String(auditSettings.retentionDays)} onValueChange={(v) => setAuditSettings({ ...auditSettings, retentionDays: parseInt(v) })}>
                          <SelectTrigger className="h-14 rounded-xl font-display font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90 Jours - Standard</SelectItem>
                            <SelectItem value="365">1 An - Enterprise</SelectItem>
                            <SelectItem value="0">Indefini - Elite</SelectItem>
                          </SelectContent>
                        </Select>
                      </Card>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </div>

            {/* Sidebar / Quick Settings */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="p-10 border-primary/20 bg-primary/5 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:rotate-0 duration-700">
                  <Zap className="h-40 w-40 text-primary" />
                </div>

                <div className="relative space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Status Systeme</p>
                  <p className="text-xl font-display font-black text-foreground leading-tight">Optimisez vos resultats de 40 %</p>
                  <p className="text-xs text-muted-foreground font-display font-medium leading-relaxed">
                    L'activation des rapports automatiques Elite permet une certification plus rapide aupres des instances de regulations.
                  </p>
                  <div className="h-[2px] w-12 bg-primary rounded-full" />
                  <Button className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-display font-black uppercase text-[10px] tracking-widest">
                    Explorer les Optimisations
                  </Button>
                </div>
              </Card>

              <Card className="p-10 space-y-8">
                <h4 className="text-lg font-display font-black text-foreground">Suppression des donnees</h4>
                <p className="text-xs text-muted-foreground font-display font-medium leading-relaxed">
                  Cette action entrainera la suppression permanente de toutes vos donnees.
                </p>
                <Button variant="ghost" className="w-full h-14 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground font-display font-black uppercase text-[10px] tracking-widest transition-all">
                  Supprimer toutes mes donnees
                </Button>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
