'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lightbulb, ArrowRight, Shuffle, Target, TrendingUp, AlertTriangle, Loader2, Info, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function WhatIfPage() {
  const { session } = useAuth()
  const [audits, setAudits] = useState([])
  const [selectedAudit, setSelectedAudit] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingAudits, setLoadingAudits] = useState(true)
  const [results, setResults] = useState(null)
  
  // Example instance data
  const [instanceData, setInstanceData] = useState({
    age: 35,
    income: 50000,
    experience: 5,
    education_level: 3,
    credit_score: 650,
  })
  
  const [targetOutcome, setTargetOutcome] = useState(1)

  useEffect(() => {
    if (session?.access_token) {
      fetchAudits()
    }
  }, [session])

  const fetchAudits = async () => {
    setLoadingAudits(true)
    try {
      const response = await fetch('/api/audits', {
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      })
      const data = await response.json()
      if (data.audits) {
        setAudits(data.audits.filter(a => a.status === 'completed'))
      }
    } catch (error) {
      console.error('Error fetching audits:', error)
    } finally {
      setLoadingAudits(false)
    }
  }

  const runWhatIfAnalysis = async () => {
    if (!selectedAudit) {
      toast.error('Selectionnez un audit')
      return
    }

    setLoading(true)
    setResults(null)

    try {
      const response = await fetch('/api/whatif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          audit_id: selectedAudit,
          instance_data: instanceData,
          target_outcome: targetOutcome,
          constraints: {},
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data)
        toast.success('Analyse WhatIf terminee')
      } else {
        toast.error(data.error || 'Erreur lors de l\'analyse')
      }
    } catch (error) {
      console.error('WhatIf error:', error)
      toast.error('Erreur lors de l\'analyse')
    } finally {
      setLoading(false)
    }
  }

  const updateInstanceValue = (key, value) => {
    setInstanceData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Analyse WhatIf
          </h1>
          <p className="text-muted-foreground mt-1">
            Explorez des scenarios contrefactuels pour comprendre comment modifier les predictions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Select Audit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Selectionner un Audit
                </CardTitle>
                <CardDescription>
                  Choisissez un audit complete pour l'analyse contrefactuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedAudit} onValueChange={setSelectedAudit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez un audit" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingAudits ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : audits.length === 0 ? (
                      <SelectItem value="none" disabled>Aucun audit complete</SelectItem>
                    ) : (
                      audits.map((audit) => (
                        <SelectItem key={audit.id} value={audit.id}>
                          {audit.audit_name} - Score: {audit.overall_score}%
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Instance Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5" />
                  Configurer l'Instance
                </CardTitle>
                <CardDescription>
                  Definissez les valeurs de l'instance a analyser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(instanceData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace('_', ' ')}</Label>
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([v]) => updateInstanceValue(key, v)}
                      min={0}
                      max={key === 'income' ? 200000 : key === 'credit_score' ? 850 : 100}
                      step={key === 'income' ? 1000 : 1}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Target Outcome */}
            <Card>
              <CardHeader>
                <CardTitle>Resultat Cible</CardTitle>
                <CardDescription>
                  Quel resultat souhaitez-vous obtenir ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant={targetOutcome === 1 ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setTargetOutcome(1)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Favorable (1)
                  </Button>
                  <Button
                    variant={targetOutcome === 0 ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setTargetOutcome(0)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Defavorable (0)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Run Analysis */}
            <Button 
              className="w-full h-12" 
              size="lg" 
              onClick={runWhatIfAnalysis}
              disabled={loading || !selectedAudit}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Lancer l'Analyse WhatIf
                </>
              )}
            </Button>
          </div>

          {/* Results Panel */}
          <div>
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold mb-2">Generation des contrefactuels...</h3>
                  <p className="text-muted-foreground">Recherche des modifications minimales</p>
                </CardContent>
              </Card>
            ) : results ? (
              <div className="space-y-6">
                {/* Explanation */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      Explication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{results.explanation}</p>
                  </CardContent>
                </Card>

                {/* Counterfactuals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scenarios Contrefactuels</CardTitle>
                    <CardDescription>
                      {results.counterfactuals?.length || 0} scenario(s) trouve(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.counterfactuals?.map((cf, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold">Scenario {index + 1}</h4>
                            <Badge variant={cf.confidence > 0.8 ? 'default' : 'secondary'}>
                              Confiance: {(cf.confidence * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {cf.changes?.map((change, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm">
                                <span className="font-medium capitalize w-32">
                                  {change.attribute.replace('_', ' ')}
                                </span>
                                <span className="text-muted-foreground">
                                  {typeof change.from === 'number' ? change.from.toLocaleString() : change.from}
                                </span>
                                <ArrowRight className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-primary">
                                  {typeof change.to === 'number' ? change.to.toLocaleString() : change.to}
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className={change.impact === 'high' || change.impact === 'very high' ? 'border-orange-500 text-orange-500' : ''}
                                >
                                  {change.impact}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Analyse Contrefactuelle</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Configurez les parametres a gauche et lancez l'analyse pour decouvrir 
                    comment modifier les predictions de votre modele.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
