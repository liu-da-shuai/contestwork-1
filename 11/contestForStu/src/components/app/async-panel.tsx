import { AlertCircle, Inbox, LoaderCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PanelProps {
  title: string
  description?: string
  className?: string
}

export function LoadingPanel({ title, description, className }: PanelProps) {
  return (
    <Card className={cn('rounded-lg bg-surface-container-low', className)} aria-busy="true">
      <CardContent className="flex items-center gap-3 py-4">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-card-foreground">{title}</p>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          <div className="mt-2 grid gap-2">
            <Skeleton className="h-2.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ErrorPanel({ title, description, className }: PanelProps) {
  return (
    <Alert variant="destructive" className={cn('rounded-lg bg-surface', className)}>
      <AlertCircle aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  )
}

export function EmptyPanel({ title, description, className }: PanelProps) {
  return (
    <Card className={cn('rounded-lg border-dashed bg-surface-container-low', className)}>
      <CardContent className="flex items-center gap-3 py-4">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container">
          <Inbox aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium text-card-foreground">{title}</p>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
