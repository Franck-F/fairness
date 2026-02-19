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
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'categorical':
        return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
      case 'boolean':
        return 'bg-brand-cotton/10 text-brand-cotton border-brand-cotton/20'
      case 'datetime':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      default:
        return 'bg-white/10 text-white/40 border-white/10'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Lignes', value: stats.rows.toLocaleString(), icon: AlertCircle },
          { label: 'Colonnes', value: stats.columns, icon: AlertCircle },
          {
            label: 'Manquants',
            value: stats.missingValues || 0,
            sub: `${((stats.missingValues || 0) / (stats.rows * stats.columns) * 100).toFixed(1)}%`,
            icon: AlertCircle
          },
          { label: 'Taille', value: `${(stats.fileSize / 1024 / 1024).toFixed(2)} MB`, icon: AlertCircle }
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border-white/5 hover:border-brand-primary/20 transition-all group">
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">{item.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-display font-black text-white group-hover:text-brand-primary transition-colors">{item.value}</h3>
              {item.sub && <span className="text-[10px] text-brand-cotton font-bold">{item.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Column Types */}
      <div className="glass-card rounded-3xl p-8 border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
            <CheckCircle2 className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h4 className="text-xl font-display font-black text-white">Architecture des Données</h4>
            <p className="text-xs text-white/40 font-display">Détection automatique des types sémantiques</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {columns.map((col, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 glass-card rounded-xl border-white/5 bg-white/5 hover:bg-white/10 transition-all group/badge">
              <span className="text-sm font-display font-bold text-white/70 group-hover/badge:text-white transition-colors">{col.name}</span>
              <Badge variant="outline" className={cn("px-2 py-0 h-5 text-[10px] font-black uppercase tracking-widest", getTypeColor(col.type))}>
                {col.type}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-end">
          <div>
            <h4 className="text-xl font-display font-black text-white mb-1">Aperçu Haute Définition</h4>
            <p className="text-xs text-white/40 font-display">
              Visualisation de {displayData.length} échantillons sur {stats.rows.toLocaleString()} au total
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Page Actuelle</p>
              <p className="text-sm font-display font-black text-brand-primary">{page + 1} <span className="text-white/20 text-xs">/ {totalPages}</span></p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <AlertCircle className="h-4 w-4 rotate-180" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white disabled:opacity-20"
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/5">#</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] border-b border-white/5 whitespace-nowrap">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/5 transition-colors group/row">
                  <td className="px-6 py-4 text-xs font-display font-black text-white/20 group-hover/row:text-brand-primary transition-colors">
                    {page * rowsPerPage + rowIdx + 1}
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm font-display text-white/60 group-hover/row:text-white transition-colors whitespace-nowrap">
                      {row[col.name] === null || row[col.name] === undefined || row[col.name] === '' ? (
                        <span className="text-white/10 italic">null</span>
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
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="ghost" className="px-8 h-12 rounded-2xl font-display font-bold uppercase text-[11px] tracking-widest text-white/40 hover:text-white">
          Retour
        </Button>
        <Button
          onClick={onNext}
          className="px-10 h-12 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-display font-black uppercase text-[11px] tracking-[0.15em] shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <CheckCircle2 className="h-4 w-4 mr-3" />
          Continuer vers la Configuration
        </Button>
      </div>
    </div>
  )
}
