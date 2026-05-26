import { request } from '@/api/http'
import { normalizeReview, toReviewServer } from '@/api/normalizers'
import type { ReviewPayload, ReviewRecord, ReviewUpdatePayload } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { demoReviews, mockDelay } from '../mock-data'

export const reviewApi = {
  create(payload: ReviewPayload) {
    if (USE_MOCKS) {
      return mockDelay(`${payload.teacherName} 评分成功`)
    }

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.reviewAdd,
      data: toReviewServer(payload),
    })
  },

  async list() {
    if (USE_MOCKS) {
      return mockDelay(demoReviews)
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.reviewList,
    })

    return data.map(normalizeReview)
  },

  async detail(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay(demoReviews.find((item) => String(item.id) === String(id)) ?? demoReviews[0])
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.reviewDetail(id),
    })

    return normalizeReview(data)
  },

  update(payload: ReviewUpdatePayload) {
    if (USE_MOCKS) {
      return mockDelay('更新成功')
    }

    return request<string>({
      method: 'PUT',
      url: API_ENDPOINTS.reviewUpdate,
      data: toReviewServer(payload),
    })
  },

  remove(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay('删除成功')
    }

    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.reviewDelete(id),
    })
  },

  async byContest(contestTitle: string) {
    if (USE_MOCKS) {
      return mockDelay(demoReviews.filter((item) => item.contestTitle === contestTitle))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.reviewByContest,
      params: { contest_title: contestTitle },
    })

    return data.map(normalizeReview)
  },

  async byTeacher(teacherName: string) {
    if (USE_MOCKS) {
      return mockDelay(demoReviews.filter((item) => item.teacherName === teacherName))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.reviewByTeacher,
      params: { teacher_name: teacherName },
    })

    return data.map(normalizeReview)
  },

  // ===================== 新增接口开始 =====================
  // 1. 批量分配评审任务
  batchAssignReview(data: { contest_title: string; reviewer_name: string; teacher_names: string[] }) {
    if (USE_MOCKS) {
      return mockDelay('批量分配成功')
    }

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.reviewBatchAssign,
      data
    })
  },

  // 2. 获取待评审列表
  async pending(contestTitle: string) {
    if (USE_MOCKS) {
      return mockDelay(demoReviews.filter(item => !item.score || item.score === 0))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.reviewPending,
      params: { contest_title: contestTitle }
    })

    return data.map(normalizeReview)
  },

  // 3. 获取评审进度
  async progress(contestTitle: string) {
    if (USE_MOCKS) {
      return mockDelay({ total: 10, finished: 6, progress: 60 })
    }

    return request<{ total: number; finished: number; progress: number }>({
      method: 'GET',
      url: API_ENDPOINTS.reviewProgress,
      params: { contest_title: contestTitle }
    })
  },
  // ===================== 新增接口结束 =====================
} satisfies {
  create: (payload: ReviewPayload) => Promise<string>
  list: () => Promise<ReviewRecord[]>
  detail: (id: number | string) => Promise<ReviewRecord>
  update: (payload: ReviewUpdatePayload) => Promise<string>
  remove: (id: number | string) => Promise<string>
  byContest: (contestTitle: string) => Promise<ReviewRecord[]>
  byTeacher: (teacherName: string) => Promise<ReviewRecord[]>
  // 新增类型
  batchAssignReview: (data: { contest_title: string; reviewer_name: string; teacher_names: string[] }) => Promise<string>
  pending: (contestTitle: string) => Promise<ReviewRecord[]>
  progress: (contestTitle: string) => Promise<{ total: number; finished: number; progress: number }>
}
