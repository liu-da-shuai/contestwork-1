import { type FormEvent, useEffect, useState } from 'react'
import { BookOpenCheck, Send } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { contestApi, signupApi, type Contest, type SignupPayload } from '@/api'
import { getCurrentUser } from '@/auth/session'
import { ErrorPanel, LoadingPanel } from '@/components/app/async-panel'
import { SectionHeading, WorkspaceHeader } from '@/components/app/workspace-shell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

function createInitialSignup(name = ''): SignupPayload {
  return {
    contestTitle: '',
    teacherName: name,
    unit: '',
    phone: '',
    courseName: '',
    grade: '',
    desc: '',
    time: new Date().toISOString().slice(0, 10),
  }
}

export function TeacherSubmitPage() {
  const user = getCurrentUser()
  const [contests, setContests] = useState<Contest[]>([])
  const [form, setForm] = useState<SignupPayload>(() => createInitialSignup(user?.name))
  const { loadingAction, error, message, submitting, runQuery, runSubmit } = useAsyncAction()

  useEffect(() => {
    void runQuery('加载可选竞赛', async () => {
      const data = await contestApi.list()
      setContests(data)
      setForm((value) => ({ ...value, contestTitle: value.contestTitle || data[0]?.title || '' }))
    })
  }, [runQuery])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void runSubmit(
      () => signupApi.create(form),
      () => setForm(createInitialSignup(user?.name)) // Reset on success, but keep name
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <WorkspaceHeader
        title="提交报名材料"
        description="选择目标竞赛并填写您的课程报名信息。"
      />

      {loadingAction && <LoadingPanel title={loadingAction} description="请稍候" />}

      <Card className="border shadow-sm bg-card">
        <CardContent className="p-6 md:p-8">
          <SectionHeading title="填写报名表" description="所有带星号的字段均为必填项。" />
          
          <div className="mt-6">
            {message && (
              <Alert className="mb-6 rounded-xl border-none bg-primary/10 text-primary">
                <BookOpenCheck aria-hidden="true" className="size-4" />
                <AlertTitle>报名已提交</AlertTitle>
                <AlertDescription className="text-primary/80">{message}</AlertDescription>
              </Alert>
            )}
            {error && <ErrorPanel className="mb-6" title="提交失败" description={error} />}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label>竞赛项目 *</Label>
                <Select
                  value={form.contestTitle}
                  onValueChange={(contestTitle) => setForm((value) => ({ ...value, contestTitle }))}
                >
                  <SelectTrigger className="w-full bg-surface/50 h-12 rounded-xl">
                    <SelectValue placeholder="选择竞赛" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {contests.map((contest) => (
                        <SelectItem key={contest.id} value={contest.title}>
                          {contest.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teacher-name">教师姓名 *</Label>
                  <Input
                    id="teacher-name"
                    value={form.teacherName}
                    onChange={(event) => setForm((value) => ({ ...value, teacherName: event.target.value }))}
                    required
                    className="bg-surface/50 h-12 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teacher-unit">所属单位 *</Label>
                  <Input
                    id="teacher-unit"
                    value={form.unit}
                    onChange={(event) => setForm((value) => ({ ...value, unit: event.target.value }))}
                    required
                    className="bg-surface/50 h-12 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teacher-phone">联系电话 *</Label>
                  <Input
                    id="teacher-phone"
                    value={form.phone}
                    onChange={(event) => setForm((value) => ({ ...value, phone: event.target.value }))}
                    required
                    className="bg-surface/50 h-12 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teacher-grade">授课年级 *</Label>
                  <Input
                    id="teacher-grade"
                    value={form.grade}
                    onChange={(event) => setForm((value) => ({ ...value, grade: event.target.value }))}
                    required
                    className="bg-surface/50 h-12 rounded-xl"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="teacher-time">报名日期 *</Label>
                  <Input
                    id="teacher-time"
                    type="date"
                    value={form.time}
                    onChange={(event) => setForm((value) => ({ ...value, time: event.target.value }))}
                    required
                    className="bg-surface/50 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="teacher-course">课程名称 *</Label>
                <Input
                  id="teacher-course"
                  value={form.courseName}
                  onChange={(event) => setForm((value) => ({ ...value, courseName: event.target.value }))}
                  required
                  className="bg-surface/50 h-12 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="teacher-desc">课程说明 *</Label>
                <Textarea
                  id="teacher-desc"
                  value={form.desc}
                  onChange={(event) => setForm((value) => ({ ...value, desc: event.target.value }))}
                  required
                  className="bg-surface/50 min-h-[120px] rounded-xl resize-y"
                  placeholder="请输入课程简要介绍、特色等..."
                />
              </div>

              <div className="mt-4 border-t border-border/50 pt-6">
                <Button type="submit" disabled={submitting} className="h-12 w-full sm:w-auto px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20">
                  <Send data-icon="inline-start" aria-hidden="true" />
                  {submitting ? '提交中' : '确认并提交报名'}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
