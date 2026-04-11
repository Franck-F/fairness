'use client'

import { useState } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Bot,
  Sparkles,
  Play,
  Loader2,
  ShieldCheck,
  Info,
  Scale,
  AlertTriangle,
  Globe,
  KeyRound,
  Code2,
  Timer,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

const RISK_STYLES = {
  vert: {
    label: 'Risque faible',
    badge: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
    dot: 'bg-green-500',
    ring: 'ring-green-500/30',
    text: 'text-green-600 dark:text-green-400',
  },
  orange: {
    label: 'Risque moyen',
    badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    dot: 'bg-orange-500',
    ring: 'ring-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
  },
  rouge: {
    label: 'Risque eleve',
    badge: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    dot: 'bg-red-500',
    ring: 'ring-red-500/30',
    text: 'text-red-600 dark:text-red-400',
  },
}

function riskStyle(level) {
  return RISK_STYLES[level] || RISK_STYLES.vert
}

const DEFAULT_PAYLOAD_TEMPLATE = `{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "user", "content": "{{PROMPT}}" }
  ]
}`

const DEFAULT_HEADERS = `{
  "Authorization": "Bearer sk-..."
}`

export default function LlmAuditPage() {
  const { session } = useAuth()

  const [url, setUrl] = useState('https://api.openai.com/v1/chat/completions')
  const [method, setMethod] = useState('POST')
  const [headersText, setHeadersText] = useState(DEFAULT_HEADERS)
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD_TEMPLATE)
  const [responsePath, setResponsePath] = useState('choices.0.message.content')
  const [timeoutSeconds, setTimeoutSeconds] = useState(30)
  const [maxPrompts, setMaxPrompts] = useState(10)

  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)

  const parseJsonField = (text, fieldName) => {
    const trimmed = (text || '').trim()
    if (!trimmed) return {}
    try {
      return JSON.parse(trimmed)
    } catch (e) {
      throw new Error(`Le champ "${fieldName}" n'est pas un JSON valide.`)
    }
  }

  const handleRun = async () => {
    if (!url.trim()) {
      toast.error('Indiquez l\'URL de votre chatbot ou LLM.')
      return
    }

    let parsedHeaders
    let parsedPayload
    try {
      parsedHeaders = parseJsonField(headersText, 'En-tetes HTTP')
      parsedPayload = parseJsonField(payloadText, 'Payload template')
    } catch (e) {
      toast.error(e.message)
      return
    }

    if (!payloadText.includes('{{PROMPT}}')) {
      toast.error('Votre payload doit contenir le marqueur {{PROMPT}} pour que nous puissions injecter les prompts de test.')
      return
    }

    setRunning(true)
    setResult(null)
    try {
      const response = await fetch('/api/llm-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          endpoint: {
            url: url.trim(),
            method: method || 'POST',
            headers: parsedHeaders,
            payload_template: parsedPayload,
            response_path: responsePath.trim() || 'response',
            timeout_seconds: timeoutSeconds,
          },
          max_prompts: maxPrompts,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'L\'audit a echoue.')
      }
      setResult(data)
      toast.success('Audit termine.')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setRunning(false)
    }
  }

  const overall = result ? riskStyle(result.overall_risk) : null

  return (
    <DashboardShell>
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

        <PageHeader
          icon={Bot}
          title="Audit"
          titleHighlight="Chatbot / LLM"
          description="Testez automatiquement votre assistant conversationnel contre une banque de prompts sensibles (genre, origine, age, religion, handicap, orientation)."
          actions={
            <Card className="hidden lg:flex px-4 py-2.5 items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Conformite art. 50 AI Act</span>
            </Card>
          }
        />

        <Card className="p-5 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-display font-semibold text-foreground">Comment ca marche ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous envoyons a votre chatbot des paires de prompts identiques a une seule variable pres
                (par exemple "Pierre" vs "Marie"). Si les reponses different systematiquement en sentiment,
                longueur ou taux de refus, cela revele un biais. Vous gardez le controle total : votre LLM
                et vos cles restent chez vous, nous ne faisons que transiter les requetes.
              </p>
            </div>
          </div>
        </Card>

        {/* Formulaire */}
        <Card className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground">Configuration de votre endpoint</h2>
              <p className="text-sm text-muted-foreground">Renseignez les memes informations que celles fournies par votre fournisseur LLM.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-3 w-3" /> URL de l'API
              </Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.openai.com/v1/chat/completions"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Methode HTTP</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="h-3 w-3" /> En-tetes HTTP (JSON)
              </Label>
              <Textarea
                value={headersText}
                onChange={(e) => setHeadersText(e.target.value)}
                className="font-mono text-xs h-36"
                placeholder='{ "Authorization": "Bearer sk-..." }'
              />
              <p className="text-xs text-muted-foreground">Cle d'API ou token d'authentification.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Code2 className="h-3 w-3" /> Payload template (JSON)
              </Label>
              <Textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                className="font-mono text-xs h-36"
                placeholder='{ "messages": [{ "role": "user", "content": "{{PROMPT}}" }] }'
              />
              <p className="text-xs text-muted-foreground">
                Le marqueur <code className="bg-muted px-1 rounded">{'{{PROMPT}}'}</code> sera remplace par chaque prompt de test.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-3 w-3" /> Chemin de la reponse (JSON path)
              </Label>
              <Input
                value={responsePath}
                onChange={(e) => setResponsePath(e.target.value)}
                placeholder="choices.0.message.content"
              />
              <p className="text-xs text-muted-foreground">
                Indique ou se trouve le texte de reponse dans le JSON renvoye par votre API (ex OpenAI : choices.0.message.content).
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Timer className="h-3 w-3" /> Timeout
                </Label>
                <Badge variant="secondary">{timeoutSeconds} s</Badge>
              </div>
              <Slider
                value={[timeoutSeconds]}
                onValueChange={(v) => setTimeoutSeconds(v[0])}
                min={5}
                max={120}
                step={5}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre de paires de prompts a tester</Label>
              <Badge variant="secondary">{maxPrompts}</Badge>
            </div>
            <Slider
              value={[maxPrompts]}
              onValueChange={(v) => setMaxPrompts(v[0])}
              min={2}
              max={30}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Plus de paires = plus de precision, mais plus d'appels a votre LLM (et donc plus de cout).
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleRun} disabled={running} className="min-w-[200px]">
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Audit en cours...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Lancer l'audit
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Resultats */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Risque global */}
            <Card className={cn('p-6 border', overall?.badge?.includes('red') ? 'border-red-500/30' : overall?.badge?.includes('orange') ? 'border-orange-500/30' : 'border-green-500/30')}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center ring-4', overall?.ring)}>
                    <div className={cn('w-8 h-8 rounded-full', overall?.dot)} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risque global</p>
                    <h2 className={cn('text-2xl font-display font-bold', overall?.text)}>{overall?.label}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.n_pairs_tested} paires de prompts testees sur votre LLM.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Resume NL */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-display font-semibold text-foreground">En clair</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.natural_language_summary}</p>
                </div>
              </div>
            </Card>

            {/* AI Act */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-display font-semibold text-foreground">Pertinence AI Act</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{result.ai_act_relevance}</p>
                </div>
              </div>
            </Card>

            {/* Scores par categorie */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-foreground">Scores par categorie</h3>
                <Badge variant="secondary">{result.category_scores?.length || 0} categories</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categorie</TableHead>
                    <TableHead className="text-right">Paires</TableHead>
                    <TableHead className="text-right">Ecart longueur</TableHead>
                    <TableHead className="text-right">Ecart sentiment</TableHead>
                    <TableHead className="text-right">Refus asymetrique</TableHead>
                    <TableHead className="text-right">Risque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(result.category_scores || []).map((cat) => {
                    const style = riskStyle(cat.risk_level)
                    return (
                      <TableRow key={cat.category}>
                        <TableCell className="font-medium">{cat.category}</TableCell>
                        <TableCell className="text-right">{cat.n_pairs}</TableCell>
                        <TableCell className="text-right">{(cat.avg_length_diff * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right">{(cat.avg_sentiment_diff * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right">{(cat.refusal_asymmetry * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right">
                          <Badge className={cn('border', style.badge)}>{style.label}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>

            {/* Detail des paires */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-foreground">Detail des paires testees</h3>
                <Badge variant="secondary">{result.pair_results?.length || 0}</Badge>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {(result.pair_results || []).map((pair, index) => {
                  const hasBias = pair.bias_indicators && pair.bias_indicators.length > 0
                  return (
                    <AccordionItem key={index} value={`pair-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3 flex-1 pr-3">
                          <Badge variant="outline">{pair.category}</Badge>
                          <span className="text-xs text-muted-foreground">Attribut : {pair.attribute}</span>
                          {hasBias ? (
                            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 ml-auto">
                              <AlertTriangle className="h-3 w-3 mr-1" /> {pair.bias_indicators.length} signal{pair.bias_indicators.length > 1 ? 'es' : ''}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 ml-auto">
                              OK
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prompt A</p>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                              <p className="text-xs text-foreground/80 italic">{pair.prompt_a}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reponse A</p>
                            <div className="p-3 rounded-lg bg-muted/30 border border-border max-h-64 overflow-y-auto">
                              <p className="text-xs text-foreground/80 whitespace-pre-wrap">{pair.response_a}</p>
                            </div>
                            {pair.refusal_a && (
                              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30">Refus detecte</Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prompt B</p>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                              <p className="text-xs text-foreground/80 italic">{pair.prompt_b}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reponse B</p>
                            <div className="p-3 rounded-lg bg-muted/30 border border-border max-h-64 overflow-y-auto">
                              <p className="text-xs text-foreground/80 whitespace-pre-wrap">{pair.response_b}</p>
                            </div>
                            {pair.refusal_b && (
                              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30">Refus detecte</Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Ecart longueur</p>
                            <p className="text-sm font-display font-bold text-foreground">
                              {(pair.length_diff_ratio * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Ecart sentiment</p>
                            <p className="text-sm font-display font-bold text-foreground">
                              {pair.sentiment_diff >= 0 ? '+' : ''}{(pair.sentiment_diff * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                            <p className="text-[10px] text-muted-foreground uppercase">Refus asym.</p>
                            <p className="text-sm font-display font-bold text-foreground">
                              {pair.refusal_a !== pair.refusal_b ? 'Oui' : 'Non'}
                            </p>
                          </div>
                        </div>

                        {hasBias && (
                          <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                            <p className="text-[10px] text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">Indicateurs de biais</p>
                            <ul className="space-y-1">
                              {pair.bias_indicators.map((indicator, i) => (
                                <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                                  <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                  {indicator}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
