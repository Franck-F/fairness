'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Target, ShieldAlert, BarChart3, ChevronRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function DatasetIntelligence({ intelligence, preview, onSelectTarget, currentTarget }) {
    if (!intelligence && !preview) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* AI Suggestions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Target Suggestion */}
                <Card className="glass-card border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-all group cursor-pointer"
                    onClick={() => onSelectTarget(intelligence?.suggested_target)}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge className="bg-brand-primary hover:bg-brand-primary text-white text-[10px] uppercase font-black tracking-widest px-2 py-0.5">IA Suggéré</Badge>
                            <Target className="h-5 w-5 text-brand-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <CardTitle className="text-xl font-display font-black text-white mt-2">Variable Cible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-display font-bold text-white mb-1">
                            {intelligence?.suggested_target || '...'}
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Cible prédictive optimale détectée par l'analyse sémantique.
                        </p>
                    </CardContent>
                </Card>

                {/* Problem Type Suggestion */}
                <Card className="glass-card border-brand-cotton/20 bg-brand-cotton/5">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="border-brand-cotton text-brand-cotton text-[10px] uppercase font-black tracking-widest px-2 py-0.5">Architecture</Badge>
                            <ShieldAlert className="h-5 w-5 text-brand-cotton" />
                        </div>
                        <CardTitle className="text-xl font-display font-black text-white mt-2">Type de Problème</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-display font-bold text-white mb-1">
                            {intelligence?.problem_type || 'Classification'}
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Nature mathématique de la tâche prédictive détectée.
                        </p>
                    </CardContent>
                </Card>

                {/* Suggested Approach */}
                <Card className="glass-card border-white/5 bg-white/5">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="border-white/20 text-white/40 text-[10px] uppercase font-black tracking-widest px-2 py-0.5">Stratégie</Badge>
                            <BarChart3 className="h-5 w-5 text-white/40" />
                        </div>
                        <CardTitle className="text-xl font-display font-black text-white mt-2">Approche Technique</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {intelligence?.suggested_approach?.map((a, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-sm font-bold text-white">{a.step}</span>
                                    <span className="text-[10px] text-white/40 leading-none">{a.recommendation}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dataset Preview Table */}
            <Card className="glass-card border-white/5 bg-white/5 overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-display font-black text-white uppercase tracking-tight">Aperçu Stratégique</CardTitle>
                        <p className="text-xs text-white/40 font-medium">{intelligence?.dataset_summary || 'Exploration des 5 premières lignes'}</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-brand-primary animate-pulse" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    {preview && preview.length > 0 && Object.keys(preview[0]).map((col) => (
                                        <TableHead key={col} className={cn(
                                            "text-[10px] font-black uppercase tracking-widest text-white/60 py-4",
                                            col === currentTarget ? "text-brand-primary bg-brand-primary/5" : ""
                                        )}>
                                            {col}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preview?.map((row, i) => (
                                    <TableRow key={i} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                        {Object.entries(row).map(([col, val], j) => (
                                            <TableCell key={j} className={cn(
                                                "text-xs font-medium py-4 text-white/80",
                                                col === currentTarget ? "bg-brand-primary/5 text-brand-primary" : ""
                                            )}>
                                                {val?.toString() || '-'}
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
    )
}
