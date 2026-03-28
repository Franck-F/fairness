import { cn } from '@/lib/utils'

export function PageHeader({ title, titleHighlight, description, icon: Icon, actions, className }) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border', className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
            {title}{titleHighlight && <span className="text-primary"> {titleHighlight}</span>}
          </h1>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
