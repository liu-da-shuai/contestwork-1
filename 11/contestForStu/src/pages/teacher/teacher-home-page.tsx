import { useEffect, useState } from 'react'
import { BookOpenCheck, UserRoundCheck } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { statisticsApi, type TeacherStatistics } from '@/api'
import { getCurrentUser } from '@/auth/session'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Card, CardContent } from '@/components/ui/card'

export function TeacherHomePage() {
  const currentUser = getCurrentUser()
  const { loadingAction, error, runQuery } = useAsyncAction()
  const [teacherStats, setTeacherStats] = useState<TeacherStatistics | null>(null)

  useEffect(() => {
    void runQuery('加载教师统计', async () => {
      if (currentUser?.name) {
        const stats = await statisticsApi.teacher(currentUser.name)
        setTeacherStats(stats)
      }
    })
  }, [currentUser?.name, runQuery])

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        badge="教师个人中心"
        title={`欢迎, ${currentUser?.name ?? '教师'}`}
        description="查看您的账号信息及参与的竞赛统计数据。"
        meta={
          <div className="rounded-2xl border bg-primary/5 px-5 py-4 text-primary backdrop-blur-sm shadow-inner">
            <p className="text-xs font-semibold tracking-wider opacity-85 uppercase">参与竞赛项目</p>
            <p className="mt-2 text-3xl font-bold">{teacherStats?.contestCount ?? '-'}</p>
          </div>
        }
      />

      {loadingAction && <LoadingPanel title={loadingAction} description="正在获取最新数据，请稍候。" />}
      {error && <ErrorPanel title="数据获取失败" description={error} />}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">报名次数</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{teacherStats?.contestCount ?? 0}</p>
              <p className="text-[10px] text-muted-foreground">您已提交报名的项目总数</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
              <BookOpenCheck className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">获奖次数</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{teacherStats?.awardCount ?? 0}</p>
              <p className="text-[10px] text-muted-foreground">通过审核并公示的获奖记录</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <UserRoundCheck className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">平均得分</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{teacherStats?.averageScore ?? '暂无'}</p>
              <p className="text-[10px] text-muted-foreground">评委给出的盲审成绩均分</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <BookOpenCheck className="size-6" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border border-border/50 shadow-sm overflow-hidden bg-card transition-all duration-300">
        <CardContent className="p-6">
          <SectionHeading title="账号基本信息" description="当前登录教师账号的底层系统字段。" />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-surface-container-low/50 p-4 transition-colors hover:bg-surface-container-low">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">教师姓名</p>
              <p className="mt-1.5 text-base font-bold text-foreground">{currentUser?.name}</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-surface-container-low/50 p-4 transition-colors hover:bg-surface-container-low">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">系统用户名</p>
              <p className="mt-1.5 text-base font-bold text-foreground">{currentUser?.username}</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-surface-container-low/50 p-4 transition-colors hover:bg-surface-container-low">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">账号角色权限</p>
              <p className="mt-1.5 text-base font-bold text-primary font-mono capitalize">{currentUser?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
