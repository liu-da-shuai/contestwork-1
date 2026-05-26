import { Link, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, UserRound } from 'lucide-react'
import { clearCurrentUser, getDashboardPath } from '@/auth/session'
import { useSession } from '@/auth/use-session'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SessionActionsProps = {
  compact?: boolean
}

export function SessionActions({ compact = false }: SessionActionsProps) {
  const user = useSession()
  const navigate = useNavigate()

  if (!user) {
    return (
      <Button
        asChild
        size={compact ? 'icon-lg' : 'default'}
        className={cn(compact ? 'size-11 rounded-md' : 'rounded-full')}
      >
        <Link to="/login" aria-label="登录" title="登录">
          <LogIn aria-hidden="true" />
          {!compact && <span>登录</span>}
        </Link>
      </Button>
    )
  }

  function handleLogout() {
    clearCurrentUser()
    window.setTimeout(() => navigate('/', { replace: true }), 0)
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Link
          to={getDashboardPath(user)}
          className="inline-flex size-11 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container shadow-sm transition hover:bg-secondary-container/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="进入操作台"
          aria-label="进入操作台"
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <UserRound aria-hidden="true" />
          </span>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="size-11 rounded-md bg-surface-container-high"
          aria-label="退出登录"
          title="退出登录"
          onClick={handleLogout}
        >
          <LogOut aria-hidden="true" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to={getDashboardPath(user)}
        className={cn(
          'inline-flex min-h-10 min-w-0 items-center gap-2 bg-secondary-container text-sm font-semibold text-on-secondary-container shadow-sm transition hover:bg-secondary-container/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'rounded-full py-1 pl-1 pr-3',
        )}
        title="进入操作台"
      >
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          {user.name.slice(0, 1)}
        </span>
        <span className="hidden max-w-24 truncate sm:inline">{user.name}</span>
      </Link>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="rounded-full bg-surface-container-high"
        aria-label="退出登录"
        title="退出登录"
        onClick={handleLogout}
      >
        <LogOut aria-hidden="true" />
      </Button>
    </div>
  )
}
