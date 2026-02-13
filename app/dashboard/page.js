'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  FileBarChart2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  TrendingUp,
  Shield,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalAudits: 0,
    criticalAudits: 0,
    averageScore: 0,
    recentAudits: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/audits/stats')
      // const data = await response.json()

      // Mock data for now
      setStats({
        totalAudits: 0,
        criticalAudits: 0,
        averageScore: 0,
        recentAudits: [],
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de Bord</h1>
            <p className="text-muted-foreground mt-1">
              Vue d'ensemble de vos audits de fairness IA
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/upload')} size="lg">
            <Upload className="h-5 w-5 mr-2" />
            Nouvel Audit
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
              <FileBarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAudits}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Audits réalisés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Audits Critiques</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.criticalAudits}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Nécessitent une attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Score d'équité global
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Empty State or Recent Audits */}
        {stats.totalAudits === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="h-16 w-16 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Aucun audit pour le moment</h3>
                <p className="text-muted-foreground mt-2">
                  Commencez par créer votre premier audit de fairness IA
                </p>
              </div>
              <Button onClick={() => router.push('/dashboard/upload')} size="lg">
                <Upload className="h-5 w-5 mr-2" />
                Créer mon premier audit
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Audits Récents</CardTitle>
              <CardDescription>Vos derniers audits de fairness</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: List recent audits */}
              <p className="text-sm text-muted-foreground">Chargement des audits...</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/upload')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Nouvel Audit
              </CardTitle>
              <CardDescription>
                Uploadez un dataset et lancez un audit de fairness
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/data-science')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Data Science
              </CardTitle>
              <CardDescription>
                Explorez vos données avec des visualisations interactives
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
