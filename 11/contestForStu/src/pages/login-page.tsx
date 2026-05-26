import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck, UserPlus, UserRoundCheck, type LucideIcon } from 'lucide-react'
import { authApi, type RegisterPayload, type UserRole } from '@/api'
import { getDashboardPath, saveCurrentUser } from '@/auth/session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type AuthAction = 'login' | 'register'
type LoginMode = 'admin' | 'staff'

interface LoginModeConfig {
  mode: LoginMode
  title: string
  desc: string
  role: UserRole
  username: string
  icon: LucideIcon
  button: string
}

const modes: LoginModeConfig[] = [
  {
    mode: 'admin',
    title: '管理员登录',
    desc: '管理竞赛、用户、报名、评审和获奖公示。',
    role: 'admin',
    username: 'admin',
    icon: ShieldCheck,
    button: '进入管理仪表盘',
  },
  {
    mode: 'staff',
    title: '教师 / 评委登录',
    desc: '教师提交报名，评委查看评审相关工作。',
    role: 'teacher',
    username: 'teacher',
    icon: UserRoundCheck,
    button: '进入个人仪表盘',
  },
]

const roleOptions: { label: string; value: UserRole; username: string }[] = [
  { label: '管理员', value: 'admin', username: 'admin' },
  { label: '教师', value: 'teacher', username: 'teacher' },
  { label: '评委', value: 'reviewer', username: 'reviewer' },
]

const staffRoles = roleOptions.filter((option) => option.value !== 'admin')

const initialRegisterForm: RegisterPayload = {
  username: '',
  password: '123456',
  role: 'teacher',
}

export function LoginPage() {
  const navigate = useNavigate()
  const [action, setAction] = useState<AuthAction>('login')
  const [mode, setMode] = useState<LoginMode>('admin')
  const activeMode = useMemo(() => modes.find((item) => item.mode === mode) ?? modes[0], [mode])
  const Icon = action === 'register' ? UserPlus : activeMode.icon
  const [role, setRole] = useState<UserRole>(activeMode.role)
  const [username, setUsername] = useState(activeMode.username)
  const [password, setPassword] = useState('123456')
  const [registerForm, setRegisterForm] = useState<RegisterPayload>(initialRegisterForm)
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  function selectAction(nextAction: AuthAction) {
    setAction(nextAction)
    setMessage('')
  }

  function selectMode(nextMode: LoginMode) {
    const next = modes.find((item) => item.mode === nextMode) ?? modes[0]
    setMode(next.mode)
    setRole(next.role)
    setUsername(next.username)
    setMessage('')
  }

  function selectLoginRole(nextRole: UserRole, nextUsername: string) {
    setRole(nextRole)
    setUsername(nextUsername)
    setMessage('')
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setPending(true)
      setMessage('')
      const user = await authApi.login({ username, password, role })
      saveCurrentUser(user)
      navigate(getDashboardPath(user))
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '登录失败')
    } finally {
      setPending(false)
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setPending(true)
      setMessage('')
      const result = await authApi.register(registerForm)
      setMessage(`${result}，可继续登录。`)
      setAction('login')
      setMode(registerForm.role === 'admin' ? 'admin' : 'staff')
      setRole(registerForm.role)
      setUsername(registerForm.username)
      setPassword(registerForm.password)
      setRegisterForm(initialRegisterForm)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '注册失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      {/* 炫彩渐变背景光斑 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 mix-blend-multiply blur-3xl filter dark:mix-blend-screen" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-tertiary/20 mix-blend-multiply blur-3xl filter dark:mix-blend-screen" />
      </div>

      <section className="bg-card relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl lg:grid-cols-[0.9fr_1.1fr] border border-border">
        <aside className="bg-surface/40 p-6 md:p-8 backdrop-blur-sm border-r border-border/40">
          <p className="text-sm font-semibold tracking-wider text-primary">ACCOUNT PORTAL</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">登录与注册</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            支持管理员、教师和评委账号，覆盖当前项目涉及身份。
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button type="button" variant={action === 'login' ? 'default' : 'secondary'} className={cn("transition-all duration-300", action === 'login' && "shadow-lg shadow-primary/30")} onClick={() => selectAction('login')}>
              <LogIn data-icon="inline-start" aria-hidden="true" />
              登录
            </Button>
            <Button type="button" variant={action === 'register' ? 'default' : 'secondary'} className={cn("transition-all duration-300", action === 'register' && "shadow-lg shadow-primary/30")} onClick={() => selectAction('register')}>
              <UserPlus data-icon="inline-start" aria-hidden="true" />
              注册
            </Button>
          </div>

          <div className="mt-10 grid gap-4">
            {action === 'login' ? (
              modes.map((item) => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => selectMode(item.mode)}
                  className={cn(
                    'group relative flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-300',
                    mode === item.mode
                      ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                      : 'border-transparent bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground',
                  )}
                >
                  <span className={cn(
                    "inline-flex size-12 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
                    mode === item.mode ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-surface-container-high"
                  )}>
                    <item.icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-semibold">{item.title}</span>
                    <span className="mt-1 text-xs leading-relaxed opacity-80">{item.desc}</span>
                  </span>
                </button>
              ))
            ) : (
              roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRegisterForm((value) => ({ ...value, role: option.value }))}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-300',
                    registerForm.role === option.value
                      ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                      : 'border-transparent bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground',
                  )}
                >
                  <span className={cn(
                    "inline-flex size-4 rounded-full border-2 transition-colors",
                    registerForm.role === option.value ? "border-primary bg-primary" : "border-muted-foreground"
                  )} />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="p-6 md:p-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-5">
            <span className="inline-flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-tertiary text-primary-foreground shadow-lg shadow-primary/30">
              <Icon aria-hidden="true" className="size-8" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {action === 'login' ? activeMode.title : '注册账号'}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {action === 'login' ? activeMode.desc : '创建管理员、教师或评委账号后，可在本页登录。'}
              </p>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {action === 'login' ? (
            <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit}>
              {mode === 'staff' && (
                <div className="flex flex-col gap-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">非管理员身份选择</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {staffRoles.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={role === option.value ? 'default' : 'outline'}
                        className={cn("h-12 rounded-xl transition-all", role === option.value && "shadow-md shadow-primary/20")}
                        onClick={() => selectLoginRole(option.value, option.username)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  className="h-12 bg-surface/50 rounded-xl"
                  required
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="h-12 bg-surface/50 rounded-xl"
                  required
                />
              </div>

              <Button type="submit" disabled={pending} className="mt-4 h-12 rounded-xl text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95">
                <Icon data-icon="inline-start" aria-hidden="true" />
                {pending ? '正在验证...' : activeMode.button}
              </Button>
            </form>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleRegisterSubmit}>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="register-username">用户名</Label>
                <Input
                  id="register-username"
                  value={registerForm.username}
                  onChange={(event) => setRegisterForm((value) => ({ ...value, username: event.target.value }))}
                  autoComplete="username"
                  className="h-12 bg-surface/50 rounded-xl"
                  required
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <Label htmlFor="register-password">密码</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((value) => ({ ...value, password: event.target.value }))}
                  autoComplete="new-password"
                  className="h-12 bg-surface/50 rounded-xl"
                  required
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">账号角色分配</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roleOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={registerForm.role === option.value ? 'default' : 'outline'}
                      className={cn("h-11 rounded-xl transition-all", registerForm.role === option.value && "shadow-md shadow-primary/20")}
                      onClick={() => setRegisterForm((value) => ({ ...value, role: option.value }))}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={pending} className="mt-4 h-12 rounded-xl text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95">
                <UserPlus data-icon="inline-start" aria-hidden="true" />
                {pending ? '正在创建...' : '创建新账号'}
              </Button>
            </form>
          )}
          </div>

          {message && (
            <div className="mt-6 animate-in slide-in-from-bottom-2 fade-in rounded-xl bg-primary/10 border border-primary/20 p-4 text-primary">
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
