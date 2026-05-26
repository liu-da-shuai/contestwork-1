import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ClipboardList, Search } from 'lucide-react'
import { contestApi, type Contest } from '@/api'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { MetricStrip, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export function ContestListPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const data = keyword.trim() ? await contestApi.search(keyword.trim()) : await contestApi.list()
      setContests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function loadContests() {
      try {
        setLoading(true)
        setError('')
        const data = await contestApi.list()

        if (!ignore) {
          setContests(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '竞赛列表加载失败')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadContests()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="flex flex-col gap-5">
      <WorkspaceHeader
        badge="竞赛公开信息"
        title="竞赛列表"
        description="您可以在此浏览公开竞赛项目"
      />

      <MetricStrip
        items={[
          { label: '全部竞赛', value: contests.length, icon: ClipboardList, tone: 'primary' },
          { label: '进行中', value: contests.filter((contest) => contest.status === '进行中').length, icon: CalendarDays, tone: 'secondary' },
          { label: '已结束', value: contests.filter((contest) => contest.status === '已结束').length, icon: CalendarDays, tone: 'tertiary' },
        ]}
        columns="sm:grid-cols-3"
      />

      <form onSubmit={handleSearch} className="flex gap-2 items-center w-full max-w-md bg-card p-1.5 rounded-xl border self-start shadow-sm">
        <div className="flex items-center gap-2 pl-3 flex-1">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="输入竞赛名称关键字进行检索..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm outline-none border-none placeholder:text-muted-foreground py-1 text-foreground"
          />
        </div>
        <Button type="submit" size="sm" className="rounded-lg px-4 h-9">
          搜索
        </Button>
        {keyword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={async () => {
              setKeyword('')
              try {
                setLoading(true)
                const data = await contestApi.list()
                setContests(data)
              } catch (err) {
                setError('重置失败')
              } finally {
                setLoading(false)
              }
            }}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            重置
          </Button>
        )}
      </form>

      {loading && (
        <LoadingPanel title="正在加载竞赛数据" description="同步竞赛名称、时间范围与状态。" />
      )}

      {!loading && error && (
        <ErrorPanel title="竞赛列表加载失败" description={error} />
      )}

      {!loading && !error && contests.length === 0 && (
        <EmptyPanel title="暂无竞赛数据" description="后端暂未发布竞赛项目。" />
      )}

      {!loading && !error && contests.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-surface-container-low">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>竞赛名称</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">详情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contests.map((contest) => (
                <TableRow key={contest.id}>
                  <TableCell className="font-medium">{contest.title}</TableCell>
                  <TableCell className="text-muted-foreground">{contest.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(contest.status.includes('报名') && 'bg-tertiary-container text-on-tertiary-container')}
                    >
                      {contest.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/contests/${contest.id}`}>
                        查看
                        <ArrowRight data-icon="inline-end" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  )
}
