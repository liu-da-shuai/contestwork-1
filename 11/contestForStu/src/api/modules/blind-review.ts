import { request } from '@/api/http'
import { normalizeBlindReview } from '@/api/normalizers'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { mockDelay } from '../mock-data'
import type { BlindReviewRecord } from '../types'

const demoBlindReviews: BlindReviewRecord[] = [
  {
    id: 1,
    contestTitle: '青年教师教学竞赛',
    signupId: 1,
    reviewerId: 2,
    reviewerName: '李评委',
    assignedAt: '2026-05-08 10:00:00',
    reviewed: false,
  },
]

export const blindReviewApi = {
  async assign(contestTitle: string, reviewerIds: number[]): Promise<string> {
    if (USE_MOCKS) {
      reviewerIds.forEach((rId) => {
        demoBlindReviews.push({
          id: Date.now() + Math.random(),
          contestTitle,
          signupId: 1,
          reviewerId: rId,
          reviewerName: rId === 2 ? '李评委' : `评委_${rId}`,
          assignedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          reviewed: false,
        })
      })
      return mockDelay('盲审任务指派成功')
    }
    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.blindReviewAssign,
      data: { contest_title: contestTitle, reviewer_ids: reviewerIds },
    })
  },

  async list(reviewerId: number, contestTitle: string): Promise<BlindReviewRecord[]> {
    if (USE_MOCKS) {
      return mockDelay(demoBlindReviews.filter((item) => item.reviewerId === reviewerId && item.contestTitle === contestTitle))
    }
    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.blindReviewList,
      params: { reviewer_id: reviewerId, contest_title: contestTitle },
    })
    return data.map(normalizeBlindReview)
  },

  async detail(id: number | string): Promise<BlindReviewRecord> {
    if (USE_MOCKS) {
      return mockDelay(demoBlindReviews.find((item) => String(item.id) === String(id)) || demoBlindReviews[0])
    }
    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.blindReviewDetail(id),
    })
    return normalizeBlindReview(data)
  },

  async submit(id: number, score: number, comment: string): Promise<string> {
    if (USE_MOCKS) {
      const review = demoBlindReviews.find((item) => item.id === id)
      if (review) {
        review.reviewed = true
        review.score = score
        review.comment = comment
        review.reviewedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
      return mockDelay('评分提交成功')
    }
    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.blindReviewSubmit,
      data: { id, score, comment },
    })
  },

  async progress(contestTitle: string): Promise<{ total: number; completed: number; ratio: number }> {
    if (USE_MOCKS) {
      const list = demoBlindReviews.filter((item) => item.contestTitle === contestTitle)
      const completed = list.filter((item) => item.reviewed).length
      return mockDelay({
        total: list.length || 1,
        completed,
        ratio: list.length ? parseFloat((completed / list.length).toFixed(2)) : 0,
      })
    }
    return request<{ total: number; completed: number; ratio: number }>({
      method: 'GET',
      url: API_ENDPOINTS.blindReviewProgress,
      params: { contest_title: contestTitle },
    })
  },

  async remove(id: number): Promise<string> {
    if (USE_MOCKS) {
      const idx = demoBlindReviews.findIndex((item) => item.id === id)
      if (idx !== -1) {
        demoBlindReviews.splice(idx, 1)
      }
      return mockDelay('删除成功')
    }
    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.blindReviewDelete(id),
    })
  },
}
