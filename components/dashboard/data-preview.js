'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function DataPreview({ dataset, onNext }) {
  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  if (!dataset || !dataset.data) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune donnée à afficher</p>
        </CardContent>
      </Card>
    )
  }

  const { data, columns, stats } = dataset
  const totalPages = Math.ceil(data.length / rowsPerPage)
  const displayData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  const getTypeColor = (type) => {
    switch (type) {
      case 'numeric':
        return 'bg-blue-100 text-blue-800'
      case 'categorical':
        return 'bg-green-100 text-green-800'
      case 'boolean':
        return 'bg-purple-100 text-purple-800'
      case 'datetime':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lignes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rows}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Colonnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.columns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valeurs Manquantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missingValues || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.missingValues || 0) / (stats.rows * stats.columns) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taille</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.fileSize / 1024 / 1024).toFixed(2)} MB</div>
          </CardContent>
        </Card>
      </div>

      {/* Column Types */}
      <Card>
        <CardHeader>
          <CardTitle>Types de Colonnes</CardTitle>
          <CardDescription>Détection automatique des types de données</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {columns.map((col, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                <span className="text-sm font-medium">{col.name}</span>
                <Badge className={getTypeColor(col.type)}>
                  {col.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des Données</CardTitle>
          <CardDescription>
            Affichage de {displayData.length} lignes sur {stats.rows} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="relative overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium sticky left-0 bg-background">#</th>
                    {columns.map((col, idx) => (
                      <th key={idx} className="p-2 text-left font-medium whitespace-nowrap">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium sticky left-0 bg-background">
                        {page * rowsPerPage + rowIdx + 1}
                      </td>
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="p-2 whitespace-nowrap">
                          {row[col.name] === null || row[col.name] === undefined || row[col.name] === '' ? (
                            <span className="text-muted-foreground italic">null</span>
                          ) : (
                            String(row[col.name])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page + 1} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Retour</Button>
        <Button onClick={onNext}>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Continuer vers la Configuration
        </Button>
      </div>
    </div>
  )
}
