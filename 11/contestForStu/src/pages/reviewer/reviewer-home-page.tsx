import { useEffect, useState } from 'react'
import { ClipboardCheck, Star, Vote } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { reviewApi, type ReviewRecord } from '@/api'
import { getCurrentUser } from '@/auth/session'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Card, CardContent } from '@/components/ui/card'

export function ReviewerHomePage() {
  const currentUser = getCurrentUser()
  const { loadingAction, error, runQuery } = useAsyncAction()
  const [reviews, setReviews] = useState<ReviewRecord[]>([])

  useEffect(() => {
    void runQuery('加载评审记录', async () => {
      setReviews(await reviewApi.list())
    })
  }, [runQuery])

  const averageScore = reviews.length > 0 
    ? Math.round(reviews.reduce((sum, item) => sum + item.score, 0) / reviews.length) 
    : '暂无'

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        badge="评委个人中心"
        title={`欢迎, ${currentUser?.name ?? '评委'}`}
        description="查看您的账号信息及评审统计数据。"
        meta={
          <div className="rounded-2xl border bg-primary/5 px-5 py-4 text-primary backdrop-blur-sm shadow-inner">
            <p className="text-xs font-semibold tracking-wider opacity-85 uppercase">已评竞赛项目</p>
            <p className="mt-2 text-3xl font-bold">{reviews.length}</p>
          </div>
        }
      />

      {loadingAction && <LoadingPanel title={loadingAction} description="正在获取最新数据，请稍候。" />}
      {error && <ErrorPanel title="数据获取失败" description={error} />}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">待评数量</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">--</p>
              <p className="text-[10px] text-muted-foreground">系统随机分派的未结打分任务</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
              <ClipboardCheck className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">已评审记录</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{reviews.length}</p>
              <p className="text-[10px] text-muted-foreground">您已完成打分并封存的申报表</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Vote className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">平均打分</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{averageScore}</p>
              <p className="text-[10px] text-muted-foreground">您给出的历史所有盲审评分均值</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Star className="size-6" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border border-border/50 shadow-sm overflow-hidden bg-card transition-all duration-300">
        <CardContent className="p-6">
          <SectionHeading title="账号基本信息" description="当前登录评委账号的底层系统字段。" />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-surface-container-low/50 p-4 transition-colors hover:bg-surface-container-low">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">评委姓名</p>
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
