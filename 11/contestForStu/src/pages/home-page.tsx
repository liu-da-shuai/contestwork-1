import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Medal } from 'lucide-react'
import { awardApi, contestApi, type AwardRecord, type Contest } from '@/api'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { MetricStrip, SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function HomePage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [awards, setAwards] = useState<AwardRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadPublicData() {
      try {
        setLoading(true)
        setError('')
        const [contestList, awardList] = await Promise.all([contestApi.list(), awardApi.list()])

        if (!ignore) {
          setContests(contestList)
          setAwards(awardList)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '公开数据加载失败')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadPublicData()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceHeader
        badge="浏览"
        title="总体概览"
        description="您可以选择感兴趣的栏目进行查看"
        meta={
          <div className="rounded-lg border bg-surface-container px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">公开入口</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/contests">
                  浏览竞赛
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/awards">查看公示</Link>
              </Button>
            </div>
          </div>
        }
      />

      <MetricStrip
        items={[
          { label: '竞赛项目', value: contests.length, icon: CalendarDays, tone: 'primary', hint: '公开竞赛安排与状态' },
          { label: '获奖公示', value: awards.length, icon: Medal, tone: 'tertiary', hint: '已发布的教师获奖记录' },
        ]}
        columns="sm:grid-cols-2"
      />

      {loading && <LoadingPanel title="正在加载公开信息" description="同步竞赛和获奖公示。" />}
      {!loading && error && <ErrorPanel title="公开信息加载失败" description={error} />}

      {!loading && !error && (
        <section className="grid gap-8 xl:grid-cols-2">
          <div className="flex flex-col gap-3">
            <SectionHeading
              title="最新竞赛"
              description="公开查看竞赛详情、报名名单与评分记录。"
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/contests">
                    更多
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />

            {contests.length === 0 ? (
              <EmptyPanel title="暂无竞赛数据" description="后端暂未发布竞赛项目。" />
            ) : (
              <div className="overflow-hidden rounded-lg border bg-surface-container-low">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>竞赛名称</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contests.slice(0, 4).map((contest) => (
                      <TableRow key={contest.id}>
                        <TableCell>
                          <div className="font-medium">{contest.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{contest.time}</div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{contest.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/contests/${contest.id}`}>查看</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <SectionHeading
              title="获奖公示"
              description="查看已发布的教师获奖信息。"
              action={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/awards">
                    更多
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />

            {awards.length === 0 ? (
              <EmptyPanel title="暂无获奖数据" description="管理员发布获奖信息后会显示在这里。" />
            ) : (
              <div className="overflow-hidden rounded-lg border bg-surface-container-low">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>教师</TableHead>
                      <TableHead>竞赛</TableHead>
                      <TableHead>奖项</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awards.slice(0, 4).map((award) => (
                      <TableRow key={award.id}>
                        <TableCell className="font-medium">{award.teacher}</TableCell>
                        <TableCell>{award.title}</TableCell>
                        <TableCell><Badge>{award.award}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
