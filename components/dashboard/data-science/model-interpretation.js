'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Lightbulb,
    HelpCircle,
    Eye,
    Info
} from 'lucide-react'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export function ModelInterpretationStep({ shapData, metrics }) {
    if (!shapData || !shapData.values) {
        return (
            <Card className="p-12 text-center text-muted-foreground italic">
                Lancez un modèle pour voir les interprétations SHAP.
            </Card>
        )
    }

    // Pre-process SHAP values for summary plot
    const featureNames = shapData.feature_names || []
    const meanShap = shapData.values[0].map((_, i) =>
        Math.mean(shapData.values.map(row => Math.abs(row[i])))
    )

    // Sort by importance
    const sortedFeatures = featureNames.map((name, i) => ({
        name,
        importance: meanShap[i]
    })).sort((a, b) => b.importance - a.importance).slice(0, 15)

    const plotlyLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(43,40,42,0.05)',
        font: { color: '#E8C0E9', family: 'Inter, sans-serif' },
        margin: { t: 40, r: 20, b: 40, l: 120 },
        colorway: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'],
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Model Performance Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                {Object.entries(metrics || {}).map(([name, val], i) => (
                    <Card key={i}>
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-mono uppercase text-muted-foreground">{name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="text-2xl font-bold">{typeof val === 'number' ? (val * 100).toFixed(1) : val}%</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* SHAP Importance Plot */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                            Interprétation Globale (SHAP)
                        </CardTitle>
                        <CardDescription>Importance moyenne absolue de chaque variable sur les prédictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Plot
                            data={[{
                                type: 'bar',
                                orientation: 'h',
                                y: sortedFeatures.map(f => f.name),
                                x: sortedFeatures.map(f => f.importance),
                                marker: { color: '#E606B6' }
                            }]}
                            layout={{
                                ...plotlyLayout,
                                height: 450,
                                xaxis: { title: 'Impact moyen |SHAP|' },
                                yaxis: { automargin: true }
                            }}
                            className="w-full"
                            config={{ responsive: true }}
                        />
                    </CardContent>
                </Card>

                {/* AI Recommendations */}
                <div className="space-y-4">
                    <Card className="bg-gradient-to-br from-primary/10 to-card">
                        <CardHeader>
                            <CardTitle className="text-md flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                Insights IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p className="leading-relaxed">
                                Le modèle s&apos;appuie fortement sur <span className="text-primary font-bold">{sortedFeatures[0]?.name}</span>.
                                Vérifiez s&apos;il existe un lien causal direct ou si cette variable masque un biais caché.
                            </p>
                            <div className="p-3 bg-muted/50 rounded-lg text-xs italic">
                                &quot;Une importance élevée couplée à un faible score de fairness indique souvent une Proxy Feature.&quot;
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xs flex items-center gap-2">
                                <HelpCircle className="h-3 w-3" />
                                Qu&apos;est-ce que SHAP ?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-[10px] text-muted-foreground leading-tight">
                            SHAP (SHapley Additive exPlanations) est une méthode basée sur la théorie des jeux pour expliquer les sorties de modèles de ML.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
