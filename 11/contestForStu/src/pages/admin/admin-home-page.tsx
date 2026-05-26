import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, ShieldCheck, Database, ArrowRight, Users, Award, BookOpenCheck } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { statisticsApi, type OverallStatistics } from '@/api'
import { getCurrentUser } from '@/auth/session'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AdminHomePage() {
  const currentUser = getCurrentUser()
  const { loadingAction, error, runQuery } = useAsyncAction()
  const [overallStats, setOverallStats] = useState<OverallStatistics | null>(null)

  useEffect(() => {
    void runQuery('加载首页数据', async () => {
      const stats = await statisticsApi.overall()
      setOverallStats(stats)
    })
  }, [runQuery])

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeader
        badge="管理员运行概览"
        title={`欢迎, ${currentUser?.name ?? '系统管理员'}`}
        description="查看系统整体运行指标并快速执行控制台核心操作。"
        meta={
          <div className="rounded-2xl border bg-primary/5 px-5 py-4 text-primary backdrop-blur-sm shadow-inner">
            <p className="text-xs font-semibold tracking-wider opacity-85 uppercase">活跃竞赛项目</p>
            <p className="mt-2 text-3xl font-bold">{overallStats?.ongoingContests ?? '-'}</p>
          </div>
        }
      />

      {loadingAction && <LoadingPanel title={loadingAction} description="正在获取最新数据，请稍候。" />}
      {error && <ErrorPanel title="数据获取失败" description={error} />}

      {!loadingAction && !error && overallStats && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">总用户量</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{overallStats.totalUsers}</p>
                <p className="text-[10px] text-muted-foreground">授权登录的师生与专家数</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                <Users className="size-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">活跃竞赛数</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{overallStats.ongoingContests}</p>
                <p className="text-[10px] text-muted-foreground">正处于报名与评审的项目</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500 shrink-0">
                <ClipboardList className="size-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">学术成果申报</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{overallStats.totalSignups}</p>
                <p className="text-[10px] text-muted-foreground">收集的教案设计方案材料</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <BookOpenCheck className="size-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm relative overflow-hidden bg-card transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">评审打分条目</p>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{overallStats.totalReviews}</p>
                <p className="text-[10px] text-muted-foreground">评委已给出成绩的申报方案</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Award className="size-6" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {!loadingAction && !error && (
        <section className="flex flex-col gap-4">
          <SectionHeading title="管理功能快捷入口" description="一键直达核心业务控制台，实现高保真度的数据与赛程管控。" />
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Contest Config Card */}
            <Card className="border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md flex flex-col justify-between group">
              <div className="p-6 space-y-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ClipboardList className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">竞赛与赛段配置</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    管理各学科竞赛状态，指派随机专家进行匿名双盲盲审打分，或定义细致的多轮次赛段起止时间与进程封存。
                  </p>
                </div>
              </div>
              <div className="p-4 bg-muted/20 border-t flex justify-end">
                <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary hover:text-primary/80 group">
                  <Link to="/admin/contests" className="flex items-center gap-1.5">
                    进入控制台
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Plagiarism Check Card */}
            <Card className="border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md flex flex-col justify-between group">
              <div className="p-6 space-y-3">
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">学术规范查重</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    智能提取并比对系统内所有教师上传的教学设计文本，自动计算最高相似度重合大纲，并输出具有极高可读性的分析报告。
                  </p>
                </div>
              </div>
              <div className="p-4 bg-muted/20 border-t flex justify-end">
                <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 hover:bg-emerald-500/5 group">
                  <Link to="/admin/data" className="flex items-center gap-1.5">
                    进入查重台
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Safety Backup Card */}
            <Card className="border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md flex flex-col justify-between group">
              <div className="p-6 space-y-3">
                <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Database className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground group-hover:text-indigo-500 transition-colors">物理灾备中心</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    支持一键创建完整的系统数据库 SQL 物理快照，并可随时针对特定历史备份执行一键覆盖式全量数据恢复与下载。
                  </p>
                </div>
              </div>
              <div className="p-4 bg-muted/20 border-t flex justify-end">
                <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:bg-indigo-500/5 group">
                  <Link to="/admin/data" className="flex items-center gap-1.5">
                    管理数据备份
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
