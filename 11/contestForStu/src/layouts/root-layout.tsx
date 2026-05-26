import { NavLink, Outlet } from 'react-router-dom'
import { BookOpenCheck, ClipboardList, Home, LayoutDashboard, Trophy, Vote, Database, UserRound, PlusCircle, Inbox } from 'lucide-react'
import { getDashboardPath } from '@/auth/session'
import { useSession } from '@/auth/use-session'
import { SessionActions } from '@/components/auth/session-actions'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { cn } from '@/lib/utils'

const publicNavItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/contests', label: '竞赛', icon: ClipboardList },
  { to: '/awards', label: '获奖公示', icon: Trophy },
]

const roleNav = {
  admin: [
    { to: '/admin/dashboard', label: '运行概览', icon: LayoutDashboard },
    { to: '/admin/contests', label: '竞赛配置', icon: ClipboardList },
    { to: '/admin/data', label: '数据管理', icon: Database },
  ],
  teacher: [
    { to: '/teacher/dashboard', label: '个人中心', icon: UserRound },
    { to: '/teacher/submit-signup', label: '提交报名', icon: PlusCircle },
    { to: '/teacher/signups', label: '我的报名', icon: ClipboardList },
  ],
  reviewer: [
    { to: '/reviewer/dashboard', label: '个人中心', icon: UserRound },
    { to: '/reviewer/queue', label: '评审队列', icon: Inbox },
    { to: '/reviewer/reviews', label: '我的评审', icon: Vote },
  ],
}

export function RootLayout() {
  const user = useSession()
  const homeTarget = user ? getDashboardPath(user) : '/'
  const navItems = user ? roleNav[user.role] : publicNavItems

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-8 max-w-7xl">
          <NavLink
            to={homeTarget}
            className="mr-8 flex items-center gap-3 font-bold text-foreground focus-visible:outline-none group"
            title="首页"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:bg-primary/90 group-hover:scale-105 transition-all duration-300">
              <BookOpenCheck aria-hidden="true" className="size-4.5" />
            </span>
            <span className="tracking-wider hidden sm:inline-block bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">教学竞赛</span>
          </NavLink>

          <nav className="flex flex-1 items-center gap-1.5 text-sm font-medium" aria-label="主导航">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3.5 py-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-transparent',
                    isActive
                      ? 'bg-primary !text-primary-foreground font-bold shadow-md shadow-primary/10 border-primary/20 scale-[1.02]'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]'
                  )
                }
              >
                <item.icon aria-hidden="true" className="size-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SessionActions />
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
