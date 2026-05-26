import { type FormEvent, useEffect, useState } from 'react'
import { Vote, ShieldCheck, EyeOff, CheckCircle2, ChevronRight, BookOpen, Paperclip, Download, Trash2 } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { contestApi, reviewApi, signupApi, blindReviewApi, attachmentApi, type Contest, type ReviewPayload, type SignupRecord, type BlindReviewRecord, type AttachmentRecord } from '@/api'
import { getCurrentUser } from '@/auth/session'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const initialReview: ReviewPayload = {
  contestTitle: '',
  teacherName: '',
  courseName: '',
  score: 90,
  comment: '',
}

export function ReviewerQueuePage() {
  const user = getCurrentUser()
  const reviewerId = user?.id || 7

  const [activeQueue, setActiveQueue] = useState<'regular' | 'blind'>('regular')
  const [contests, setContests] = useState<Contest[]>([])
  const [signups, setSignups] = useState<SignupRecord[]>([])

  const [blindTasks, setBlindTasks] = useState<BlindReviewRecord[]>([])
  const [selectedBlindContest, setSelectedBlindContest] = useState('')

  const [form, setForm] = useState<ReviewPayload>(initialReview)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [selectedRegularSignupId, setSelectedRegularSignupId] = useState<number | null>(null)
  const [attachments, setAttachments] = useState<AttachmentRecord[]>([])
  
  const { loadingAction, error, message, submitting, runQuery, runSubmit, setMessage, setError } = useAsyncAction()

  useEffect(() => {
    void loadInitialData()
  }, [])

  async function loadInitialData() {
    return runQuery('获取基本列表', async () => {
      const [contestList, signupList] = await Promise.all([
        contestApi.list(),
        signupApi.list(),
      ])
      setContests(contestList)
      setSignups(signupList)
      
      if (contestList.length > 0) {
        setSelectedBlindContest(contestList[0].title)
      }
      
      const firstSignup = signupList[0]
      setForm((value) => ({
        ...value,
        contestTitle: firstSignup?.contestTitle || contestList[0]?.title || '',
        teacherName: firstSignup?.teacherName || '',
        courseName: firstSignup?.courseName || '',
      }))
    })
  }

  useEffect(() => {
    if (activeQueue === 'blind' && selectedBlindContest) {
      void fetchBlindQueue()
    }
  }, [selectedBlindContest, activeQueue])

  async function fetchBlindQueue() {
    setError('')
    await runQuery('获取盲审任务', async () => {
      const list = await blindReviewApi.list(reviewerId, selectedBlindContest)
      setBlindTasks(list)
    })
  }

  async function handleDeleteBlindTask(taskId: number) {
    if (!confirm('确定要删除该盲审任务吗？')) return
    await runSubmit(
      () => blindReviewApi.remove(taskId),
      async () => {
        setMessage('删除成功')
        if (selectedTaskId === taskId) {
          setSelectedTaskId(null)
          setAttachments([])
          setForm(initialReview)
        }
        await fetchBlindQueue()
      }
    )
  }

  async function selectRegularTask(record: SignupRecord) {
    setSelectedTaskId(null)
    setSelectedRegularSignupId(record.id)
    setForm({
      contestTitle: record.contestTitle,
      teacherName: record.teacherName,
      courseName: record.courseName,
      score: 90,
      comment: '',
    })

    try {
      const attachmentList = await attachmentApi.list(record.id)
      setAttachments(attachmentList)
    } catch {
      setAttachments([])
    }
  }

  async function selectBlindTask(task: BlindReviewRecord) {
    setSelectedTaskId(task.id)
    setSelectedRegularSignupId(null)
    
    const signup = signups.find(s => s.id === task.signupId)
    setForm({
      contestTitle: task.contestTitle,
      teacherName: '* 匿名参赛选手(双盲加密) *',
      courseName: signup?.courseName || '脱敏加密参赛课程',
      score: task.score || 90,
      comment: task.comment || '',
    })

    try {
      const attachmentList = await attachmentApi.list(task.signupId)
      setAttachments(attachmentList)
    } catch {
      setAttachments([])
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')

    if (activeQueue === 'blind') {
      if (!selectedTaskId) {
        setError('请在右侧选择一个双盲盲审任务')
        return
      }
      await runSubmit(
        () => blindReviewApi.submit(selectedTaskId, form.score, form.comment),
        async () => {
          setMessage('已成功提交双盲评审评分')
          setSelectedTaskId(null)
          setForm(initialReview)
          await fetchBlindQueue()
        }
      )
    } else {
      await runSubmit(
        () => reviewApi.create(form),
        () => {
          setMessage('常规评审评分录入成功')
          setForm(initialReview)
          void loadInitialData()
        }
      )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        title="专家评审综合工作台"
        description="支持多维度评审的在线打分工作区，包含常规评审与双盲脱敏盲审。"
      />

      <div className="flex flex-wrap gap-2 p-1 border rounded-2xl bg-surface/50 max-w-2xl self-start no-print">
        <button
          onClick={() => {
            setActiveQueue('regular')
            setMessage('')
            setError('')
            setForm(initialReview)
            setAttachments([])
            setSelectedTaskId(null)
            setSelectedRegularSignupId(null)
          }}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
            activeQueue === 'regular'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'hover:bg-primary/5 text-muted-foreground'
          }`}
        >
          <BookOpen className="size-4" />
          常规评审通道
        </button>
        <button
          onClick={() => {
            setActiveQueue('blind')
            setMessage('')
            setError('')
            setForm(initialReview)
            setAttachments([])
            setSelectedTaskId(null)
            setSelectedRegularSignupId(null)
          }}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
            activeQueue === 'blind'
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'hover:bg-primary/5 text-muted-foreground'
          }`}
        >
          <EyeOff className="size-4" />
          双盲盲审任务
        </button>
      </div>

      {loadingAction === '获取基本列表' && <LoadingPanel title="同步评审数据库..." description="请稍候" />}

      <div className="grid items-start gap-6 lg:grid-cols-2 animate-in fade-in duration-300">
        
        <section className="flex flex-col gap-3">
          <SectionHeading
            title={
              activeQueue === 'blind' ? '双盲脱敏评分录入' : '常规评审评分录入'
            }
            description="填入各项指标得分与核心评语后同步至云端。"
          />
          <Card className="border shadow-sm bg-card relative overflow-hidden">
            {activeQueue === 'blind' && (
              <div className="bg-indigo-500/10 text-indigo-500 p-3 text-xs font-semibold flex items-center gap-2 border-b border-indigo-500/15">
                <ShieldCheck className="size-4 shrink-0" />
                <span>双盲安全通道：当前评分对象已被脱敏，姓名与单位已做不可逆的物理遮盖</span>
              </div>
            )}

            <CardContent className="p-6 md:p-8">
              {message && (
                <Alert className="mb-5 rounded-xl border-none bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                  <AlertTitle>打分已备案</AlertTitle>
                  <AlertDescription className="text-emerald-500/80">{message}</AlertDescription>
                </Alert>
              )}
              {error && <ErrorPanel className="mb-5" title="操作失败" description={error} />}

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label>竞赛项目名称</Label>
                  <Input
                    value={form.contestTitle}
                    disabled
                    className="bg-muted text-muted-foreground rounded-xl"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reviewer-teacher">
                      {activeQueue === 'blind' ? '选手标识 (已盲审脱敏)' : '参赛教师姓名'}
                    </Label>
                    <Input
                      id="reviewer-teacher"
                      value={form.teacherName}
                      disabled={activeQueue === 'blind'}
                      onChange={(event) => setForm((value) => ({ ...value, teacherName: event.target.value }))}
                      required
                      className={`${activeQueue === 'blind' ? 'bg-indigo-500/5 text-indigo-500 border-indigo-500/20 font-bold' : 'bg-surface/50'} h-12 rounded-xl`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="reviewer-course">参赛课程名称</Label>
                    <Input
                      id="reviewer-course"
                      value={form.courseName}
                      disabled={activeQueue === 'blind'}
                      onChange={(event) => setForm((value) => ({ ...value, courseName: event.target.value }))}
                      required
                      className={`${activeQueue === 'blind' ? 'bg-muted text-muted-foreground' : 'bg-surface/50'} h-12 rounded-xl`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reviewer-score">专家量化评分 (0-100)</Label>
                  <Input
                    id="reviewer-score"
                    type="number"
                    min={0}
                    max={100}
                    value={form.score}
                    onChange={(event) => {
                      const score = Number(event.target.value)
                      setForm((value) => ({ ...value, score: Number.isFinite(score) ? score : 0 }))
                    }}
                    required
                    className="bg-surface/50 h-12 rounded-xl text-lg font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reviewer-comment">核心专家评审评语</Label>
                  <Textarea
                    id="reviewer-comment"
                    value={form.comment}
                    onChange={(event) => setForm((value) => ({ ...value, comment: event.target.value }))}
                    required
                    placeholder="请输入对该教学大纲、板书设计、课件互动及授课效果的评审评语..."
                    className="bg-surface/50 min-h-[140px] rounded-xl resize-y leading-relaxed text-sm"
                  />
                </div>

                {(selectedRegularSignupId || selectedTaskId) && (
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-2">
                      <Paperclip className="size-4" />
                      参赛作品附件
                    </Label>
                    {attachments.length === 0 ? (
                      <div className="text-sm text-muted-foreground p-4 border rounded-xl bg-muted/30">
                        该报名暂无附件
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-3 border rounded-xl bg-surface/50 hover:bg-surface/80 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Paperclip className="size-4 text-indigo-500 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-sm font-medium truncate block">{att.originalName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {(att.fileSize / 1024).toFixed(1)} KB
                                </span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                try {
                                  const blob = await attachmentApi.download(att.id)
                                  const url = URL.createObjectURL(blob)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = att.originalName
                                  a.click()
                                  URL.revokeObjectURL(url)
                                } catch {
                                  setError('下载附件失败')
                                }
                              }}
                              className="shrink-0"
                            >
                              <Download className="size-4 mr-1" />
                              下载
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 border-t pt-6">
                  <Button
                    type="submit"
                    disabled={submitting || (activeQueue === 'blind' && !selectedTaskId)}
                    className="h-12 w-full px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 font-semibold"
                  >
                    <Vote className="size-4 mr-2" />
                    {submitting ? '数据打包上传中...' : 
                     (activeQueue === 'blind' && !selectedTaskId) ? '请在右侧选择待盲审项目' :
                     '保存并发布评分'
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          
          {activeQueue === 'regular' && (
            <>
              <SectionHeading title="常规待评审清单" description="包含完整实名申报信息的待评分教学竞赛项目。" />
              <Card className="border shadow-sm overflow-hidden bg-card">
                <CardContent className="p-0">
                  {signups.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground text-sm">暂无报名记录</div>
                  ) : (
                    <div className="divide-y">
                      {signups.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => selectRegularTask(item)}
                          className="p-4 flex items-center justify-between hover:bg-surface/30 cursor-pointer transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="font-semibold text-foreground block text-sm">{item.courseName}</span>
                            <span className="text-xs text-muted-foreground block">
                              选手: {item.teacherName} | 部门: {item.unit}
                            </span>
                          </div>
                          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeQueue === 'blind' && (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <SectionHeading title="双盲盲审任务池" description="完全隐去选手背景的特审池。" />
                  
                  <select
                    value={selectedBlindContest}
                    onChange={(e) => setSelectedBlindContest(e.target.value)}
                    className="h-9 px-2.5 border rounded-lg bg-surface text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    {contests.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingAction === '获取盲审任务' && <LoadingPanel title="同步盲审池中..." description="请稍候" />}

                <Card className="border shadow-sm overflow-hidden bg-card">
                  <CardContent className="p-0">
                    {blindTasks.length === 0 && !loadingAction ? (
                      <div className="text-center py-16 text-muted-foreground text-sm flex flex-col items-center justify-center p-6 gap-2">
                        <ShieldCheck className="size-10 text-muted-foreground/35" />
                        <span>本赛道目前无分配给您的双盲盲审任务</span>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {blindTasks.map((task) => {
                          const signup = signups.find(s => s.id === task.signupId)
                          const isSelected = selectedTaskId === task.id
                          return (
                            <div
                              key={task.id}
                              className={`p-4 flex items-center justify-between transition-colors ${
                                isSelected ? 'bg-indigo-500/5 border-l-2 border-indigo-500' : 'hover:bg-surface/30'
                              }`}
                            >
                              <div 
                                className="flex-1 cursor-pointer min-w-0"
                                onClick={() => selectBlindTask(task)}
                              >
                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-foreground block text-sm truncate">
                                      {signup?.courseName || '双盲脱敏参赛项目'}
                                    </span>
                                    {task.reviewed ? (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold shrink-0">
                                        已评分: {task.score}
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-500 font-bold shrink-0">
                                        待盲审
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <EyeOff className="size-3 text-indigo-400" />
                                    <span>选手: <span className="font-mono text-indigo-500 font-semibold">* 匿名选手 *</span></span>
                                    <span className="text-gray-300">|</span>
                                    <span>部门: <span className="font-mono text-indigo-500 font-semibold">* 匿名单位 *</span></span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteBlindTask(task.id)
                                  }}
                                  className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                                <ChevronRight className={`size-4 transition-transform ${isSelected ? 'translate-x-1 text-indigo-500' : 'text-muted-foreground'}`} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

        </section>
      </div>
    </div>
  )
}
