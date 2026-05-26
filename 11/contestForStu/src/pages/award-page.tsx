import { useEffect, useState } from 'react'
import { Medal, Trophy } from 'lucide-react'
import { awardApi, type AwardRecord } from '@/api'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { MetricStrip, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AwardPage() {
  const [awards, setAwards] = useState<AwardRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadAwards() {
      try {
        setLoading(true)
        setError('')
        const data = await awardApi.list()

        if (!ignore) {
          setAwards(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '获奖列表加载失败')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    void loadAwards()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="flex flex-col gap-5">
      <WorkspaceHeader
        badge="获奖公示"
        title="获奖名单"
        description="您可以在此查看已发布的教师获奖名单。"
      />

      <MetricStrip
        items={[
          { label: '公示记录', value: awards.length, icon: Medal, tone: 'tertiary' },
          { label: '涉及竞赛', value: new Set(awards.map((award) => award.title)).size, icon: Trophy, tone: 'primary' },
        ]}
        columns="sm:grid-cols-2"
      />

      {loading && <LoadingPanel title="正在加载获奖公示" description="同步教师姓名、竞赛名称与奖项等级。" />}

      {!loading && error && <ErrorPanel title="获奖列表加载失败" description={error} />}

      {!loading && !error && awards.length === 0 && (
        <EmptyPanel title="暂无获奖数据" description="管理员发布获奖信息后会显示在这里。" />
      )}

      {!loading && !error && awards.length > 0 && (
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
              {awards.map((award) => (
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
    </section>
  )
}
