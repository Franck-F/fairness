'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    Info,
    AlertTriangle,
    CheckCircle2,
    BarChart,
    Activity,
    ArrowUpDown,
    Hash
} from 'lucide-react'

export function InitialAnalysisStep({ data, recommendations, qualityScore }) {
    if (!data) {
        return (
            <div className="py-12 text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto" />
                <h3 className="text-xl font-bold">Analyse indisponible</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Le moteur d'analyse n'a pas pu traiter ce dataset. Vérifiez que votre backend est lancé sur le port 8000.
                </p>
                <div className="pt-4">
                    <Alert className="bg-primary/5 border-primary/20 max-w-sm mx-auto">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Conseil Expert</AlertTitle>
                        <AlertDescription className="text-xs">
                            Essayez de sélectionner à nouveau le dataset ou de rafraîchir la page si le serveur vient d'être démarré.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Quality Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-card to-muted/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            Score de Qualité
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{qualityScore}%</div>
                        <Progress value={qualityScore} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            Base sur les valeurs manquantes, outliers et desequilibres.
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            Recommandations Expert
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {recommendations && recommendations.length > 0 ? (
                                recommendations.map((rec, i) => (
                                    <Alert key={i} variant={rec.severity === 'high' ? 'destructive' : 'default'} className="py-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle className="text-xs font-bold">{rec.type.toUpperCase()}</AlertTitle>
                                        <AlertDescription className="text-xs">
                                            {rec.message}
                                        </AlertDescription>
                                    </Alert>
                                ))
                            ) : (
                                <div className="flex items-center gap-2 text-green-500 text-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Données de haute qualité détectées.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        Statistiques Avancées
                    </CardTitle>
                    <CardDescription>
                        Analyse approfondie des moments statistiques et anomalies
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Variable</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Moyenne</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Skewness</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Kurtosis</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Outliers</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Zéros</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data).map(([col, stats]) => (
                                    <tr key={col} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                        <td className="py-2 px-4 font-medium flex items-center gap-2">
                                            <Hash className="h-3 w-3 text-muted-foreground" />
                                            {col}
                                        </td>
                                        <td className="text-right py-2 px-4">{stats.mean.toFixed(2)}</td>
                                        <td className={`text-right py-2 px-4 ${Math.abs(stats.skewness) > 1 ? 'text-orange-500 font-bold' : ''}`}>
                                            {stats.skewness.toFixed(3)}
                                        </td>
                                        <td className="text-right py-2 px-4">{stats.kurtosis.toFixed(3)}</td>
                                        <td className={`text-right py-2 px-4 ${stats.outliers_count > 0 ? 'text-red-500 underline decoration-dotted' : ''}`}>
                                            {stats.outliers_count}
                                        </td>
                                        <td className="text-right py-2 px-4 text-muted-foreground">{stats.zeros_count}</td>
                                        <td className="text-right py-2 px-4">
                                            {Math.abs(stats.skewness) < 0.5 && stats.outliers_count === 0 ? (
                                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Sain</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">À Surveiller</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
