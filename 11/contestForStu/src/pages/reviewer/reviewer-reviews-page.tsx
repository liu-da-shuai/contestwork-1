import { useEffect, useState } from 'react'
import { Vote } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { reviewApi, type ReviewRecord } from '@/api'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewTable } from '@/components/app/tables/review-table'

export function ReviewerReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const { loadingAction, error, runQuery } = useAsyncAction()

  useEffect(() => {
    void runQuery('加载评审记录', async () => {
      setReviews(await reviewApi.list())
    })
  }, [runQuery])

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        title="我的评审记录"
        description="查看您已提交的所有打分与评语。"
      />

      {loadingAction && <LoadingPanel title={loadingAction} description="正在获取最新数据，请稍候。" />}
      {error && <ErrorPanel title="数据获取失败" description={error} />}

      <Card className="border shadow-sm overflow-hidden bg-card">
        <CardContent className="p-0">
          <div className="p-5 border-b border-border/50 bg-surface-container-low/50">
            <SectionHeading title="已评项目" description="这里展示了您名下所有的评审记录。" />
          </div>
          
          <ReviewTable data={reviews} />
          
          {reviews.length === 0 && !loadingAction && !error && (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Vote size={48} className="opacity-20 mb-4" />
              <p>暂无评审记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
