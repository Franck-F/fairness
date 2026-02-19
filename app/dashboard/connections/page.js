'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Link2,
  Plus,
  Check,
  Settings,
  Trash2,
  RefreshCw,
  AlertCircle,
  Database,
  Cloud,
  Layers,
  Zap,
  ShieldCheck,
  Globe,
  Share2,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const connections = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM et données clients haute fidélité',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png',
    category: 'CRM',
    status: 'available',
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'Gestion RH et capital humain',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Workday_logo.svg/2560px-Workday_logo.svg.png',
    category: 'RH',
    status: 'available',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing automation et pipelines',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png',
    category: 'Marketing',
    status: 'available',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Data warehouse cloud multi-cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Snowflake_Logo.svg/2560px-Snowflake_Logo.svg.png',
    category: 'Data',
    status: 'available',
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    description: 'Google Cloud data analytics',
    logo: 'https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg',
    category: 'Data',
    status: 'available',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Base de données relationnelle avancée',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png',
    category: 'Database',
    status: 'available',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Performance SQL universelle',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/62/MySQL.svg/1200px-MySQL.svg.png',
    category: 'Database',
    status: 'available',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Base de données NoSQL distribuée',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/45/MongoDB-Logo.svg/2560px-MongoDB-Logo.svg.png',
    category: 'Database',
    status: 'available',
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Stockage objet à l\'échelle mondiale',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Amazon-S3-Logo.svg/1200px-Amazon-S3-Logo.svg.png',
    category: 'Storage',
    status: 'available',
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Tableurs collaboratifs temps réel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1200px-Google_Sheets_logo_%282014-2020%29.svg.png',
    category: 'Spreadsheet',
    status: 'available',
  },
  {
    id: 'api-rest',
    name: 'API REST',
    description: 'Point de terminaison personnalisé',
    logo: 'https://cdn-icons-png.flaticon.com/512/8297/8297437.png',
    category: 'Custom',
    status: 'available',
  },
  {
    id: 'sftp',
    name: 'SFTP',
    description: 'Transfert de fichiers crypté',
    logo: 'https://cdn-icons-png.flaticon.com/512/6701/6701428.png',
    category: 'Transfer',
    status: 'available',
  },
]

export default function ConnectionsPage() {
  const [connectedSources, setConnectedSources] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...new Set(connections.map(c => c.category))]

  const handleConnect = async () => {
    if (!selectedConnection) return
    setConnecting(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    setConnectedSources([...connectedSources, selectedConnection.id])
    toast.success(`Connecté à ${selectedConnection.name}`)
    setDialogOpen(false)
    setConnecting(false)
  }

  const handleDisconnect = (id) => {
    setConnectedSources(connectedSources.filter(c => c !== id))
    toast.success('Connexion supprimée')
  }

  const filteredConnections = filter === 'all'
    ? connections
    : connections.filter(c => c.category === filter)

  return (
    <DashboardShell>
      <div className="space-y-12 max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Link2 className="h-6 w-6 text-brand-primary animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white leading-none">
                Cloud <span className="text-brand-primary">AuditIQ</span>
              </h1>
            </div>
            <p className="text-white/40 font-display font-medium text-lg max-w-2xl">
              Unifiez vos pipelines de données via des intégrations sécurisées et temps réel.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 rounded-xl border-white/5 bg-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                {connectedSources.length} ACTIFS
              </span>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="glass-card p-6 rounded-2xl border-brand-primary/20 bg-brand-primary/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <p className="font-display font-black text-white text-sm">Fonctionnalité à venir</p>
            <p className="text-xs text-white/40">Les intégrations cloud seront disponibles dans une prochaine version. Explorez le catalogue ci-dessous.</p>
          </div>
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 font-black text-[9px] uppercase tracking-widest ml-auto">Coming Soon</Badge>
        </div>

        {/* Connected Sources Hub */}
        {connectedSources.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-5 w-5 text-brand-cotton" />
              <h2 className="text-sm font-display font-black text-white/40 uppercase tracking-[0.3em]">Passerelles Actives</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {connectedSources.map(id => {
                const conn = connections.find(c => c.id === id)
                if (!conn) return null
                return (
                  <div key={id} className="glass-card p-6 rounded-[2rem] border-brand-primary/20 bg-brand-primary/5 group relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Zap className="h-40 w-40 text-brand-primary" />
                    </div>
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                          <Image
                            src={conn.logo}
                            alt={conn.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-display font-black text-white">{conn.name}</p>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            Synchronisé
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDisconnect(id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Catalog Section */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
            <div className="flex items-center gap-4">
              <Layers className="h-5 w-5 text-brand-primary" />
              <h2 className="text-sm font-display font-black text-white/40 uppercase tracking-[0.3em]">Catalogue Intégrations</h2>
            </div>
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl font-display font-black text-[10px] uppercase tracking-widest transition-all",
                    filter === cat
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  {cat === 'all' ? 'TOUS' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredConnections.map((connection) => {
              const isConnected = connectedSources.includes(connection.id)
              return (
                <div
                  key={connection.id}
                  className={cn(
                    "glass-card p-6 rounded-[2.5rem] bg-white/5 border-white/5 hover:border-brand-primary/40 transition-all duration-500 group flex flex-col",
                    isConnected && "border-brand-primary/20 bg-brand-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center p-3 shadow-2xl transition-transform group-hover:scale-110">
                      <Image
                        src={connection.logo}
                        alt={connection.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <Badge className="bg-white/5 border-white/10 text-white/30 font-black tracking-widest text-[8px] px-2 py-0.5 uppercase">
                      {connection.category}
                    </Badge>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-xl font-display font-black text-white">{connection.name}</h3>
                      <p className="text-sm text-white/40 font-medium leading-relaxed line-clamp-2 mt-1">{connection.description}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    {isConnected ? (
                      <div className="flex gap-3">
                        <Button className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-display font-black uppercase tracking-widest text-[9px]">
                          <RefreshCw className="h-3 w-3 mr-2 animate-spin-slow" />
                          SYNC
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-12 h-12 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDisconnect(connection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Dialog open={dialogOpen && selectedConnection?.id === connection.id} onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (!open) setSelectedConnection(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full h-12 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-widest text-[9px] shadow-lg shadow-brand-primary/20"
                            onClick={() => setSelectedConnection(connection)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            CONNECTER
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card bg-[#0A0A0B]/80 backdrop-blur-3xl border-white/10 rounded-[3rem] p-0 overflow-hidden">
                          <div className="p-10 space-y-8">
                            <DialogHeader>
                              <div className="flex items-center gap-6 mb-2">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-white flex items-center justify-center p-4">
                                  <Image
                                    src={connection.logo}
                                    alt={connection.name}
                                    width={64}
                                    height={64}
                                    className="object-contain"
                                  />
                                </div>
                                <div>
                                  <DialogTitle className="text-4xl font-display font-black text-white">
                                    Integration <span className="text-brand-primary">{connection.name}</span>
                                  </DialogTitle>
                                  <DialogDescription className="text-lg text-white/40">
                                    Sécurisation de la passerelle de données.
                                  </DialogDescription>
                                </div>
                              </div>
                            </DialogHeader>

                            <div className="space-y-6 pt-4">
                              {connection.id === 'api-rest' ? (
                                <>
                                  <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">URL de l'API EndPoint</Label>
                                    <Input placeholder="https://api.gateway.io/v1" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Clé Privée AuditIQ</Label>
                                    <Input type="password" placeholder="sk_live_****************" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                  </div>
                                </>
                              ) : connection.id === 'postgresql' || connection.id === 'mysql' ? (
                                <>
                                  <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Host de Destination</Label>
                                    <Input placeholder="db.clusters.audit.io" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Port</Label>
                                      <Input placeholder="5432" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                    </div>
                                    <div className="space-y-3">
                                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Instance Name</Label>
                                      <Input placeholder="Audit_Prod_DSET" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Username</Label>
                                      <Input placeholder="root_admin" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                    </div>
                                    <div className="space-y-3">
                                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Access Token</Label>
                                      <Input type="password" placeholder="********" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-display" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="p-8 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/20 flex items-start gap-6 group">
                                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20">
                                    <Globe className="h-7 w-7 text-brand-primary animate-spin-slow" />
                                  </div>
                                  <div>
                                    <p className="text-xl font-display font-black text-white">Authentification OAuth 2.0</p>
                                    <p className="text-base text-white/40 leading-relaxed mt-1">
                                      AuditIQ requiert une autorisation sécurisée via {connection.name}. Vous serez redirigé vers leur portail certifié.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <DialogFooter className="pt-6">
                              <Button variant="ghost" className="h-14 rounded-2xl text-white/40 hover:text-white" onClick={() => setDialogOpen(false)}>
                                Annuler
                              </Button>
                              <Button
                                onClick={handleConnect}
                                disabled={connecting}
                                className="h-14 px-10 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-brand-primary/40 group/btn"
                              >
                                {connecting ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <>
                                    Finaliser le Tunnel
                                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Suggestion Card */}
        <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="flex items-start gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
              <Share2 className="h-10 w-10 text-brand-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-display font-black text-white tracking-tight">AuditIQ Custom Integration</h3>
              <p className="text-lg text-white/30 font-display font-medium max-w-xl leading-snug">
                Votre source de données est absente ? Nos ingénieurs peuvent orchestrer un tunnel sur mesure pour vos besoins spécifiques.
              </p>
            </div>
          </div>
          <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 text-white font-display font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all hover:scale-105">
            DÉPLOYER UNE REQUÊTE
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}
