'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    ScatterChart,
    Layers,
    Target,
    Grid3X3,
    BarChart3
} from 'lucide-react'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export function AdvancedEDAStep({ targetDistributions, dimReduction, targetColumn }) {
    const [selectedCol, setSelectedCol] = useState(Object.keys(targetDistributions || {})[0] || '')

    const plotlyLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(43,40,42,0.05)',
        font: { color: '#E8C0E9', family: 'Inter, sans-serif' },
        margin: { t: 40, r: 20, b: 40, l: 50 },
        colorway: ['#E606B6', '#EA60D1', '#E8C0E9', '#402B3C', '#FF0000'],
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Tabs defaultValue="target-analysis">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="target-analysis" className="gap-2">
                        <Target className="h-4 w-4" />
                        Analyse par Variable Cible
                    </TabsTrigger>
                    <TabsTrigger value="dim-reduction" className="gap-2">
                        <Layers className="h-4 w-4" />
                        Réduction de Dimension
                    </TabsTrigger>
                </TabsList>

                {/* Target-based Distribution analysis */}
                <TabsContent value="target-analysis" className="mt-4 space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Distributions par {targetColumn || 'Cible'}</CardTitle>
                                <CardDescription>Analyse de l'influence des features sur la variable cible</CardDescription>
                            </div>
                            <Select value={selectedCol} onValueChange={setSelectedCol}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Choisir une feature" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(targetDistributions || {}).map(col => (
                                        <SelectItem key={col} value={col}>{col}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {selectedCol && targetDistributions[selectedCol] ? (
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

                {/* PCA / t-SNE analysis */}
                <TabsContent value="dim-reduction" className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <Grid3X3 className="h-4 w-4 text-primary" />
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

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-md flex items-center gap-2">
                                    <ScatterChart className="h-4 w-4 text-primary" />
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
