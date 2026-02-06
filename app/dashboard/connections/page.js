'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Link2, Plus, Check, Settings, Trash2, RefreshCw, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const connections = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'CRM et donnees clients',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png',
    category: 'CRM',
    status: 'available',
  },
  {
    id: 'workday',
    name: 'Workday',
    description: 'RH et gestion du personnel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Workday_logo.svg/2560px-Workday_logo.svg.png',
    category: 'RH',
    status: 'available',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Marketing et ventes',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png',
    category: 'Marketing',
    status: 'available',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Data warehouse cloud',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Snowflake_Logo.svg/2560px-Snowflake_Logo.svg.png',
    category: 'Data',
    status: 'available',
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    description: 'Google Cloud data warehouse',
    logo: 'https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg',
    category: 'Data',
    status: 'available',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Base de donnees relationnelle',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png',
    category: 'Database',
    status: 'available',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Base de donnees SQL',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/62/MySQL.svg/1200px-MySQL.svg.png',
    category: 'Database',
    status: 'available',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Base de donnees NoSQL',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/45/MongoDB-Logo.svg/2560px-MongoDB-Logo.svg.png',
    category: 'Database',
    status: 'available',
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Stockage cloud Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Amazon-S3-Logo.svg/1200px-Amazon-S3-Logo.svg.png',
    category: 'Storage',
    status: 'available',
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Feuilles de calcul Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/1200px-Google_Sheets_logo_%282014-2020%29.svg.png',
    category: 'Spreadsheet',
    status: 'available',
  },
  {
    id: 'api-rest',
    name: 'API REST',
    description: 'Connexion personnalisee',
    logo: 'https://cdn-icons-png.flaticon.com/512/8297/8297437.png',
    category: 'Custom',
    status: 'available',
  },
  {
    id: 'sftp',
    name: 'SFTP',
    description: 'Transfert de fichiers securise',
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
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setConnectedSources([...connectedSources, selectedConnection.id])
    toast.success(`Connecte a ${selectedConnection.name}`)
    setDialogOpen(false)
    setConnecting(false)
  }

  const handleDisconnect = (id) => {
    setConnectedSources(connectedSources.filter(c => c !== id))
    toast.success('Connexion supprimee')
  }

  const filteredConnections = filter === 'all' 
    ? connections 
    : connections.filter(c => c.category === filter)

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Connexions Externes</h1>
            <p className="text-muted-foreground mt-1">
              Connectez vos sources de donnees pour importer automatiquement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {connectedSources.length} connexion(s) active(s)
            </Badge>
          </div>
        </div>

        {/* Connected Sources */}
        {connectedSources.length > 0 && (
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                Sources Connectees
              </CardTitle>
              <CardDescription>Vos integrations actives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {connectedSources.map(id => {
                  const conn = connections.find(c => c.id === id)
                  if (!conn) return null
                  return (
                    <div key={id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1">
                          <Image
                            src={conn.logo}
                            alt={conn.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{conn.name}</p>
                          <p className="text-xs text-muted-foreground">Connecte</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="text-red-500 hover:text-red-400"
                          onClick={() => handleDisconnect(id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={filter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(cat)}
              className="capitalize"
            >
              {cat === 'all' ? 'Tous' : cat}
            </Button>
          ))}
        </div>

        {/* Available Connections */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredConnections.map((connection) => {
            const isConnected = connectedSources.includes(connection.id)
            return (
              <Card 
                key={connection.id} 
                className={`bg-card hover:border-primary/50 transition-all ${
                  isConnected ? 'border-primary/30' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm">
                      <Image
                        src={connection.logo}
                        alt={connection.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {connection.category}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3">{connection.name}</CardTitle>
                  <CardDescription>{connection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isConnected ? (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-400"
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
                          className="w-full" 
                          size="sm"
                          onClick={() => setSelectedConnection(connection)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Connecter
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1">
                              <Image
                                src={connection.logo}
                                alt={connection.name}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                            Connecter {connection.name}
                          </DialogTitle>
                          <DialogDescription>
                            Configurez votre connexion a {connection.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {connection.id === 'api-rest' ? (
                            <>
                              <div className="space-y-2">
                                <Label>URL de l'API</Label>
                                <Input placeholder="https://api.example.com/v1" className="bg-background" />
                              </div>
                              <div className="space-y-2">
                                <Label>Cle API</Label>
                                <Input type="password" placeholder="Votre cle API" className="bg-background" />
                              </div>
                            </>
                          ) : connection.id === 'postgresql' || connection.id === 'mysql' ? (
                            <>
                              <div className="space-y-2">
                                <Label>Host</Label>
                                <Input placeholder="localhost" className="bg-background" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Port</Label>
                                  <Input placeholder="5432" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Database</Label>
                                  <Input placeholder="mydb" className="bg-background" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Username</Label>
                                <Input placeholder="user" className="bg-background" />
                              </div>
                              <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" placeholder="********" className="bg-background" />
                              </div>
                            </>
                          ) : (
                            <div className="p-4 rounded-lg bg-muted/50 flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">Authentification OAuth</p>
                                <p className="text-sm text-muted-foreground">
                                  Vous serez redirige vers {connection.name} pour autoriser l'acces.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleConnect} disabled={connecting}>
                            {connecting ? 'Connexion...' : 'Connecter'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Link2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Besoin d'une autre integration ?</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Contactez-nous pour demander l'ajout d'une nouvelle source de donnees.
                </p>
                <Button variant="outline" size="sm">Demander une integration</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
