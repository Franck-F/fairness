'use client'

import { useState } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Scale,
  Lock,
  Eye,
  Database,
  UserCheck,
  Download,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState('ai-act')

  // Mock compliance data
  const complianceStatus = {
    'ai-act': {
      overall: 78,
      status: 'warning',
      label: 'Conformité Partielle',
      categories: [
        {
          name: 'Transparence',
          score: 85,
          status: 'compliant',
          requirements: [
            { name: 'Documentation des décisions', status: 'compliant', description: 'Toutes les décisions sont tracées' },
            { name: 'Explicabilité des prédictions', status: 'compliant', description: 'Modèles interprétables utilisés' },
            { name: 'Information des utilisateurs', status: 'warning', description: 'Notifications à améliorer' },
          ],
        },
        {
          name: 'Équité et Non-discrimination',
          score: 72,
          status: 'warning',
          requirements: [
            { name: 'Tests de biais réguliers', status: 'compliant', description: 'Audits mensuels en place' },
            { name: 'Métriques de fairness', status: 'warning', description: '2 métriques en dessous du seuil' },
            { name: 'Mitigation des biais', status: 'warning', description: 'Plan de mitigation à définir' },
          ],
        },
        {
          name: 'Sécurité et Robustesse',
          score: 90,
          status: 'compliant',
          requirements: [
            { name: 'Validation des données', status: 'compliant', description: 'Pipeline de validation actif' },
            { name: 'Tests adversariaux', status: 'compliant', description: 'Tests mensuels effectués' },
            { name: 'Monitoring en production', status: 'compliant', description: 'Alertes configurées' },
          ],
        },
        {
          name: 'Gouvernance et Supervision',
          score: 65,
          status: 'non-compliant',
          requirements: [
            { name: 'Comité de surveillance IA', status: 'non-compliant', description: 'Comité non constitué' },
            { name: 'Processus de revue', status: 'warning', description: 'Processus informel' },
            { name: 'Documentation technique', status: 'compliant', description: 'Documentation à jour' },
          ],
        },
      ],
    },
    'gdpr': {
      overall: 92,
      status: 'compliant',
      label: 'Conforme',
      categories: [
        {
          name: 'Protection des Données',
          score: 95,
          status: 'compliant',
          requirements: [
            { name: 'Chiffrement des données', status: 'compliant', description: 'AES-256 en place' },
            { name: 'Anonymisation', status: 'compliant', description: 'PII masquées automatiquement' },
            { name: 'Minimisation des données', status: 'compliant', description: 'Seules données nécessaires collectées' },
          ],
        },
        {
          name: 'Droits des Utilisateurs',
          score: 88,
          status: 'compliant',
          requirements: [
            { name: 'Droit à l\'oubli', status: 'compliant', description: 'Suppression en 30 jours' },
            { name: 'Portabilité des données', status: 'compliant', description: 'Export JSON/CSV disponible' },
            { name: 'Droit de rectification', status: 'warning', description: 'Délai de 48h à réduire' },
          ],
        },
        {
          name: 'Consentement',
          score: 90,
          status: 'compliant',
          requirements: [
            { name: 'Consentement explicite', status: 'compliant', description: 'Opt-in obligatoire' },
            { name: 'Gestion des cookies', status: 'compliant', description: 'Banner conforme' },
            { name: 'Révocation facile', status: 'compliant', description: 'Paramètres accessibles' },
          ],
        },
      ],
    },
  }

  const framework = complianceStatus[selectedFramework]

  const getStatusBadge = (status) => {
    const styles = {
      compliant: { label: 'Conforme', icon: CheckCircle2, class: 'bg-green-100 text-green-800 border-green-200' },
      warning: { label: 'Attention', icon: AlertTriangle, class: 'bg-orange-100 text-orange-800 border-orange-200' },
      'non-compliant': { label: 'Non conforme', icon: XCircle, class: 'bg-red-100 text-red-800 border-red-200' },
    }
    const style = styles[status] || styles.warning
    const Icon = style.icon

    return (
      <Badge className={cn('border', style.class)}>
        <Icon className="h-3 w-3 mr-1" />
        {style.label}
      </Badge>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Conformité Réglementaire</h1>
          <p className="text-muted-foreground mt-1">
            Suivez votre conformité AI Act, GDPR et autres réglementations
          </p>
        </div>

        {/* Framework Selector */}
        <Tabs value={selectedFramework} onValueChange={setSelectedFramework}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ai-act">
              <Scale className="h-4 w-4 mr-2" />
              AI Act
            </TabsTrigger>
            <TabsTrigger value="gdpr">
              <Lock className="h-4 w-4 mr-2" />
              GDPR
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Overall Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">Score de Conformité</h3>
                  {getStatusBadge(framework.status)}
                </div>
                <p className="text-muted-foreground">
                  {selectedFramework === 'ai-act' ? 'Règlement européen sur l\'Intelligence Artificielle' : 'Règlement Général sur la Protection des Données'}
                </p>
              </div>
              <div className="text-center">
                <div className={cn('text-5xl font-bold', getScoreColor(framework.overall))}>
                  {framework.overall}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">{framework.label}</p>
              </div>
            </div>
            <Progress value={framework.overall} className="mt-4" />
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          {framework.categories.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  {getStatusBadge(category.status)}
                </div>
                <CardDescription>
                  Score : <span className={cn('font-bold', getScoreColor(category.score))}>{category.score}%</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.requirements.map((req, reqIdx) => (
                    <div key={reqIdx} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="mt-0.5">
                        {req.status === 'compliant' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {req.status === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                        {req.status === 'non-compliant' && <XCircle className="h-5 w-5 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{req.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{req.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Recommandées</CardTitle>
            <CardDescription>
              Améliorez votre conformité avec ces actions prioritaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Constituer un comité de surveillance IA</p>
                    <p className="text-sm text-muted-foreground">Requis pour AI Act - Priorité Haute</p>
                  </div>
                </div>
                <Button size="sm">Démarrer</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Améliorer les métriques de fairness</p>
                    <p className="text-sm text-muted-foreground">2 métriques en dessous du seuil - Priorité Moyenne</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Consulter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Ressources et Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Télécharger le rapport de conformité
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exporter les preuves de conformité
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation AI Act (EUR-Lex)
              </Button>
              <Button variant="outline" className="justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Guide GDPR (CNIL)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
