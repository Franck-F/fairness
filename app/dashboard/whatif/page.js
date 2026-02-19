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
      console.error('Error fetching audits:', error)
    } finally {
      setLoadingAudits(false)
    }
  }

  const runWhatIfAnalysis = async () => {
    if (!selectedAudit) {
      toast.error('Sélectionnez un audit')
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
        toast.success('Analyse WhatIf terminée')
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
      <div className="space-y-10 max-w-7xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Shuffle className="h-6 w-6 text-brand-primary animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white leading-none">
                Analyse <span className="text-brand-primary">WhatIf</span>
              </h1>
            </div>
            <p className="text-white/40 font-display font-medium text-lg max-w-2xl">
              Simulateur de scenarios contrefactuels : découvrez les leviers d'influence sur vos modèles d'IA.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 rounded-xl border-white/5 bg-white/5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-cotton" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60 text-brand-cotton">Exploration Avancée</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Configuration Hub */}
          <div className="lg:col-span-5 space-y-8">
            {/* Audit Selection Card */}
            <div className="glass-card rounded-[2.5rem] border-white/10 bg-white/5 overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-black text-white">Source Audit</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Gisement Logiciel</p>
                </div>
                <Target className="h-5 w-5 text-brand-primary" />
              </div>
              <div className="p-8">
                <Select value={selectedAudit} onValueChange={setSelectedAudit}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl font-display font-bold text-white focus:ring-brand-primary">
                    <SelectValue placeholder="Sélectionnez un audit source" />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10">
                    {loadingAudits ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : audits.length === 0 ? (
                      <SelectItem value="none" disabled>Aucun audit disponible</SelectItem>
                    ) : (
                      audits.map((audit) => (
                        <SelectItem key={audit.id} value={audit.id} className="focus:bg-brand-primary/20 focus:text-white">
                          {audit.audit_name} • {audit.overall_score}% Accuracy
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Instance Configuration */}
            <div className="glass-card rounded-[2.5rem] border-white/10 bg-white/5 overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-black text-white">Paramètres Instance</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Variables de Simulation</p>
                </div>
                <Settings2 className="h-5 w-5 text-brand-cotton" />
              </div>
              <div className="p-8 space-y-8">
                {Object.entries(instanceData).map(([key, value]) => (
                  <div key={key} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{key.replace('_', ' ')}</Label>
                      <Badge className="bg-brand-primary/10 border-brand-primary/20 text-brand-primary font-mono text-[11px] px-3 py-1 rounded-lg">
                        {value.toLocaleString()}
                      </Badge>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([v]) => updateInstanceValue(key, v)}
                      min={0}
                      max={key === 'income' ? 200000 : key === 'credit_score' ? 850 : 100}
                      step={key === 'income' ? 1000 : 1}
                      className="brand-slider"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Target Outcome Hub */}
            <div className="glass-card rounded-[2.5rem] border-white/10 bg-white/5 overflow-hidden">
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-display font-black text-white">Vecteur Cible</h3>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Objectif de Convergence</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-14 rounded-2xl font-display font-black uppercase tracking-widest text-[10px] transition-all border",
                      targetOutcome === 1
                        ? "bg-brand-primary/20 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/20"
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                    onClick={() => setTargetOutcome(1)}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Favorable (1)
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 h-14 rounded-2xl font-display font-black uppercase tracking-widest text-[10px] transition-all border",
                      targetOutcome === 0
                        ? "bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/20"
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                    onClick={() => setTargetOutcome(0)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Défavorable (0)
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-16 rounded-[1.5rem] bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-brand-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                  Lancer le Moteur WhatIf
                </>
              )}
            </Button>
          </div>

          {/* Results Stage */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center glass-card rounded-[3rem] border-white/5 bg-white/5 border-dashed border-2 py-40 gap-8 animate-pulse">
                <div className="relative">
                  <Loader2 className="h-24 w-24 text-brand-primary animate-spin" />
                  <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-3xl font-display font-black text-white">Génération des trajectoires...</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Optimisation des modifications minimales</p>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
                {/* Explanation Banner */}
                <div className="glass-card p-10 rounded-[3rem] border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 to-transparent relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Info className="h-32 w-32 text-brand-primary" />
                  </div>
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary border border-brand-primary/50 flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/40">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary italic">Insight Analytique</h4>
                      <p className="text-2xl font-display font-black text-white leading-tight">
                        {results.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Counterfactuals Feed */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-6">
                    <h3 className="text-xl font-display font-black text-white flex items-center gap-4">
                      Trajectoires <span className="text-white/20 font-medium italic">({results.counterfactuals?.length || 0})</span>
                    </h3>
                    <div className="h-px flex-1 mx-8 bg-white/5" />
                  </div>

                  <div className="grid gap-6">
                    {results.counterfactuals?.map((cf, index) => (
                      <div key={index} className="glass-card rounded-[2.5rem] border-white/10 bg-white/5 overflow-hidden group hover:border-brand-primary/40 transition-all duration-500">
                        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-display font-black text-xs">
                              {index + 1}
                            </span>
                            <h4 className="text-sm font-display font-black text-white uppercase tracking-widest italic">Scénario de Déviance</h4>
                          </div>
                          <Badge className="bg-brand-cotton text-[#0A0A0B] font-display font-black uppercase tracking-tighter text-[9px] px-3 py-1">
                            Confiance: {(cf.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>

                        <div className="p-8 space-y-4">
                          {cf.changes?.map((change, i) => (
                            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                              <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                                  <Zap className={cn("h-4 w-4", change.impact === 'high' || change.impact === 'very high' ? 'text-brand-primary' : 'text-brand-cotton')} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{change.attribute.replace('_', ' ')}</p>
                                  <div className="flex items-center gap-4">
                                    <span className="text-lg font-display font-black text-white/40">
                                      {typeof change.from === 'number' ? change.from.toLocaleString() : change.from}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-brand-primary animate-in slide-in-from-left-2 infinite" />
                                    <span className="text-lg font-display font-black text-brand-primary underline decoration-brand-primary/30 underline-offset-4">
                                      {typeof change.to === 'number' ? change.to.toLocaleString() : change.to}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 self-end md:self-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-display font-black uppercase text-[9px] tracking-widest px-3 py-1 ring-1 ring-white/5",
                                    (change.impact === 'high' || change.impact === 'very high')
                                      ? 'border-brand-primary/50 text-brand-primary bg-brand-primary/5'
                                      : 'border-white/20 text-white/40 bg-white/5'
                                  )}
                                >
                                  Impact: {change.impact}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center glass-card rounded-[3rem] border-white/5 bg-white/5 border-dashed border-2 py-40 gap-10 group">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-brand-primary/40 group-hover:bg-brand-primary/5">
                    <Lightbulb className="h-12 w-12 text-white/10 group-hover:text-brand-primary transition-colors duration-500" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-2xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center animate-bounce shadow-lg shadow-brand-primary/20">
                    <Clock className="h-5 w-5 text-brand-primary" />
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-sm">
                  <h3 className="text-3xl font-display font-black text-white">Moteur de Simulation</h3>
                  <p className="text-sm text-white/30 font-display font-medium leading-relaxed">
                    Configurez vos variables de simulation et lancez l'analyse pour projeter des scénarios alternatifs de décision.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
