'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/dashboard/page-header'
import { EmptyState } from '@/components/dashboard/empty-state'
import {
  Lightbulb,
  ArrowRight,
  Shuffle,
  Target,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Info,
  Sparkles,
  Search,
  Zap,
  Shield,
  Clock,
  Settings2,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function WhatIfPage() {
  const { session } = useAuth()
  const [audits, setAudits] = useState([])
  const [selectedAudit, setSelectedAudit] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingAudits, setLoadingAudits] = useState(true)
  const [results, setResults] = useState(null)

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
      // silently handle fetch errors
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
      <div className="space-y-8 max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Premium Header */}
        <PageHeader
          title="Analyse"
          titleHighlight="WhatIf"
          description="Simulez des scenarios hypothetiques pour identifier les leviers d'influence sur vos modeles d'IA."
          icon={Shuffle}
          actions={
            <div className="flex items-center gap-4">
              <div className="bg-muted px-4 py-2 rounded-xl border border-border flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Analyse contrefactuelle</span>
              </div>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Hub */}
          <div className="lg:col-span-5 space-y-6">
            {/* Audit Selection Card */}
            <Card className="overflow-hidden">
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-black text-foreground">Source Audit</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Selectionnez un audit</p>
                </div>
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="p-8">
                <Select value={selectedAudit} onValueChange={setSelectedAudit}>
                  <SelectTrigger className="h-14 rounded-xl font-display font-bold">
                    <SelectValue placeholder="Selectionnez un audit source" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingAudits ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : audits.length === 0 ? (
                      <SelectItem value="none" disabled>Aucun audit disponible</SelectItem>
                    ) : (
                      audits.map((audit) => (
                        <SelectItem key={audit.id} value={audit.id}>
                          {audit.audit_name} - {audit.overall_score}% Accuracy
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Instance Configuration */}
            <Card className="overflow-hidden">
              <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-black text-foreground">Parametres Instance</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Variables de Simulation</p>
                </div>
                <Settings2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="p-8 space-y-8">
                {Object.entries(instanceData).map(([key, value]) => (
                  <div key={key} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{key.replace('_', ' ')}</Label>
                      <Badge variant="outline" className="text-primary font-mono text-[11px] px-3 py-1 rounded-lg">
                        {value.toLocaleString()}
                      </Badge>
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
              </div>
            </Card>

            {/* Target Outcome Hub */}
            <Card className="overflow-hidden">
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-display font-black text-foreground">Resultat souhaite</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Definir le resultat cible</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-14 rounded-xl font-display font-black uppercase tracking-widest text-[10px] transition-all border",
                      targetOutcome === 1
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => setTargetOutcome(1)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Favorable (1)
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-14 rounded-xl font-display font-black uppercase tracking-widest text-[10px] transition-all border",
                      targetOutcome === 0
                        ? "bg-destructive/20 border-destructive text-destructive"
                        : "bg-muted border-border text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => setTargetOutcome(0)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Defavorable (0)
                  </Button>
                </div>
              </div>
            </Card>

            <Button
              className="w-full h-16 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-display font-black uppercase tracking-[0.2em] text-[11px] transition-all"
              size="lg"
              onClick={runWhatIfAnalysis}
              disabled={loading || !selectedAudit}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Calcul des Contrefactuels...
                </>
              ) : (
                <>
                  <Lightbulb className="h-5 w-5 mr-3" />
                  Lancer l'analyse WhatIf
                </>
              )}
            </Button>
          </div>

          {/* Results Stage */}
          <div className="lg:col-span-7">
            {loading ? (
              <Card className="h-full flex flex-col items-center justify-center border-dashed border-2 py-40 gap-8 animate-pulse">
                <div className="relative">
                  <Loader2 className="h-24 w-24 text-primary animate-spin" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-3xl font-display font-black text-foreground">Analyse en cours...</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Optimisation des modifications minimales</p>
                </div>
              </Card>
            ) : results ? (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
                {/* Explanation Banner */}
                <Card className="p-10 border-primary/20 bg-primary/5 relative overflow-hidden group">
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary border border-primary/50 flex items-center justify-center shrink-0">
                      <Sparkles className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Resultat de l'analyse</h4>
                      <p className="text-2xl font-display font-black text-foreground leading-tight">
                        {results.explanation}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Counterfactuals Feed */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-6">
                    <h3 className="text-xl font-display font-black text-foreground flex items-center gap-4">
                      Scenarios alternatifs <span className="text-muted-foreground font-medium">({results.counterfactuals?.length || 0})</span>
                    </h3>
                    <div className="h-px flex-1 mx-8 bg-border" />
                  </div>

                  <div className="grid gap-6">
                    {results.counterfactuals?.map((cf, index) => (
                      <Card key={index} className="overflow-hidden group hover:border-primary/40 transition-all duration-500">
                        <div className="px-8 py-5 border-b border-border flex items-center justify-between bg-muted/50">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-black text-xs">
                              {index + 1}
                            </span>
                            <h4 className="text-sm font-display font-black text-foreground uppercase tracking-widest">Scenario contrefactuel</h4>
                          </div>
                          <Badge variant="outline" className="font-display font-black uppercase tracking-tighter text-[9px] px-3 py-1">
                            Confiance: {(cf.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>

                        <div className="p-8 space-y-4">
                          {cf.changes?.map((change, i) => (
                            <Card key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 hover:bg-accent transition-colors group/item">
                              <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                                  <Zap className={cn("h-4 w-4", change.impact === 'high' || change.impact === 'very high' ? 'text-primary' : 'text-muted-foreground')} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{change.attribute.replace('_', ' ')}</p>
                                  <div className="flex items-center gap-4">
                                    <span className="text-lg font-display font-black text-muted-foreground">
                                      {typeof change.from === 'number' ? change.from.toLocaleString() : change.from}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                    <span className="text-lg font-display font-black text-primary underline decoration-primary/30 underline-offset-4">
                                      {typeof change.to === 'number' ? change.to.toLocaleString() : change.to}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 self-end md:self-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-display font-black uppercase text-[9px] tracking-widest px-3 py-1",
                                    (change.impact === 'high' || change.impact === 'very high')
                                      ? 'border-primary/50 text-primary bg-primary/5'
                                      : 'border-border text-muted-foreground bg-muted'
                                  )}
                                >
                                  Impact: {change.impact}
                                </Badge>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Card className="h-full flex flex-col items-center justify-center border-dashed border-2 py-40 gap-10 group">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl bg-muted border border-border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/5">
                    <Lightbulb className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center animate-bounce">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-sm">
                  <h3 className="text-3xl font-display font-black text-foreground">Simulation WhatIf</h3>
                  <p className="text-sm text-muted-foreground font-display font-medium leading-relaxed">
                    Configurez vos variables de simulation et lancez l'analyse pour projeter des scenarios alternatifs de decision.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
