import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type WorkspaceHeaderProps = {
  badge?: string
  title: string
  description: string
  meta?: ReactNode
  className?: string
}

export function WorkspaceHeader({ badge, title, description, meta, className }: WorkspaceHeaderProps) {
  return (
    <section className={cn('grid gap-4 border-b pb-5 lg:grid-cols-[1fr_auto]', className)}>
      <div className="max-w-3xl">
        {badge && <Badge variant="outline" className="mb-3 text-primary border-primary/30">{badge}</Badge>}
        <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {meta ? <div className="min-w-0 lg:min-w-72">{meta}</div> : null}
    </section>
  )
}

type MetricItem = {
  label: string
  value: ReactNode
  icon?: LucideIcon
  tone?: 'primary' | 'secondary' | 'tertiary'
  hint?: ReactNode
}

type MetricStripProps = {
  items: MetricItem[]
  columns?: string
  className?: string
}

const toneClass = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

export function MetricStrip({ items, columns = 'sm:grid-cols-2 xl:grid-cols-4', className }: MetricStripProps) {
  return (
    <section className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', className)}>
      <div className={cn('grid', columns)}>
        {items.map((item, index) => {
          const Icon = item.icon
          const tone = item.tone ?? 'primary'

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex min-h-20 items-center gap-4 border-b px-6 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 hover:bg-surface-container-low/50 transition-colors"
            >
              {Icon ? (
                <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-lg', toneClass[tone])}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              ) : null}
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{item.value}</p>
                {item.hint ? <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p> : null}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

type ActionPanelProps = {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function ActionPanel({ title, description, children, className }: ActionPanelProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <SectionHeading title={title} description={description} />
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
    </section>
  )
}

type SectionHeadingProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
