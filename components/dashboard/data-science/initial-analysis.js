'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Info,
    BarChart3,
    Database,
    Layout,
    Type,
    Hash,
    AlertCircle,
    Target,
    Zap,
    Table as TableIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function InitialAnalysisStep({
    data,
    preview,
    intelligence,
    qualityScore,
    currentTarget,
    onSelectTarget
}) {
    if (!data) return null

    // Metadata summary (df.info style)
    const columns = Object.keys(data)
    const numRows = preview?.length || 0
    const numCols = columns.length

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Top Stats: Global Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass-card border-brand-primary/20 bg-brand-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-brand-primary/20">
                                <Zap className="h-5 w-5 text-brand-primary" />
                            </div>
                            <Badge className="bg-brand-primary text-white text-[9px] uppercase font-black tracking-widest px-2">Health</Badge>
                        </div>
                        <div className="text-3xl font-display font-black text-white">{qualityScore}%</div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Qualité Globale</p>
                        <Progress value={qualityScore} className="h-1.5 mt-4 bg-white/5" indicatorClassName="bg-brand-primary" />
                    </CardContent>
                </Card>

                <Card className="glass-card border-white/5 bg-white/5">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-white/10">
                                <Layout className="h-5 w-5 text-white/60" />
                            </div>
                        </div>
                        <div className="text-3xl font-display font-black text-white">{numCols}</div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Colonnes Détectées</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-white/5 bg-white/5">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-white/10">
                                <Database className="h-5 w-5 text-white/60" />
                            </div>
                        </div>
                        <div className="text-3xl font-display font-black text-white truncate max-w-full">
                            {intelligence?.dataset_summary?.split(' ')[0] || 'Dataset'}
                        </div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Source de Données</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-brand-cotton/20 bg-brand-cotton/5">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-brand-cotton/20">
                                <Target className="h-5 w-5 text-brand-cotton" />
                            </div>
                        </div>
                        <div className="text-xl font-display font-black text-white truncate">{currentTarget || 'Non Définie'}</div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">Variable Cible</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column Inventory (df.info) */}
                <Card className="glass-card border-white/5 bg-white/5 lg:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Info className="h-5 w-5 text-brand-primary" />
                            <CardTitle className="text-lg font-display font-black text-white uppercase tracking-tight">Inventaire (df.info)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                            {columns.map((col) => {
                                const isTarget = col === currentTarget
                                return (
                                    <div
                                        key={col}
                                        onClick={() => onSelectTarget(col)}
                                        className={cn(
                                            "p-3 rounded-xl border transition-all cursor-pointer group flex items-center justify-between",
                                            isTarget
                                                ? "bg-brand-primary/10 border-brand-primary/40"
                                                : "bg-white/[0.02] border-white/5 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                isTarget ? "bg-brand-primary text-white" : "bg-white/5 text-white/40"
                                            )}>
                                                {typeof data[col]?.mean === 'number' ? <Hash className="h-4 w-4" /> : <Type className="h-4 w-4" />}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-black text-white truncate">{col}</p>
                                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                                    {typeof data[col]?.mean === 'number' ? 'Numérique' : 'Catégoriel'}
                                                </p>
                                            </div>
                                        </div>
                                        {isTarget && (
                                            <Badge className="bg-brand-primary text-white text-[8px] uppercase font-black tracking-widest ml-2">Target</Badge>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Strategic Preview (5 rows) */}
                <Card className="glass-card border-white/5 bg-white/5 lg:col-span-2 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TableIcon className="h-5 w-5 text-brand-cotton" />
                            <div>
                                <CardTitle className="text-lg font-display font-black text-white uppercase tracking-tight">Aperçu Stratégique</CardTitle>
                                <CardDescription className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Premières observations structurelles</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent bg-white/[0.02]">
                                        {columns.map((col) => (
                                            <TableHead key={col} className={cn(
                                                "text-[10px] font-black uppercase tracking-widest text-white/60 py-4",
                                                col === currentTarget ? "text-brand-primary" : ""
                                            )}>
                                                {col}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {preview?.map((row, i) => (
                                        <TableRow key={i} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                                            {columns.map((col) => (
                                                <TableCell key={col} className={cn(
                                                    "text-xs font-medium py-4 text-white/80 whitespace-nowrap",
                                                    col === currentTarget ? "text-brand-primary bg-brand-primary/5" : ""
                                                )}>
                                                    {row[col]?.toString() || '-'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Statistical Moments (df.describe) */}
            <Card className="glass-card border-white/5 bg-white/5 overflow-hidden">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-brand-primary" />
                        <div>
                            <CardTitle className="text-lg font-display font-black text-white uppercase tracking-tight">Statistiques Descriptives (df.describe)</CardTitle>
                            <CardDescription className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Analyse approfondie des distributions et anomalies</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent bg-white/[0.02]">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Variable</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Moyenne</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Médiane</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Std Dev</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Skewness</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Outliers</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60 py-4">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(data).map(([col, stats]) => {
                                    const isSkewed = Math.abs(stats.skewness) > 1.5
                                    const hasOutliers = stats.outliers_count > 0
                                    return (
                                        <TableRow key={col} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <TableCell className="py-4 flex items-center gap-2">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    col === currentTarget ? "bg-brand-primary shadow-[0_0_8px_rgba(255,105,180,0.5)]" : "bg-white/10"
                                                )} />
                                                <span className="text-xs font-black text-white/90">{col}</span>
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-bold text-white/60">{stats.mean.toFixed(2)}</TableCell>
                                            <TableCell className="text-right text-xs font-bold text-white/60">{stats.median?.toFixed(2) || '-'}</TableCell>
                                            <TableCell className="text-right text-xs font-bold text-white/60">{stats.std?.toFixed(2) || '-'}</TableCell>
                                            <TableCell className={cn(
                                                "text-right text-xs font-black",
                                                isSkewed ? "text-orange-500" : "text-white/40"
                                            )}>
                                                {stats.skewness.toFixed(3)}
                                            </TableCell>
                                            <TableCell className={cn(
                                                "text-right text-xs font-black",
                                                hasOutliers ? "text-red-500" : "text-white/40"
                                            )}>
                                                {stats.outliers_count}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {isSkewed || hasOutliers ? (
                                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[8px] uppercase font-black px-1.5 py-0">Alert</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] uppercase font-black px-1.5 py-0">Healthy</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
