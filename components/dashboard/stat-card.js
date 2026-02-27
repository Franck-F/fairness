import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({ label, value, icon: Icon, trend, trendValue, description, className }) {
  return (
    <Card className={cn('p-5 hover:border-primary/20 transition-colors', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
            trend === 'up' ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10' : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10'
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </Card>
  )
}
