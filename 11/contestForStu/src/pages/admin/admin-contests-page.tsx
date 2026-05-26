import { type FormEvent, useEffect, useState } from 'react'
import { ClipboardList, Plus, Users, Calendar, Award, CheckCircle2, RefreshCw, Layers, ShieldAlert, Play, Square, Search } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { CONTEST_STATUSES, contestApi, roundApi, userApi, type Contest, type ContestPayload, type ReviewRound, type User } from '@/api'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ContestTable } from '@/components/app/tables/contest-table'

const initialContest: ContestPayload = {
  title: '',
  time: '',
  status: '进行中',
}

export function AdminContestsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'blind' | 'rounds'>('list')
  const [contests, setContests] = useState<Contest[]>([])
  const [reviewers, setReviewers] = useState<User[]>([])
  const [contestForm, setContestForm] = useState<ContestPayload>(initialContest)
  const [editingContestId, setEditingContestId] = useState<number | null>(null)
  
  // Async states
  const { loadingAction, error, runQuery, setError } = useAsyncAction()
  const [contestSubmitting, setContestSubmitting] = useState(false)
  const [contestMessage, setContestMessage] = useState('')

  // Blind review states
  const [selectedBlindContest, setSelectedBlindContest] = useState('')
  const [selectedBlindReviewers, setSelectedBlindReviewers] = useState<number[]>([])
  const [blindProgress, setBlindProgress] = useState<{ total: number; completed: number; ratio: number } | null>(null)
  const [blindMessage, setBlindMessage] = useState('')

  // Multi-round states
  const [rounds, setRounds] = useState<ReviewRound[]>([])
  const [newRoundContest, setNewRoundContest] = useState('')
  const [newRoundNumber, setNewRoundNumber] = useState(1)
  const [newRoundStart, setNewRoundStart] = useState('')
  const [newRoundEnd, setNewRoundEnd] = useState('')
  const [selectedRoundForAssign, setSelectedRoundForAssign] = useState<number | null>(null)
  const [assignRoundReviewers, setAssignRoundReviewers] = useState<number[]>([])
  const [roundProgresses, setRoundProgresses] = useState<Record<number, { total: number; completed: number; ratio: number }>>({})
  const [roundMessage, setRoundMessage] = useState('')
  const [adminSearchKeyword, setAdminSearchKeyword] = useState('')

  async function handleAdminSearch(e?: FormEvent) {
    if (e) e.preventDefault()
    await runQuery('获取竞赛列表', async () => {
      const data = adminSearchKeyword.trim() ? await contestApi.search(adminSearchKeyword.trim()) : await contestApi.list()
      setContests(data)
    })
  }

  useEffect(() => {
    void loadContests()
    void loadReviewers()
    void loadRounds()
  }, [])

  function loadContests() {
    return runQuery('获取竞赛列表', async () => {
      const data = await contestApi.list()
      setContests(data)
      if (data.length > 0) {
        setSelectedBlindContest(data[0].title)
        setNewRoundContest(data[0].title)
      }
    })
  }

  async function loadReviewers() {
    try {
      const data = await userApi.byRole('reviewer')
      setReviewers(data)
    } catch (err) {
      console.error('获取评委列表失败:', err)
    }
  }

  async function loadRounds() {
    try {
      const list = await roundApi.roundList()
      setRounds(list)
      // Load progress for ongoing/completed rounds
      for (const r of list) {
        try {
          const prog = await roundApi.roundProgress(r.id)
          setRoundProgresses(prev => ({ ...prev, [r.id]: prog }))
        } catch (e) {
          console.error(e)
        }
      }
    } catch (err) {
      console.error('获取评审轮次失败:', err)
    }
  }

  // --- Tab 1 CRUD ---
  async function handleContestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setContestMessage('')
    setError('')

    try {
      setContestSubmitting(true)
      const result = editingContestId
          ? await contestApi.update({ id: editingContestId, ...contestForm })
          : await contestApi.create(contestForm)
      setContestMessage(result)
      const nextContest = { id: editingContestId ?? Date.now(), ...contestForm }
      setContests((items) =>
          editingContestId ? items.map((item) => (item.id === editingContestId ? nextContest : item)) : [nextContest, ...items],
      )
      setEditingContestId(null)
      setContestForm(initialContest)
    } catch (err) {
      setError(err instanceof Error ? err.message : '竞赛保存失败')
    } finally {
      setContestSubmitting(false)
    }
  }

  function editContest(contest: Contest) {
    setEditingContestId(contest.id)
    setContestForm({
      title: contest.title,
      time: contest.time,
      status: contest.status,
    })
  }

  async function deleteContest(id: number) {
    await runQuery('删除竞赛', async () => {
      await contestApi.remove(id)
      setContests((items) => items.filter((item) => item.id !== id))
    })
  }

  // --- Tab 2 Blind Review Assignment & Metrics ---
  async function triggerBlindAssign() {
    if (!selectedBlindContest) {
      setError('请先选择一个竞赛')
      return
    }
    if (selectedBlindReviewers.length === 0) {
      setError('请至少选择一位盲审专家')
      return
    }
    setBlindMessage('')
    setError('')
    await runQuery('指派盲审任务', async () => {
      const msg = await roundApi.blindAssign(selectedBlindContest, selectedBlindReviewers)
      setBlindMessage(msg)
      setSelectedBlindReviewers([])
      // Reload blind progress
      await fetchBlindProgress()
    })
  }

  async function fetchBlindProgress() {
    if (!selectedBlindContest) return
    setError('')
    await runQuery('获取盲审进度', async () => {
      const prog = await roundApi.blindProgress(selectedBlindContest)
      setBlindProgress(prog)
    })
  }

  useEffect(() => {
    if (selectedBlindContest && activeTab === 'blind') {
      void fetchBlindProgress()
    }
  }, [selectedBlindContest, activeTab])

  // --- Tab 3 Multi-round Review Config ---
  async function createReviewRound(e: FormEvent) {
    e.preventDefault()
    if (!newRoundContest) {
      setError('请选择竞赛名称')
      return
    }
    if (!newRoundStart || !newRoundEnd) {
      setError('请选择起止时间')
      return
    }
    setRoundMessage('')
    setError('')
    await runQuery('创建评审轮次', async () => {
      const startFormatted = newRoundStart.replace('T', ' ') + ':00'
      const endFormatted = newRoundEnd.replace('T', ' ') + ':00'
      const msg = await roundApi.roundCreate(newRoundContest, newRoundNumber, startFormatted, endFormatted)
      setRoundMessage(msg)
      setNewRoundNumber(prev => prev + 1)
      setNewRoundStart('')
      setNewRoundEnd('')
      await loadRounds()
    })
  }

  async function handleRoundStatusChange(roundId: number, nextStatus: string) {
    setRoundMessage('')
    setError('')
    await runQuery('更新轮次状态', async () => {
      const msg = await roundApi.roundStatus(roundId, nextStatus)
      setRoundMessage(msg)
      await loadRounds()
    })
  }

  async function assignRoundTasks() {
    if (!selectedRoundForAssign) return
    if (assignRoundReviewers.length === 0) {
      setError('请选择要分配任务的专家')
      return
    }
    setRoundMessage('')
    setError('')
    await runQuery('分配轮次任务', async () => {
      const msg = await roundApi.roundAssign(selectedRoundForAssign, assignRoundReviewers)
      setRoundMessage(msg)
      setSelectedRoundForAssign(null)
      setAssignRoundReviewers([])
      await loadRounds()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        title="高级评审控制中心"
        description="配置常规竞赛、多轮评审与匿名双盲评审。"
      />

      {/* Tabs Selector */}
      <div className="flex flex-row overflow-x-auto gap-1.5 p-1 border border-border/40 rounded-2xl bg-surface/50 max-w-full self-start no-scrollbar flex-nowrap mb-2 shadow-sm">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap ${
            activeTab === 'list'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.01]'
              : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <ClipboardList className="size-4" />
          常规管理
        </button>
        <button
          onClick={() => setActiveTab('blind')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap ${
            activeTab === 'blind'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.01]'
              : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="size-4" />
          双盲评审
        </button>
        <button
          onClick={() => setActiveTab('rounds')}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap ${
            activeTab === 'rounds'
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.01]'
              : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="size-4" />
          多轮评审
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Tab 1: List & CRUD */}
        {activeTab === 'list' && (
          <div className="grid items-start gap-6 lg:grid-cols-3">
            <section className="flex flex-col gap-3 lg:col-span-1">
              <SectionHeading title="竞赛信息录入" description="填写竞赛的基础信息。" />
              <Card className="border shadow-sm bg-card">
                <CardContent className="p-5">
                  {contestMessage && (
                    <Alert className="mb-4 rounded-xl border-none bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 aria-hidden="true" className="size-4" />
                      <AlertTitle>竞赛已保存</AlertTitle>
                      <AlertDescription className="text-emerald-500/80">{contestMessage}</AlertDescription>
                    </Alert>
                  )}
                  {error && <ErrorPanel title="保存失败" description={error} className="mb-4" />}
                  
                  <form className="flex flex-col gap-5" onSubmit={handleContestSubmit}>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contest-title">竞赛名称</Label>
                      <Input
                        id="contest-title"
                        value={contestForm.title}
                        onChange={(event) => setContestForm((value) => ({ ...value, title: event.target.value }))}
                        required
                        className="bg-surface/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contest-time">时间范围</Label>
                      <Input
                        id="contest-time"
                        value={contestForm.time}
                        onChange={(event) => setContestForm((value) => ({ ...value, time: event.target.value }))}
                        placeholder="2026-05-01 ~ 2026-06-01"
                        required
                        className="bg-surface/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>竞赛状态</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {CONTEST_STATUSES.map((status) => (
                          <Button
                            key={status}
                            type="button"
                            variant={contestForm.status === status ? 'default' : 'outline'}
                            onClick={() => setContestForm((value) => ({ ...value, status }))}
                            className="rounded-xl"
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <Button type="submit" disabled={contestSubmitting} className="rounded-xl h-11 w-full transition-all duration-300">
                        <Plus className="size-4 mr-2" />
                        {contestSubmitting ? '保存中' : editingContestId ? '更新竞赛' : '创建竞赛'}
                      </Button>
                      {editingContestId ? (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setEditingContestId(null)
                            setContestForm(initialContest)
                          }}
                          className="rounded-xl h-11 w-full"
                        >
                          取消编辑
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>

            <section className="flex flex-col gap-3 lg:col-span-2">
              <SectionHeading title="现有竞赛列表" description="已录入系统项目。" />
              
              <form onSubmit={handleAdminSearch} className="flex gap-2 items-center w-full max-w-md bg-card p-1 rounded-xl border self-start shadow-sm mb-1">
                <div className="flex items-center gap-2 pl-3 flex-1">
                  <Search className="size-3.5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="检索竞赛项目名称..."
                    value={adminSearchKeyword}
                    onChange={(e) => setAdminSearchKeyword(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none border-none placeholder:text-muted-foreground py-0.5 text-foreground"
                  />
                </div>
                <Button type="submit" size="sm" className="rounded-lg px-3 h-8 text-xs">
                  检索
                </Button>
                {adminSearchKeyword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      setAdminSearchKeyword('')
                      await runQuery('获取竞赛列表', async () => {
                        const data = await contestApi.list()
                        setContests(data)
                      })
                    }}
                    className="h-8 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    重置
                  </Button>
                )}
              </form>

              {loadingAction === '获取竞赛列表' && <LoadingPanel title={loadingAction} description="正在读取竞赛数据库..." />}
              
              <Card className="border shadow-sm overflow-hidden bg-card">
                <CardContent className="p-0">
                  <ContestTable
                    data={contests}
                    action={(contest) => (
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => editContest(contest)} className="rounded-lg">编辑</Button>
                        <Button type="button" size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg" onClick={() => void deleteContest(contest.id)}>删除</Button>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* Tab 2: Double Blind Control */}
        {activeTab === 'blind' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Assignment form */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  随机双盲盲审任务指派
                </CardTitle>
                <CardDescription>
                  隐去教师姓名与单位，打乱分配给专家评审团。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {blindMessage && (
                  <Alert className="border-none bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <CheckCircle2 className="size-4" />
                    <AlertTitle>指派成功</AlertTitle>
                    <AlertDescription>{blindMessage}</AlertDescription>
                  </Alert>
                )}
                {error && <ErrorPanel title="操作失败" description={error} className="mb-2" />}

                <div className="space-y-2">
                  <Label htmlFor="blind-contest">选择目标竞赛</Label>
                  <select
                    id="blind-contest"
                    value={selectedBlindContest}
                    onChange={(e) => setSelectedBlindContest(e.target.value)}
                    className="w-full h-11 px-3 border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                  >
                    {contests.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>指定评审专家团成员</Label>
                  {reviewers.length === 0 ? (
                    <p className="text-sm text-muted-foreground bg-surface/50 p-4 rounded-xl text-center">
                      暂无专家角色账户，请先到用户管理创建角色为“评审专家”的用户。
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border bg-surface/30">
                      {reviewers.map((rev) => {
                        if (rev.id === undefined) return null
                        const revId = rev.id
                        const isChecked = selectedBlindReviewers.includes(revId)
                        return (
                          <label
                            key={revId}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-primary/5 border-primary text-primary font-medium'
                                : 'hover:bg-surface border-transparent text-muted-foreground'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedBlindReviewers(prev => prev.filter(id => id !== revId))
                                } else {
                                  setSelectedBlindReviewers(prev => [...prev, revId])
                                }
                              }}
                              className="accent-primary size-4"
                            />
                            <span>{rev.name} ({rev.username})</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>

                <Button
                  onClick={triggerBlindAssign}
                  className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 font-medium transition-all hover:-translate-y-0.5 active:translate-y-0"
                  disabled={loadingAction === '指派盲审任务'}
                >
                  {loadingAction === '指派盲审任务' ? '随机盲审计算中...' : '生成随机双盲盲审任务'}
                </Button>
              </CardContent>
            </Card>

            {/* Progress metrics */}
            <Card className="border shadow-sm flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="size-5 text-indigo-500" />
                      本赛程双盲盲审进度仪表盘
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={fetchBlindProgress}
                      className="rounded-full size-8 p-0"
                      title="刷新数据"
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    监控双盲评审整体进度与评分覆盖度。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedBlindContest ? (
                    <div className="space-y-6">
                      <div className="bg-surface/50 border rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">当前选中竞赛</span>
                          <span className="font-semibold text-primary">{selectedBlindContest}</span>
                        </div>
                        <div className="h-px bg-border" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">总分配盲审任务数</span>
                            <span className="text-2xl font-bold text-foreground">
                              {blindProgress?.total ?? 0} <span className="text-xs font-normal text-muted-foreground">项</span>
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">专家已完成评分数</span>
                            <span className="text-2xl font-bold text-emerald-500">
                              {blindProgress?.completed ?? 0} <span className="text-xs font-normal text-muted-foreground">项</span>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">盲审任务完成度</span>
                            <span className="text-primary font-bold">
                              {Math.round((blindProgress?.ratio ?? 0) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-primary to-indigo-500 h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.round((blindProgress?.ratio ?? 0) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/5 text-indigo-500 border border-indigo-500/10">
                        <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-0.5">
                          <span className="font-semibold block">完全匿名设计</span>
                          <span className="text-indigo-500/80 leading-relaxed block">
                            此通道完全屏蔽教师个人与单位信息，评委端以“匿名教师”形式进行评审。
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      请在左侧选择目标竞赛以加载进度数据
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Multi Round Management */}
        {activeTab === 'rounds' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Creator Form */}
              <Card className="border shadow-sm md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="size-5 text-primary" />
                    创建新的评审轮次
                  </CardTitle>
                  <CardDescription>
                    为指定赛程创建特定阶段的评审轮次。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createReviewRound} className="space-y-4">
                    {roundMessage && (
                      <Alert className="border-none bg-emerald-500/10 text-emerald-500 rounded-xl p-3">
                        <AlertDescription className="text-xs font-semibold">{roundMessage}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="round-contest">目标竞赛</Label>
                      <select
                        id="round-contest"
                        value={newRoundContest}
                        onChange={(e) => setNewRoundContest(e.target.value)}
                        className="w-full h-10 px-3 border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      >
                        {contests.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="round-num">轮次编号</Label>
                      <Input
                        id="round-num"
                        type="number"
                        min={1}
                        value={newRoundNumber}
                        onChange={(e) => setNewRoundNumber(Number(e.target.value))}
                        className="bg-surface/50"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="round-start">开始时间</Label>
                      <Input
                        id="round-start"
                        type="datetime-local"
                        value={newRoundStart}
                        onChange={(e) => setNewRoundStart(e.target.value)}
                        className="bg-surface/50 text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="round-end">结束时间</Label>
                      <Input
                        id="round-end"
                        type="datetime-local"
                        value={newRoundEnd}
                        onChange={(e) => setNewRoundEnd(e.target.value)}
                        className="bg-surface/50 text-xs"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-xl transition-all duration-300 font-medium">
                      创建评审轮次
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Rounds List */}
              <Card className="border shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5 text-indigo-500" />
                    各赛段评审轮次与指派控制台
                  </CardTitle>
                  <CardDescription>
                    启动或封存赛段评审，指派本赛段评审专家。
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t">
                  {rounds.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      目前未创建任何多轮评审赛段
                    </div>
                  ) : (
                    <div className="divide-y">
                      {rounds.map((r) => {
                        const progress = roundProgresses[r.id]
                        const isAssigningThis = selectedRoundForAssign === r.id

                        return (
                          <div key={r.id} className="p-5 flex flex-col gap-4 hover:bg-surface/10 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{r.contestTitle}</span>
                                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                                    第 {r.roundNumber} 轮
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                    r.status === 'ongoing' ? 'bg-amber-500/10 text-amber-500' :
                                    r.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {r.status === 'ongoing' ? '进行中' : r.status === 'completed' ? '已结束' : '未开始'}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  评审范围: {r.startTime} 至 {r.endTime}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {r.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleRoundStatusChange(r.id, 'ongoing')}
                                    className="rounded-lg text-xs"
                                  >
                                    <Play className="size-3 mr-1" />
                                    启动轮次
                                  </Button>
                                )}
                                {r.status === 'ongoing' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRoundStatusChange(r.id, 'completed')}
                                    className="rounded-lg text-xs border-amber-500 text-amber-600 hover:bg-amber-50"
                                  >
                                    <Square className="size-3 mr-1" />
                                    封存结束
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setSelectedRoundForAssign(isAssigningThis ? null : r.id)}
                                  className="rounded-lg text-xs"
                                >
                                  <Users className="size-3 mr-1" />
                                  指派评审任务
                                </Button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            {progress && (
                              <div className="space-y-1.5 p-3 rounded-xl border bg-surface/20 max-w-xl">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">专家评分进度 ({progress.completed}/{progress.total})</span>
                                  <span className="font-semibold text-primary">{Math.round(progress.ratio * 100)}%</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-primary h-full rounded-full transition-all duration-500"
                                    style={{ width: `${Math.round(progress.ratio * 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Assigning interface */}
                            {isAssigningThis && (
                              <div className="mt-2 p-4 rounded-xl border bg-surface/30 space-y-4 border-dashed animate-in fade-in duration-300">
                                <div className="text-xs font-semibold text-muted-foreground">选择本轮次的评委专家</div>
                                <div className="flex flex-wrap gap-2">
                                  {reviewers.map((rev) => {
                                    if (rev.id === undefined) return null
                                    const revId = rev.id
                                    const checked = assignRoundReviewers.includes(revId)
                                    return (
                                      <button
                                        key={revId}
                                        type="button"
                                        onClick={() => {
                                          if (checked) {
                                            setAssignRoundReviewers(prev => prev.filter(i => i !== revId))
                                          } else {
                                            setAssignRoundReviewers(prev => [...prev, revId])
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                          checked
                                            ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                                            : 'bg-background hover:bg-surface text-muted-foreground border-border'
                                        }`}
                                      >
                                        {rev.name}
                                      </button>
                                    )
                                  })}
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="ghost" className="rounded-lg text-xs" onClick={() => setSelectedRoundForAssign(null)}>
                                    取消
                                  </Button>
                                  <Button size="sm" className="rounded-lg text-xs" onClick={assignRoundTasks}>
                                    确认分配评审职责
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
