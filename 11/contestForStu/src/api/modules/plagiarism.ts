import { request } from '@/api/http'
import { normalizePlagiarismResult, normalizePlagiarismTask } from '@/api/normalizers'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { mockDelay } from '../mock-data'
import type { PlagiarismTask, PlagiarismResult } from '../types'

// Mock state
const demoTasks: PlagiarismTask[] = [
  {
    id: 1,
    signupId: 1,
    contestTitle: '青年教师教学竞赛',
    checkTime: '2026-05-15 10:00:00',
    similarity: 0.12, // 12%
    status: 'completed',
    report: '未发现明显抄袭行为。该教学设计在“以项目实践驱动课堂讨论”章节中与他人共享了部分基础导论的相似定义，其余核心教学实施方案、教学过程以及考核机制均为完全原创。',
  },
]

const demoResults: PlagiarismResult[] = [
  {
    id: 1,
    checkId: 1,
    targetSignupId: 2,
    similarity: 0.12,
    courseName: '高级数据结构',
    teacherName: '李思',
  },
  {
    id: 2,
    checkId: 1,
    targetSignupId: 3,
    similarity: 0.05,
    courseName: '计算机导论',
    teacherName: '王五',
  },
]

export const plagiarismApi = {
  async list(contestTitle: string): Promise<PlagiarismTask[]> {
    if (USE_MOCKS) {
      return mockDelay(demoTasks.filter((t) => t.contestTitle === contestTitle))
    }
    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.plagiarismList,
      params: { contest_title: contestTitle },
    })
    return data.map(normalizePlagiarismTask)
  },

  async create(signupId: number, contestTitle: string): Promise<PlagiarismTask> {
    if (USE_MOCKS) {
      const newTask: PlagiarismTask = {
        id: demoTasks.length + 1,
        signupId,
        contestTitle,
        checkTime: '—',
        similarity: 0,
        status: 'pending',
        report: '',
      }
      demoTasks.push(newTask)
      return mockDelay(newTask)
    }
    const data = await request<unknown>({
      method: 'POST',
      url: API_ENDPOINTS.plagiarismCreate,
      data: { signup_id: signupId, contest_title: contestTitle },
    })
    return normalizePlagiarismTask(data)
  },

  async detail(id: number | string): Promise<PlagiarismTask> {
    if (USE_MOCKS) {
      return mockDelay(demoTasks.find((t) => String(t.id) === String(id)) || demoTasks[0])
    }
    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.plagiarismDetail(id),
    })
    return normalizePlagiarismTask(data)
  },

  async results(checkId: number | string): Promise<PlagiarismResult[]> {
    if (USE_MOCKS) {
      return mockDelay(demoResults.filter((r) => String(r.checkId) === String(checkId)))
    }
    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.plagiarismResults,
      params: { check_id: checkId },
    })
    return data.map(normalizePlagiarismResult)
  },

  async run(id: number | string): Promise<PlagiarismTask> {
    if (USE_MOCKS) {
      const task = demoTasks.find((t) => String(t.id) === String(id))
      if (task) {
        task.status = 'completed'
        task.similarity = parseFloat((0.15 + Math.random() * 0.45).toFixed(2))
        task.checkTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        task.report = `查重分析报告已生成。`
        
        demoResults.push({
          id: Date.now(),
          checkId: Number(id),
          targetSignupId: Math.floor(Math.random() * 100) + 10,
          similarity: parseFloat((task.similarity * 0.8).toFixed(2)),
          courseName: '高级算法分析与设计',
          teacherName: '钱老师',
        })
      }
      return mockDelay(task || demoTasks[0])
    }
    const data = await request<unknown>({
      method: 'POST',
      url: API_ENDPOINTS.plagiarismRun(id),
    })
    return normalizePlagiarismTask(data)
  },
}
