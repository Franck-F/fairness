'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Activity,
    Layers,
    Target,
    LayoutGrid,
    BarChart3,
    Brain,
    Sparkles,
    Rocket,
    Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export function AdvancedEDAStep({
    targetDistributions,
    dimReduction,
    correlations,
    outliers,
    expert_insights,
    targetColumn
}) {
    const [selectedCol, setSelectedCol] = useState('')

    // Sync selectedCol when data arrives
    useEffect(() => {
        if (targetDistributions && Object.keys(targetDistributions).length > 0) {
            if (!selectedCol || !targetDistributions[selectedCol]) {
                setSelectedCol(Object.keys(targetDistributions)[0])
            }
        }
    }, [targetDistributions, selectedCol])

    const plotlyLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(43,40,42,0.05)',
        font: { color: '#E8C0E9', family: 'Inter, sans-serif' },
        margin: { t: 40, r: 20, b: 40, l: 50 },
        colorway: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'],
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Tabs defaultValue="expert-exploration">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="target-analysis" className="gap-2">
                        <Target className="h-4 w-4" />
                        Variables
                    </TabsTrigger>
                    <TabsTrigger value="expert-exploration" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        Exploration Expert
                    </TabsTrigger>
                    <TabsTrigger value="dim-reduction" className="gap-2">
                        <Layers className="h-4 w-4" />
                        Réduction de Dimension
                    </TabsTrigger>
                </TabsList>

                {/* Target-based Distribution analysis */}
                <TabsContent value="target-analysis" className="mt-4 space-y-4">
                    <Card className="glass-card border-white/5 bg-white/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Distributions par {targetColumn || 'Cible'}</CardTitle>
                                <CardDescription>Analyse de l'influence des features sur la variable cible</CardDescription>
                            </div>
                            <Select value={selectedCol} onValueChange={setSelectedCol}>
                                <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                                    <SelectValue placeholder="Choisir une feature" />
                                </SelectTrigger>
                                <SelectContent className="glass-card border-white/10 bg-[#0A0A0B]/90">
                                    {targetDistributions && Object.keys(targetDistributions).map(col => (
                                        <SelectItem key={col} value={col}>{col}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {selectedCol && targetDistributions && targetDistributions[selectedCol] ? (
                                <Plot
                                    data={Object.entries(targetDistributions[selectedCol]).map(([group, stats]) => ({
                                        type: 'box',
                                        name: `Cible: ${group}`,
                                        y: [stats.mean - stats.std, stats.mean, stats.median, stats.mean + stats.std],
                                        marker: { color: group === '0' ? '#402B3C' : '#E606B6' }
                                    }))}
                                    layout={{
                                        ...plotlyLayout,
                                        height: 400,
                                        title: `Distribution de ${selectedCol} par classe`,
                                        yaxis: { title: 'Valeurs' }
                                    }}
                                    className="w-full"
                                    config={{ responsive: true }}
                                />
                            ) : (
                                <div className="p-20 text-center text-muted-foreground italic">
                                    Sélectionnez une feature ou définissez une variable cible.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Expert Exploration (AI-Driven) */}
                <TabsContent value="expert-exploration" className="mt-4 space-y-6">
                    {/* AI Insights Card */}
                    {expert_insights && (
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 glass-card border-brand-primary/20 bg-brand-primary/5">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-brand-primary">
                                        <Brain className="h-5 w-5" />
                                        <CardTitle className="text-lg">Synthèse de l'Agent Expert</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-white/80 leading-relaxed text-sm">
                                    {expert_insights.summary || "Analyse en attente..."}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {expert_insights.top_features?.map(feat => (
                                            <span key={feat} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-brand-cotton">
                                                ★ {feat}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass-card border-white/10 bg-white/5">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-widest text-white/40">Verdict Qualité</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center py-6">
                                    <div className={cn(
                                        "text-xl font-black mb-2",
                                        expert_insights.quality_verdict?.toLowerCase().includes('sain') ? "text-green-400" : "text-brand-primary"
                                    )}>
                                        {expert_insights.quality_verdict || "Inconnu"}
                                    </div>
                                    <Sparkles className="h-8 w-8 text-brand-cotton animate-pulse" />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Correlation Heatmap */}
                        <Card className="glass-card border-white/5 bg-white/5">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2 text-white">
                                    <LayoutGrid className="h-4 w-4 text-brand-primary" />
                                    Matrice de Corrélation
                                </CardTitle>
                                <CardDescription>Relations linéaires entre les features numériques</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {correlations && Object.keys(correlations).length > 0 ? (
                                    <Plot
                                        data={[{
                                            z: Object.values(correlations).map(row => Object.values(row)),
                                            x: Object.keys(correlations),
                                            y: Object.keys(correlations),
                                            type: 'heatmap',
                                            colorscale: [
                                                [0, '#402B3C'],
                                                [0.5, '#E8C0E9'],
                                                [1, '#E606B6']
                                            ],
                                            showscale: false
                                        }]}
                                        layout={{
                                            ...plotlyLayout,
                                            height: 350,
                                            margin: { t: 10, b: 50, l: 50, r: 10 },
                                            xaxis: { tickangle: 45, tickfont: { size: 10 } },
                                            yaxis: { tickfont: { size: 10 } }
                                        }}
                                        className="w-full"
                                        config={{ displayModeBar: false }}
                                    />
                                ) : (
                                    <div className="p-20 text-center text-muted-foreground italic text-xs">Données insuffisantes.</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Deep Dives & Outliers */}
                        <div className="space-y-6">
                            <Card className="glass-card border-white/5 bg-white/5">
                                <CardHeader>
                                    <CardTitle className="text-md flex items-center gap-2 text-white">
                                        <Eye className="h-4 w-4 text-brand-primary" />
                                        Focus sur les Anomalies
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {outliers && outliers.length > 0 ? (
                                        outliers.map((outlier, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div>
                                                    <p className="text-xs font-bold text-white">{outlier.column}</p>
                                                    <p className="text-[10px] text-white/40">{outlier.count} outliers ({outlier.percentage}%)</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-mono text-brand-cotton">Range: [{outlier.min_outlier}..{outlier.max_outlier}]</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center text-white/20 text-xs">Aucune anomalie critique.</div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid gap-4">
                                {expert_insights?.deep_dives?.map((dive, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-brand-primary/30 transition-all cursor-pointer group">
                                        <h4 className="text-xs font-black text-brand-primary uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <Rocket className="h-3 w-3" />
                                            {dive.title}
                                        </h4>
                                        <p className="text-[11px] text-white/60 leading-tight group-hover:text-white transition-colors">{dive.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* PCA / t-SNE analysis */}
                <TabsContent value="dim-reduction" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="glass-card border-white/5 bg-white/5">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2 text-white">
                                    <LayoutGrid className="h-4 w-4 text-brand-primary" />
                                    Visualisation PCA
                                </CardTitle>
                                <CardDescription>Projection orthogonale sur les axes de variance maximale</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dimReduction?.pca ? (
                                    <Plot
                                        data={[{
                                            type: 'scatter',
                                            mode: 'markers',
                                            x: dimReduction.pca.map(p => p[0]),
                                            y: dimReduction.pca.map(p => p[1]),
                                            marker: { color: '#E606B6', size: 6, opacity: 0.6 }
                                        }]}
                                        layout={{ ...plotlyLayout, height: 350, margin: { t: 20, r: 10, b: 30, l: 30 } }}
                                        className="w-full"
                                        config={{ displayModeBar: false }}
                                    />
                                ) : (
                                    <div className="p-10 text-center text-muted-foreground text-xs">Calcul en cours...</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/5 bg-white/5">
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2 text-white">
                                    <Activity className="h-4 w-4 text-brand-primary" />
                                    Visualisation t-SNE
                                </CardTitle>
                                <CardDescription>Embedding non-linéaire préservant les voisinages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dimReduction?.tsne ? (
                                    <Plot
                                        data={[{
                                            type: 'scatter',
                                            mode: 'markers',
                                            x: dimReduction.tsne.map(p => p[0]),
                                            y: dimReduction.tsne.map(p => p[1]),
                                            marker: { color: '#EA60D1', size: 6, opacity: 0.6 }
                                        }]}
                                        layout={{ ...plotlyLayout, height: 350, margin: { t: 20, r: 10, b: 30, l: 30 } }}
                                        className="w-full"
                                        config={{ displayModeBar: false }}
                                    />
                                ) : (
                                    <div className="p-10 text-center text-muted-foreground text-xs">Calcul en cours...</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
