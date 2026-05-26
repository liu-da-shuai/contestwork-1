import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Star, UsersRound } from 'lucide-react'
import {
  contestApi,
  reviewApi,
  signupApi,
  statisticsApi,
  type Contest,
  type ContestStatistics,
  type ReviewRecord,
  type SignupRecord,
} from '@/api'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function ContestDetailPage() {
  const { id } = useParams()
  const [contest, setContest] = useState<Contest | null>(null)
  const [signups, setSignups] = useState<SignupRecord[]>([])
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [statistics, setStatistics] = useState<ContestStatistics | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')
  const missingId = !id

  useEffect(() => {
    const contestId = id ?? ''

    if (!contestId) {
      return
    }

    let ignore = false

    async function loadDetail() {
      try {
        setLoading(true)
        setError('')
        const contestDetail = await contestApi.detail(contestId)
        const [signupList, reviewList, contestStats] = await Promise.all([
          signupApi.byContest(contestDetail.title),
          reviewApi.byContest(contestDetail.title),
          statisticsApi.contest(contestDetail.title),
        ])

        if (!ignore) {
          setContest(contestDetail)
          setSignups(signupList)
          setReviews(reviewList)
          setStatistics(contestStats)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '竞赛详情加载失败')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadDetail()

    return () => {
      ignore = true
    }
  }, [id])

  const averageScore = useMemo(() => {
    if (reviews.length === 0) {
      return '暂无'
    }

    const total = reviews.reduce((sum, review) => sum + review.score, 0)
    return Math.round(total / reviews.length)
  }, [reviews])

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Button asChild variant="ghost" className="mb-4 rounded-md px-0">
          <Link to="/contests">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            返回竞赛列表
          </Link>
        </Button>

        {contest ? (
          <div className="border-b pb-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-3">{contest.status}</Badge>
                <h1 className="text-3xl font-semibold text-foreground">{contest.title}</h1>
                <p className="mt-2 text-sm text-muted-foreground">{contest.time}</p>
              </div>
              <div className="grid min-w-64 grid-cols-3 gap-3 rounded-lg border bg-surface-container px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">报名人数</p>
                  <p className="mt-1 text-xl font-semibold">{statistics?.signupCount ?? signups.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">评分记录</p>
                  <p className="mt-1 text-xl font-semibold">{statistics?.reviewCount ?? reviews.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">平均分</p>
                  <p className="mt-1 text-xl font-semibold">{statistics?.averageScore || averageScore}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {missingId && <ErrorPanel title="缺少竞赛 ID" description="请从竞赛列表进入详情页。" />}
      {!missingId && loading && <LoadingPanel title="正在加载竞赛详情" description="正在整理竞赛、报名与评分记录。" />}
      {!missingId && !loading && error && <ErrorPanel title="竞赛详情加载失败" description={error} />}
      {!missingId && !loading && !error && !contest && (
        <EmptyPanel title="未找到竞赛" description="后端没有返回对应竞赛详情。" />
      )}

      {!missingId && contest && !loading && !error && (
        <div className="grid items-start gap-5 xl:grid-cols-[1fr_1fr]">
          <section className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <UsersRound aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">报名名单</h2>
            </div>
            <div className="rounded-lg border bg-surface-container-low p-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>教师</TableHead>
                    <TableHead>单位</TableHead>
                    <TableHead>课程</TableHead>
                    <TableHead>报名日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((signup) => (
                    <TableRow key={signup.id}>
                      <TableCell className="font-medium">{signup.teacherName}</TableCell>
                      <TableCell>{signup.unit}</TableCell>
                      <TableCell>{signup.courseName}</TableCell>
                      <TableCell>{signup.time || '未填写'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {signups.length === 0 ? (
                <p className="px-2 py-6 text-sm text-muted-foreground">暂无报名记录。</p>
              ) : null}
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <Star aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">评分记录</h2>
            </div>
            <div className="rounded-lg border bg-surface-container-low p-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>教师</TableHead>
                    <TableHead>课程</TableHead>
                    <TableHead>分数</TableHead>
                    <TableHead>评语</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.teacherName}</TableCell>
                      <TableCell>{review.courseName}</TableCell>
                      <TableCell>{review.score}</TableCell>
                      <TableCell className="max-w-56 whitespace-normal">{review.comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {reviews.length === 0 ? (
                <p className="px-2 py-6 text-sm text-muted-foreground">暂无评分记录。</p>
              ) : null}
            </div>
          </section>

          <section className="xl:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">竞赛信息</h2>
            </div>
            <dl className="grid gap-0 overflow-hidden rounded-lg border bg-surface-container-low sm:grid-cols-3">
              <div className="border-b p-4 sm:border-b-0 sm:border-r">
                <dt className="text-sm text-muted-foreground">竞赛名称</dt>
                <dd className="mt-2 font-medium text-foreground">{contest.title}</dd>
              </div>
              <div className="border-b p-4 sm:border-b-0 sm:border-r">
                <dt className="text-sm text-muted-foreground">时间范围</dt>
                <dd className="mt-2 font-medium text-foreground">{contest.time}</dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-muted-foreground">当前状态</dt>
                <dd className="mt-2 font-medium text-foreground">{contest.status}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </section>
  )
}
