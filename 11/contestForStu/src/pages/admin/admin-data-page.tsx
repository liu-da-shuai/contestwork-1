import { useEffect, useRef, useState } from 'react'
import { Download, ShieldCheck, Database, Play, Trash2, FileText, CheckCircle } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import {
  awardApi,
  contestApi,
  reviewApi,
  signupApi,
  userApi,
  backupApi,
  plagiarismApi,
  type AwardRecord,
  type ReviewRecord,
  type SignupRecord,
  type User,
  type UserRole,
  type BackupFile,
  type PlagiarismTask,
  type PlagiarismResult,
} from '@/api'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { ActionPanel, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SignupTable } from '@/components/app/tables/signup-table'
import { ReviewTable } from '@/components/app/tables/review-table'

// Simple Dropdown Component
function ActionDropdown({ label, icon: Icon, children }: { label: string, icon: React.ElementType, children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <Button variant="outline" onClick={() => setOpen(!open)} className="rounded-lg">
        <Icon size={16} className="mr-2" />
        {label}
      </Button>
      {open && (
        <div className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-xl bg-popover p-1 shadow-md border border-border animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminDataPage() {
  const [signups, setSignups] = useState<SignupRecord[]>([])
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [awards, setAwards] = useState<AwardRecord[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [inspectedUser, setInspectedUser] = useState<User | null>(null)
  
  // New States
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [plagiarismTasks, setPlagiarismTasks] = useState<PlagiarismTask[]>([])
  const [selectedPlagiarismTask, setSelectedPlagiarismTask] = useState<PlagiarismTask | null>(null)
  const [plagiarismResults, setPlagiarismResults] = useState<PlagiarismResult[]>([])
  const [showPlagiarismModal, setShowPlagiarismModal] = useState(false)
  
  const { loadingAction, error, runQuery } = useAsyncAction()

  // Initialization
  useEffect(() => {
    void loadAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadAllData() {
    return runQuery('获取全部数据', async () => {
      const [signupList, reviewList, awardList, userList, backupList] = await Promise.all([
        signupApi.list(),
        reviewApi.list(),
        awardApi.list(),
        userApi.list(),
        backupApi.list(),
      ])
      setSignups(signupList)
      setReviews(reviewList)
      setAwards(awardList)
      setUsers(userList)
      setBackups(backupList)
      
      // Load plagiarism tasks for the first contest if available
      if (signupList.length > 0) {
        try {
          const pTasks = await plagiarismApi.list(signupList[0].contestTitle)
          setPlagiarismTasks(pTasks)
        } catch (e) {
          console.error('Failed to load plagiarism tasks', e)
        }
      }
    })
  }

  function loadUsers() {
    return runQuery('获取用户列表', async () => setUsers(await userApi.list()))
  }

  function loadUsersByRole(role: UserRole) {
    return runQuery(`获取${role}列表`, async () => setUsers(await userApi.byRole(role)))
  }

  function inspectUser(id?: number) {
    if (!id) return
    return runQuery('获取用户详情', async () => setInspectedUser(await userApi.detail(id)))
  }

  function deleteUser(id?: number) {
    if (!id) return
    return runQuery('删除用户', async () => {
      await userApi.remove(id)
      setUsers((items) => items.filter((item) => item.id !== id))
      setInspectedUser((item) => (item?.id === id ? null : item))
    })
  }

  function deleteSignup(id: number) {
    return runQuery('删除报名', async () => {
      await signupApi.remove(id)
      setSignups((items) => items.filter((item) => item.id !== id))
    })
  }

  function deleteReview(id: number) {
    return runQuery('删除评审', async () => {
      await reviewApi.remove(id)
      setReviews((items) => items.filter((item) => item.id !== id))
    })
  }

  function deleteAward(id: number) {
    return runQuery('删除获奖', async () => {
      await awardApi.remove(id)
      setAwards((items) => items.filter((item) => item.id !== id))
    })
  }



  // Backup & Restore Actions
  function loadBackups() {
    return runQuery('获取备份列表', async () => setBackups(await backupApi.list()))
  }

  function handleCreateBackup() {
    return runQuery('创建数据备份', async () => {
      await backupApi.create()
      await loadBackups()
    })
  }

  function handleDeleteBackup(filename: string) {
    if (!confirm(`确定要永久删除备份 ${filename} 吗？`)) return
    return runQuery('删除数据备份', async () => {
      await backupApi.remove(filename)
      await loadBackups()
    })
  }

  function handleRestoreBackup(filename: string) {
    if (!confirm(`🚨 警告：还原备份 ${filename} 将会覆盖当前数据库的所有数据！确定继续吗？`)) return
    return runQuery('还原数据库', async () => {
      const msg = await backupApi.restore(filename)
      alert(msg)
      await loadAllData()
    })
  }

  async function handleDownloadBackup(filename: string) {
    const blob = await backupApi.download(filename)
    downloadBlob(blob, filename)
  }

  // Plagiarism Actions
  function loadPlagiarismTasks(contestTitle: string) {
    return runQuery('获取查重任务', async () => setPlagiarismTasks(await plagiarismApi.list(contestTitle)))
  }

  function handleCreatePlagiarism(signupId: number, contestTitle: string) {
    return runQuery('创建查重任务', async () => {
      await plagiarismApi.create(signupId, contestTitle)
      await loadPlagiarismTasks(contestTitle)
    })
  }

  function handleRunPlagiarism(id: number, contestTitle: string) {
    return runQuery('执行查重算法', async () => {
      await plagiarismApi.run(id)
      await loadPlagiarismTasks(contestTitle)
    })
  }

  function handleViewPlagiarismReport(task: PlagiarismTask) {
    return runQuery('获取相似度报告', async () => {
      const results = await plagiarismApi.results(task.id)
      setSelectedPlagiarismTask(task)
      setPlagiarismResults(results)
      setShowPlagiarismModal(true)
    })
  }

  // Local CSV Exporter (BOM UTF-8 enabled for Excel compatibility)
  function exportToCSV<T>(
    data: T[],
    filename: string,
    headers: string[],
    keys: (keyof T | ((item: T) => string))[]
  ) {
    const csvRows: string[] = []
    
    // Header row
    csvRows.push(headers.join(','))
    
    // Data rows
    for (const item of data) {
      const values = keys.map(key => {
        let val = ''
        if (typeof key === 'function') {
          val = key(item)
        } else {
          val = String(item[key] ?? '')
        }
        // Escape double quotes and wrap in quotes if contains comma, newline or quotes
        const escaped = ('' + val).replace(/"/g, '""')
        return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') 
          ? `"${escaped}"` 
          : escaped
      })
      csvRows.push(values.join(','))
    }
    
    // Add UTF-8 BOM so Excel opens it with correct Chinese characters encoding
    const csvContent = '\uFEFF' + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, filename)
  }

  function downloadBlob(blob: Blob, filename: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function handleExportContest() {
    return runQuery('导出竞赛数据', async () => {
      const list = await contestApi.list()
      exportToCSV(
        list,
        `竞赛数据_${new Date().getTime()}.csv`,
        ['ID', '竞赛名称', '时间', '状态'],
        ['id', 'title', 'time', 'status']
      )
    })
  }

  function handleExportSignup() {
    exportToCSV(
      signups,
      `报名数据_${new Date().getTime()}.csv`,
      ['ID', '竞赛项目', '教师', '单位', '电话', '课程名称', '年级', '设计简介'],
      ['id', 'contestTitle', 'teacherName', 'unit', 'phone', 'courseName', 'grade', 'desc']
    )
  }

  function handleExportReview() {
    exportToCSV(
      reviews,
      `评审数据_${new Date().getTime()}.csv`,
      ['ID', '竞赛项目', '被评教师', '课程名称', '评分', '评语'],
      ['id', 'contestTitle', 'teacherName', 'courseName', 'score', 'comment']
    )
  }

  function handleExportAward() {
    exportToCSV(
      awards,
      `获奖数据_${new Date().getTime()}.csv`,
      ['ID', '教师', '竞赛', '奖项'],
      ['id', 'teacher', 'title', 'award']
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        title="全量数据管理"
        description="全量业务数据查看、系统安全备份与防剽窃学术查重控制台。"
      />

      {loadingAction && <LoadingPanel title={loadingAction} description="处理中..." />}
      {error && <ErrorPanel title="操作失败" description={error} />}

      <ActionPanel title="数据操作" description="数据刷新与本地表导出">


        <ActionDropdown label="导出数据" icon={Download}>
          <button className="w-full text-left text-sm px-3 py-2 hover:bg-secondary-container hover:text-on-secondary-container rounded-md transition-colors" onClick={() => void handleExportContest()}>导出竞赛</button>
          <button className="w-full text-left text-sm px-3 py-2 hover:bg-secondary-container hover:text-on-secondary-container rounded-md transition-colors" onClick={() => void handleExportSignup()}>导出报名</button>
          <button className="w-full text-left text-sm px-3 py-2 hover:bg-secondary-container hover:text-on-secondary-container rounded-md transition-colors" onClick={() => void handleExportReview()}>导出评审</button>
          <button className="w-full text-left text-sm px-3 py-2 hover:bg-secondary-container hover:text-on-secondary-container rounded-md transition-colors" onClick={() => void handleExportAward()}>导出获奖</button>
        </ActionDropdown>
        
        <Button variant="outline" onClick={loadAllData} className="rounded-lg">
          全部刷新
        </Button>
      </ActionPanel>

      <Card className="border overflow-hidden shadow-sm bg-card">
        <CardContent className="p-0">
          <Tabs defaultValue="signups" className="flex flex-col">
            <div className="border-b border-border/40 px-5 pt-5 pb-4">
              <TabsList className="flex flex-row overflow-x-auto gap-1.5 p-1 border rounded-2xl bg-surface/50 max-w-full justify-start self-start no-scrollbar flex-nowrap h-auto border-none">
                <TabsTrigger value="signups" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 text-muted-foreground hover:bg-primary/5">报名项目</TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 text-muted-foreground hover:bg-primary/5">专家评审</TabsTrigger>
                <TabsTrigger value="users" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 text-muted-foreground hover:bg-primary/5">用户账户</TabsTrigger>
                <TabsTrigger value="awards" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 text-muted-foreground hover:bg-primary/5">获奖记录</TabsTrigger>
                <TabsTrigger value="plagiarism" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 text-muted-foreground hover:bg-primary/5">查重分析</TabsTrigger>
                <TabsTrigger value="backups" className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 shrink-0 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 text-muted-foreground hover:bg-primary/5">系统备份</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-5">
              <TabsContent value="signups" className="mt-0 outline-none">
                <SignupTable
                  data={signups}
                  showUnit
                  action={(signup) => (
                    <Button type="button" size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteSignup(signup.id)}>删除</Button>
                  )}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-0 outline-none">
                <ReviewTable
                  data={reviews}
                  action={(review) => (
                    <Button type="button" size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteReview(review.id)}>删除</Button>
                  )}
                />
              </TabsContent>

              <TabsContent value="users" className="mt-0 outline-none">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="secondary" className="rounded-lg" onClick={loadUsers}>全部用户</Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => loadUsersByRole('admin')}>管理员</Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => loadUsersByRole('teacher')}>教师</Button>
                  <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => loadUsersByRole('reviewer')}>评委</Button>
                </div>

                {inspectedUser && (
                  <div className="mb-5 rounded-xl border bg-surface px-5 py-4 text-sm animate-in fade-in slide-in-from-top-2">
                    <p className="text-lg font-bold text-foreground flex items-center gap-2">
                      {inspectedUser.name || inspectedUser.username}
                      <Badge variant="outline" className="font-normal">{inspectedUser.role}</Badge>
                    </p>
                    <p className="mt-1 text-muted-foreground">ID: {inspectedUser.id} / 用户名: {inspectedUser.username ?? '未设置'}</p>


                  </div>
                )}

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-surface-container-low">
                      <TableRow>
                        <TableHead>姓名</TableHead>
                        <TableHead>用户名</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={`${user.role}-${user.username}`}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.username ?? '未设置'}</TableCell>
                          <TableCell><Badge variant="secondary" className="font-normal">{user.role}</Badge></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => inspectUser(user.id)}>详情</Button>
                              <Button type="button" size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg" onClick={() => deleteUser(user.id)}>删除</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="awards" className="mt-0 outline-none">
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-surface-container-low">
                      <TableRow>
                        <TableHead>教师</TableHead>
                        <TableHead>竞赛</TableHead>
                        <TableHead>奖项</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {awards.map((award) => (
                        <TableRow key={award.id}>
                          <TableCell className="font-medium">{award.teacher}</TableCell>
                          <TableCell>{award.title}</TableCell>
                          <TableCell><Badge className="font-normal bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none">{award.award}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button type="button" size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg" onClick={() => deleteAward(award.id)}>删除</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="plagiarism" className="mt-0 outline-none">
                <div className="mb-4 flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <ShieldCheck className="size-5 text-primary" />
                      学术规范作品查重
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">自动比对所有报名教学设计，计算最高相似度。</p>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-surface-container-low">
                      <TableRow>
                        <TableHead>课程与教师</TableHead>
                        <TableHead>竞赛项目</TableHead>
                        <TableHead>查重状态</TableHead>
                        <TableHead>最高相似度</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signups.map((signup) => {
                        const task = plagiarismTasks.find((t) => t.signupId === signup.id)
                        return (
                          <TableRow key={signup.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <div className="font-medium">{signup.courseName}</div>
                              <div className="text-xs text-muted-foreground">{signup.teacherName} · {signup.unit}</div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground/80">{signup.contestTitle}</TableCell>
                            <TableCell>
                              {!task ? (
                                <Badge variant="outline" className="text-muted-foreground border-dashed">未创建</Badge>
                              ) : task.status === 'pending' ? (
                                <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-300 animate-pulse">排队中</Badge>
                              ) : (
                                <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300">已比对</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {task && task.status === 'completed' ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden shrink-0">
                                    <div
                                      className={`h-full rounded-full ${
                                        task.similarity > 0.5
                                          ? 'bg-rose-500'
                                          : task.similarity > 0.3
                                          ? 'bg-amber-500'
                                          : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${task.similarity * 100}%` }}
                                    />
                                  </div>
                                  <span
                                    className={`text-xs font-bold ${
                                      task.similarity > 0.5
                                        ? 'text-rose-500'
                                        : task.similarity > 0.3
                                        ? 'text-amber-500'
                                        : 'text-emerald-500'
                                    }`}
                                  >
                                    {(task.similarity * 100).toFixed(0)}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!task ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleCreatePlagiarism(signup.id, signup.contestTitle)}
                                  className="rounded-lg h-8"
                                >
                                  创建任务
                                </Button>
                              ) : task.status === 'pending' ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRunPlagiarism(task.id, signup.contestTitle)}
                                  className="rounded-lg h-8 border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                >
                                  <Play className="size-3 mr-1" />
                                  执行分析
                                </Button>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewPlagiarismReport(task)}
                                    className="rounded-lg h-8"
                                  >
                                    <FileText className="size-3 mr-1" />
                                    查看报告
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRunPlagiarism(task.id, signup.contestTitle)}
                                    title="重新比对"
                                    className="rounded-lg h-8 px-2"
                                  >
                                    重新分析
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {signups.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">暂无报名作品</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="backups" className="mt-0 outline-none">
                <div className="mb-4 flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Database className="size-5 text-primary" />
                      全量数据库备份与覆盖还原
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">创建数据库 SQL 快照，以供灾备还原。</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleCreateBackup}
                    className="rounded-xl shadow-sm hover:shadow active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500"
                  >
                    创建全新数据备份
                  </Button>
                </div>

                <div className="rounded-xl border overflow-hidden bg-card">
                  <Table>
                    <TableHeader className="bg-surface-container-low">
                      <TableRow>
                        <TableHead>备份文件名称</TableHead>
                        <TableHead>文件大小</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backups.map((b) => (
                        <TableRow key={b.filename} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-mono text-sm text-foreground font-semibold">{b.filename}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{(b.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{b.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => void handleDownloadBackup(b.filename)}
                                className="rounded-lg h-8"
                              >
                                <Download className="size-3 mr-1" />
                                下载
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => void handleRestoreBackup(b.filename)}
                                className="rounded-lg h-8 border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              >
                                <CheckCircle className="size-3 mr-1" />
                                覆盖还原
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => void handleDeleteBackup(b.filename)}
                                className="rounded-lg h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {backups.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">未创建任何系统备份</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Plagiarism Report Modal */}
      {showPlagiarismModal && selectedPlagiarismTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-card rounded-2xl border shadow-xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <div>
                <h2 className="text-lg font-bold text-foreground">学术合规查重深度分析报告</h2>
                <p className="text-xs text-muted-foreground mt-0.5">任务 ID: {selectedPlagiarismTask.id} · 比对时间: {selectedPlagiarismTask.checkTime}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlagiarismModal(false)}
                className="rounded-full size-8 p-0"
              >
                ✕
              </Button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Score card */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 rounded-xl border p-4 bg-surface flex flex-col justify-center items-center">
                  <div
                    className={`text-3xl font-extrabold ${
                      selectedPlagiarismTask.similarity > 0.5
                        ? 'text-rose-500'
                        : selectedPlagiarismTask.similarity > 0.3
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {(selectedPlagiarismTask.similarity * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground mt-1">最高文字重合率</div>
                </div>

                <div className="col-span-2 rounded-xl border p-4 bg-surface flex flex-col justify-center">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        selectedPlagiarismTask.similarity > 0.5
                          ? 'bg-rose-500'
                          : selectedPlagiarismTask.similarity > 0.3
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    学术合规性评级：
                    {selectedPlagiarismTask.similarity > 0.5
                      ? '高危 (警告)'
                      : selectedPlagiarismTask.similarity > 0.3
                      ? '适度重合 (中等风险)'
                      : '原创度极高 (安全)'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {selectedPlagiarismTask.similarity > 0.5
                      ? '重合度较高，疑似存在抄袭，建议人工核实。'
                      : selectedPlagiarismTask.similarity > 0.3
                      ? '与部分通用词句或大纲相似，基本符合原创规范。'
                      : '逻辑、脉络与文本细节均为独立开发，顺利通过比对。'}
                  </p>
                </div>
              </div>

              {/* Detailed matches */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3">比对匹配库详情 (TOP 匹配项)</h4>
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-surface-container-low">
                      <TableRow>
                        <TableHead className="text-xs">目标匹配作品</TableHead>
                        <TableHead className="text-xs">提交教师</TableHead>
                        <TableHead className="text-xs text-right">相似度比例</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plagiarismResults.map((r) => (
                        <TableRow key={r.id} className="text-sm">
                          <TableCell className="font-medium text-foreground">{r.courseName || `竞赛作品 ID: ${r.targetSignupId}`}</TableCell>
                          <TableCell className="text-muted-foreground">{r.teacherName || '外部教案库'}</TableCell>
                          <TableCell className="text-right text-rose-500 font-bold">{(r.similarity * 100).toFixed(0)}%</TableCell>
                        </TableRow>
                      ))}
                      {plagiarismResults.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-xs text-muted-foreground">未发现任何有价值的雷同比对源</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Report content */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">智能比对详细报告意见</h4>
                <div className="bg-muted/40 border rounded-xl p-4 text-sm text-foreground/80 leading-relaxed font-sans whitespace-pre-line">
                  {selectedPlagiarismTask.report}
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end bg-muted/10">
              <Button
                type="button"
                onClick={() => setShowPlagiarismModal(false)}
                className="rounded-xl"
              >
                我知道了
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

