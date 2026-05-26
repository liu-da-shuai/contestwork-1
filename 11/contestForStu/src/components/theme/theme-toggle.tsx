import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTheme } from './theme-context'

type ThemeToggleProps = {
  compact?: boolean
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      aria-label="切换主题"
      title="切换主题"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'bg-surface-container-high text-card-foreground shadow-sm hover:bg-secondary-container',
        compact ? 'size-11 rounded-md' : 'rounded-full',
      )}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  )
}
