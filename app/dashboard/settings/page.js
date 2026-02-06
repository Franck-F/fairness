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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Parametres</h1>
            <p className="text-muted-foreground mt-1">
              Configurez votre experience AuditIQ
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            Synchronise
          </Badge>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <FileText className="h-4 w-4" />
              Audits
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              Confidentialite
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Database className="h-4 w-4" />
              Donnees
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Localisation
                </CardTitle>
                <CardDescription>
                  Configurez la langue et les formats regionaux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Langue de l'interface
                    </Label>
                    <Select 
                      value={generalSettings.language} 
                      onValueChange={(v) => setGeneralSettings({...generalSettings, language: v})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Francais</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Espanol</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Fuseau horaire
                    </Label>
                    <Select 
                      value={generalSettings.timezone} 
                      onValueChange={(v) => setGeneralSettings({...generalSettings, timezone: v})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Paris (CET/CEST)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT/BST)</SelectItem>
                        <SelectItem value="America/New_York">New York (EST/EDT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Los Angeles (PST/PDT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format de date</Label>
                    <Select 
                      value={generalSettings.dateFormat} 
                      onValueChange={(v) => setGeneralSettings({...generalSettings, dateFormat: v})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format des nombres</Label>
                    <Select 
                      value={generalSettings.numberFormat} 
                      onValueChange={(v) => setGeneralSettings({...generalSettings, numberFormat: v})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr-FR">1 234,56 (Francais)</SelectItem>
                        <SelectItem value="en-US">1,234.56 (US)</SelectItem>
                        <SelectItem value="de-DE">1.234,56 (Allemand)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveGeneral} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Theme
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      mounted && theme === 'light' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg bg-white border mb-3 flex items-center justify-center">
                      <Sun className="h-8 w-8 text-yellow-500" />
                    </div>
                    <p className="font-medium">Clair</p>
                    <p className="text-xs text-muted-foreground">Theme lumineux</p>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      mounted && theme === 'dark' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg bg-zinc-900 border border-zinc-700 mb-3 flex items-center justify-center">
                      <Moon className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="font-medium">Sombre</p>
                    <p className="text-xs text-muted-foreground">Theme fonce</p>
                  </button>

                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      mounted && theme === 'system' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg bg-gradient-to-r from-white to-zinc-900 border mb-3 flex items-center justify-center">
                      <Monitor className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="font-medium">Systeme</p>
                    <p className="text-xs text-muted-foreground">Suivre le systeme</p>
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Theme actuel : {mounted ? (theme === 'dark' ? 'Sombre' : theme === 'light' ? 'Clair' : 'Systeme') : '...'}</p>
                    <p className="text-sm text-muted-foreground">
                      Le theme sombre reduit la fatigue oculaire et economise la batterie sur les ecrans OLED.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications Email
                </CardTitle>
                <CardDescription>
                  Choisissez les emails que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Toutes les notifications email</p>
                      <p className="text-sm text-muted-foreground">Activer/desactiver tous les emails</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(v) => setNotificationSettings({...notificationSettings, emailNotifications: v})}
                  />
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-border ml-5">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20">
                    <div>
                      <p className="font-medium">Audit termine</p>
                      <p className="text-sm text-muted-foreground">Notification quand un audit est complete</p>
                    </div>
                    <Switch
                      checked={notificationSettings.auditComplete}
                      onCheckedChange={(v) => setNotificationSettings({...notificationSettings, auditComplete: v})}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20">
                    <div>
                      <p className="font-medium">Audit echoue</p>
                      <p className="text-sm text-muted-foreground">Alerte en cas d'erreur lors d'un audit</p>
                    </div>
                    <Switch
                      checked={notificationSettings.auditFailed}
                      onCheckedChange={(v) => setNotificationSettings({...notificationSettings, auditFailed: v})}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20">
                    <div>
                      <p className="font-medium">Alertes de biais</p>
                      <p className="text-sm text-muted-foreground">Notification si un biais critique est detecte</p>
                    </div>
                    <Switch
                      checked={notificationSettings.biasAlerts}
                      onCheckedChange={(v) => setNotificationSettings({...notificationSettings, biasAlerts: v})}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20">
                    <div>
                      <p className="font-medium">Rapports hebdomadaires</p>
                      <p className="text-sm text-muted-foreground">Resume de vos audits chaque semaine</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(v) => setNotificationSettings({...notificationSettings, weeklyReports: v})}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20">
                    <div>
                      <p className="font-medium">Mises a jour systeme</p>
                      <p className="text-sm text-muted-foreground">Nouveautes et ameliorations de la plateforme</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(v) => setNotificationSettings({...notificationSettings, systemUpdates: v})}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20">
                    <div>
                      <p className="font-medium">Communications marketing</p>
                      <p className="text-sm text-muted-foreground">Offres speciales et evenements</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(v) => setNotificationSettings({...notificationSettings, marketingEmails: v})}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading} className="mt-4">
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Sauvegarder les preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Settings */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Configuration des Audits
                </CardTitle>
                <CardDescription>
                  Parametres par defaut pour vos audits de fairness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center justify-between">
                      <span>Seuil de fairness par defaut</span>
                      <span className="text-primary font-bold">{auditSettings.defaultThreshold}%</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Score minimum pour considerer un modele comme equitable
                    </p>
                    <Slider
                      value={[auditSettings.defaultThreshold]}
                      onValueChange={([v]) => setAuditSettings({...auditSettings, defaultThreshold: v})}
                      min={50}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Format des rapports</Label>
                    <Select 
                      value={auditSettings.reportFormat} 
                      onValueChange={(v) => setAuditSettings({...auditSettings, reportFormat: v})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Retention des donnees</Label>
                    <Select 
                      value={String(auditSettings.retentionDays)} 
                      onValueChange={(v) => setAuditSettings({...auditSettings, retentionDays: parseInt(v)})}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                        <SelectItem value="180">6 mois</SelectItem>
                        <SelectItem value="365">1 an</SelectItem>
                        <SelectItem value="0">Indefiniment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Generation automatique de rapports</p>
                      <p className="text-sm text-muted-foreground">Creer un rapport PDF apres chaque audit</p>
                    </div>
                    <Switch
                      checked={auditSettings.autoGenerateReports}
                      onCheckedChange={(v) => setAuditSettings({...auditSettings, autoGenerateReports: v})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Recommandations automatiques</p>
                      <p className="text-sm text-muted-foreground">Inclure des suggestions de mitigation des biais</p>
                    </div>
                    <Switch
                      checked={auditSettings.includeRecommendations}
                      onCheckedChange={(v) => setAuditSettings({...auditSettings, includeRecommendations: v})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveAudit} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Confidentialite
                </CardTitle>
                <CardDescription>
                  Controlez vos donnees et votre visibilite
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Partage des donnees analytiques</p>
                      <p className="text-sm text-muted-foreground">Aider a ameliorer AuditIQ avec des donnees anonymes</p>
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.shareAnalytics}
                    onCheckedChange={(v) => setPrivacySettings({...privacySettings, shareAnalytics: v})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Afficher mon activite</p>
                      <p className="text-sm text-muted-foreground">Les membres de votre equipe peuvent voir votre activite</p>
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.showActivity}
                    onCheckedChange={(v) => setPrivacySettings({...privacySettings, showActivity: v})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Profil public</p>
                      <p className="text-sm text-muted-foreground">Rendre votre profil visible aux autres utilisateurs</p>
                    </div>
                  </div>
                  <Switch
                    checked={privacySettings.publicProfile}
                    onCheckedChange={(v) => setPrivacySettings({...privacySettings, publicProfile: v})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Sessions actives
                </CardTitle>
                <CardDescription>
                  Gerez vos connexions actives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Monitor className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-muted-foreground">
                        Navigateur web - {new Date().toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Settings */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Stockage
                </CardTitle>
                <CardDescription>
                  Gerez votre espace de stockage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Espace utilise</span>
                    <span className="text-muted-foreground">0 Mo / 500 Mo</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Plan Starter : 500 Mo de stockage inclus
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Exporter mes donnees
                </CardTitle>
                <CardDescription>
                  Telechargez une copie de toutes vos donnees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Exporter toutes les donnees</p>
                    <p className="text-sm text-muted-foreground">
                      Datasets, audits, rapports et parametres
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <Trash2 className="h-5 w-5" />
                  Supprimer mes donnees
                </CardTitle>
                <CardDescription>
                  Cette action est irreversible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-red-500/10 flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-500">Zone de danger</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      La suppression de vos donnees effacera definitivement tous vos datasets, 
                      audits et rapports. Cette action ne peut pas etre annulee.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer toutes mes donnees
                    </Button>
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
