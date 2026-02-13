'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Wand2,
    Clock,
    Settings2,
    Database,
    CalendarClock,
    Sparkles
} from 'lucide-react'

export function FeatureEngineeringStep({ columns, onApply, loading }) {
    const [selectedDateCol, setSelectedDateCol] = useState('')
    const [lags, setLags] = useState('1,3,7')
    const [windows, setWindows] = useState('3,7')
    const [autoClean, setAutoClean] = useState(true)
    const [oneHotEncode, setOneHotEncode] = useState(true)

    const handleApply = () => {
        onApply({
            date_column: selectedDateCol,
            lags: lags.split(',').map(Number).filter(n => !isNaN(n)),
            windows: windows.split(',').map(Number).filter(n => !isNaN(n)),
            auto_clean: autoClean,
            one_hot_encode: oneHotEncode
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Preprocessing Options */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-primary" />
                            Nettoyage et Encodage
                        </CardTitle>
                        <CardDescription>Traitements standards du Senior Data Scientist</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="autoclean" checked={autoClean} onCheckedChange={setAutoClean} />
                            <Label htmlFor="autoclean" className="text-sm">Imputation automatique (médiane/mode)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="onehot" checked={oneHotEncode} onCheckedChange={setOneHotEncode} />
                            <Label htmlFor="onehot" className="text-sm">Encodage des variables catégorielles (One-Hot)</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Time-Series Feature Engineering */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-md flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            Ingénierie de Séries Temporelles
                        </CardTitle>
                        <CardDescription>Génération automatique de lags et fenêtres glissantes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Colonne Temporelle (facultatif)</Label>
                            <Select value={selectedDateCol} onValueChange={setSelectedDateCol}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une colonne date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune</SelectItem>
                                    {columns.map(col => (
                                        <SelectItem key={col} value={col}>{col}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedDateCol && selectedDateCol !== 'none' && (
                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label className="text-xs">Lags (ex: 1,3,7)</Label>
                                    <Input
                                        value={lags}
                                        onChange={e => setLags(e.target.value)}
                                        placeholder="1,3,7"
                                        className="h-8"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Fenêtres (ex: 3,7)</Label>
                                    <Input
                                        value={windows}
                                        onChange={e => setWindows(e.target.value)}
                                        placeholder="3,7"
                                        className="h-8"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
                <Button
                    size="lg"
                    className="w-full md:w-auto px-12 gap-2"
                    onClick={handleApply}
                    disabled={loading}
                >
                    {loading ? (
                        <Wand2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Sparkles className="h-5 w-5" />
                    )}
                    {loading ? "Calcul en cours..." : "Générer les Nouvelles Variables"}
                </Button>
            </div>
        </div>
    )
}
