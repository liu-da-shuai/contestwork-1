import { request } from '@/api/http'
import { normalizeAward, toAwardServer } from '@/api/normalizers'
import type { AwardPayload, AwardRecord, AwardUpdatePayload } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { demoAwards, mockDelay } from '../mock-data'

export const awardApi = {
  create(payload: AwardPayload) {
    if (USE_MOCKS) {
      return mockDelay(`${payload.teacher} 获奖信息已添加`)
    }

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.awardAdd,
      data: toAwardServer(payload),
    })
  },

  async list() {
    if (USE_MOCKS) {
      return mockDelay(demoAwards)
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.awardList,
    })

    return data.map(normalizeAward)
  },

  async detail(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay(demoAwards.find((item) => String(item.id) === String(id)) ?? demoAwards[0])
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.awardDetail(id),
    })

    return normalizeAward(data)
  },

  update(payload: AwardUpdatePayload) {
    if (USE_MOCKS) {
      return mockDelay('更新成功')
    }

    return request<string>({
      method: 'PUT',
      url: API_ENDPOINTS.awardUpdate,
      data: toAwardServer(payload),
    })
  },

  remove(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay('删除成功')
    }

    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.awardDelete(id),
    })
  },

  async byTeacher(teacher: string) {
    if (USE_MOCKS) {
      return mockDelay(demoAwards.filter((item) => item.teacher === teacher))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.awardByTeacher,
      params: { teacher },
    })

    return data.map(normalizeAward)
  },

  async byTitle(title: string) {
    if (USE_MOCKS) {
      return mockDelay(demoAwards.filter((item) => item.title === title))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.awardByTitle,
      params: { title },
    })

    return data.map(normalizeAward)
  },
} satisfies {
  create: (payload: AwardPayload) => Promise<string>
  list: () => Promise<AwardRecord[]>
  detail: (id: number | string) => Promise<AwardRecord>
  update: (payload: AwardUpdatePayload) => Promise<string>
  remove: (id: number | string) => Promise<string>
  byTeacher: (teacher: string) => Promise<AwardRecord[]>
  byTitle: (title: string) => Promise<AwardRecord[]>
}
