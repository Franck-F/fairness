import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie, Legend
} from 'recharts'
import { AlertCircle, Users, Target, Link2, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#06b6d4']

export function DataBiasAnalysis({ auditId, datasetId, sensitiveAttributes, targetColumn }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [selectedAttr, setSelectedAttr] = useState(sensitiveAttributes[0] || '')

    useEffect(() => {
        const fetchDataBias = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'}/api/fairness/bias-analysis`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dataset_id: datasetId,
                        target_column: targetColumn,
                        sensitive_attributes: sensitiveAttributes
                    })
                })

                if (!response.ok) throw new Error('Failed to fetch data bias analysis')
                const result = await response.json()
                setData(result)
            } catch (err) {
                console.error('Data bias error:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (datasetId) fetchDataBias()
    }, [datasetId, targetColumn, sensitiveAttributes])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-full" />
                <div className="text-white/40 text-sm">Analyse approfondie du dataset en cours...</div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur d'analyse</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!data) return null

    const currentDemographics = data.demographics[selectedAttr] || []
    const currentSuccessRates = data.success_rates[selectedAttr] || []
    const currentProxies = data.proxy_correlations[selectedAttr] || []

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-400" />
                        Analyse par attribut sensible
                    </h3>
                    <p className="text-xs text-white/40">Visualisez les déséquilibres directement dans les données sources</p>
                </div>
                <Select value={selectedAttr} onValueChange={setSelectedAttr}>
                    <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Choisir un attribut" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {sensitiveAttributes.map(attr => (
                            <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Distribution Démographique */}
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                            Distribution Démographique
                            <Info className="h-3 w-3 text-white/30 cursor-help" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={currentDemographics}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {currentDemographics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Taux de succès historique */}
                <Card className="bg-zinc-900/50 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                            <Target className="h-4 w-4 text-emerald-400" />
                            Taux de Succès Historique
                        </CardTitle>
                        <CardDescription className="text-[10px]">Parité de résultat dans les données réelles (Outcome: {targetColumn})</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentSuccessRates} layout="vertical" margin={{ left: 40, right: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff10" />
                                <XAxis type="number" hide domain={[0, 1]} />
                                <YAxis dataKey="group" type="category" stroke="#ffffff40" fontSize={10} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-zinc-900 border border-white/10 p-2 rounded-lg text-xs">
                                                    <p className="font-bold text-white">{payload[0].payload.group}</p>
                                                    <p className="text-emerald-400">Taux: {(payload[0].value * 100).toFixed(1)}%</p>
                                                    <p className="text-white/40">Effectif: {payload[0].payload.count}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                                    {currentSuccessRates.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.rate > 0.5 ? '#10b981' : '#f59e0b'} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Proxy Detection */}
            <Card className="bg-zinc-900/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-amber-400" />
                        Détection de Variables Proxy
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Ces variables sont fortement corrélées à l'attribut <span className="text-indigo-400 font-bold">{selectedAttr}</span> et peuvent introduire des biais cachés.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                        {currentProxies.length > 0 ? (
                            currentProxies.map((proxy, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        <span className="text-xs font-medium text-white/80">{proxy.feature}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500/50 rounded-full"
                                                style={{ width: `${proxy.abs_correlation * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-white/40">
                                            {proxy.correlation > 0 ? '+' : ''}{proxy.correlation.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-8 text-center text-xs text-white/20 italic">
                                Aucune corrélation significative détectée pour cet attribut.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Alert className="bg-indigo-500/5 border-indigo-500/20">
                <Info className="h-4 w-4 text-indigo-400" />
                <AlertTitle className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Note Méthodologique</AlertTitle>
                <AlertDescription className="text-xs text-indigo-200/60">
                    L'analyse des variables proxy permet d'identifier des informations redondantes avec les attributs sensibles. Même si vous supprimez l'attribut "{selectedAttr}", le modèle peut "apprendre" le biais à travers ces proxies.
                </AlertDescription>
            </Alert>
        </div>
    )
}
