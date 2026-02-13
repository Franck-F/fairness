'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    BrainCircuit,
    Rocket,
    BarChart4,
    ShieldCheck,
    Zap,
    Info
} from 'lucide-react'

export function AdvancedModelingStep({ columns, onTrain, loading }) {
    const [algorithm, setAlgorithm] = useState('logistic_regression')
    const [testSize, setTestSize] = useState([0.2])

    const algorithms = [
        {
            id: 'logistic_regression',
            name: 'Régression Logistique',
            icon: BarChart4,
            desc: 'Linéaire, robuste et hautement interprétable. Idéal pour les audits de fairness.',
            tag: 'Recommandé'
        },
        {
            id: 'xgboost',
            name: 'XGBoost',
            icon: Zap,
            desc: 'Haute performance. Gradient Boosting optimisé pour les données tabulaires.',
            tag: 'Performance'
        },
        {
            id: 'random_forest',
            name: 'Random Forest',
            icon: BrainCircuit,
            desc: 'Ensemble robuste limitant l\'overfitting par bagging.',
            tag: 'Robuste'
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Model Selection */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold">Sélection du Modèle</Label>
                    <div className="space-y-3">
                        {algorithms.map(algo => (
                            <Card
                                key={algo.id}
                                className={`cursor-pointer transition-all hover:border-primary/50 ${algorithm === algo.id ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : ''}`}
                                onClick={() => setAlgorithm(algo.id)}
                            >
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className={`p-2 rounded-lg ${algorithm === algo.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <algo.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{algo.name}</span>
                                            {algo.tag && <Badge variant="secondary" className="text-[10px] uppercase">{algo.tag}</Badge>}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{algo.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Training Parameters */}
                <div className="space-y-6">
                    <Label className="text-lg font-bold">Paramètres d'Entraînement</Label>

                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm">Répartition Train/Test</CardTitle>
                            <CardDescription>Proportion des données réservées pour l'évaluation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between text-xs font-mono">
                                <span>Train: {Math.round((1 - testSize[0]) * 100)}%</span>
                                <span>Test: {Math.round(testSize[0] * 100)}%</span>
                            </div>
                            <Slider
                                value={testSize}
                                onValueChange={setTestSize}
                                max={0.5}
                                min={0.1}
                                step={0.05}
                                className="py-4"
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-500/5 border-blue-500/20">
                        <CardContent className="p-4 flex gap-3 italic text-xs text-blue-400">
                            <Info className="h-4 w-4 shrink-0" />
                            <p>Le Senior Data Scientist recommande de valider la performance avant d'analyser le biais. Utilisez la Régression Logistique pour une interprétabilité maximale.</p>
                        </CardContent>
                    </Card>

                    <Button
                        size="lg"
                        className="w-full gap-2 h-14 text-lg font-bold group"
                        onClick={() => onTrain({ algorithm, test_size: testSize[0] })}
                        disabled={loading}
                    >
                        {loading ? (
                            <Zap className="h-6 w-6 animate-pulse" />
                        ) : (
                            <Rocket className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                        {loading ? "Entraînement en cours..." : "Lancer la Modélisation Expert"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
