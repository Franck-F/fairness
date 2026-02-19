import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Lightbulb, FileText, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

export function LLMAnalysis({ insights }) {
    if (!insights) return null

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Executive Summary */}
            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-400">
                        <Bot className="h-6 w-6" />
                        Synthèse Exécutive (IA)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none text-white/80 text-sm leading-relaxed prose-headings:text-indigo-300 prose-strong:text-white prose-p:mb-4 prose-li:mb-1">
                        <ReactMarkdown>
                            {insights.executive_summary}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">

                {/* Interpretations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-400">
                            <Brain className="h-5 w-5" />
                            Interprétation des Métriques
                        </CardTitle>
                        <CardDescription>Analyse sémantique des résultats</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(insights.interpretations || {}).map(([attr, text]) => (
                            <div key={attr} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-xs font-bold uppercase text-white/40 mb-2">{attr}</p>
                                <div className="prose prose-invert max-w-none text-sm text-white/80 leading-relaxed prose-p:m-0">
                                    <ReactMarkdown>{text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-400">
                            <Lightbulb className="h-5 w-5" />
                            Recommandations Intelligentes
                        </CardTitle>
                        <CardDescription>Actions priorisées par impact</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(insights.recommendations || []).map((rec, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                                    <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-500">
                                        {rec.priority}
                                    </Badge>
                                </div>
                                <p className="text-xs text-white/60">{rec.description}</p>
                                <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                    <span className="text-xs text-green-400 font-bold">Gain: {rec.impact}</span>
                                    <span className="text-xs text-white/40">Effort: {rec.effort}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
