import { request } from '@/api/http'
import { normalizeContest, toContestServer } from '@/api/normalizers'
import type { Contest, ContestPayload, ContestUpdatePayload } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { demoContests, mockDelay } from '../mock-data'

export interface ContestApi {
  list(): Promise<Contest[]>
  detail(id: number | string): Promise<Contest>
  create(payload: ContestPayload): Promise<string>
  update(payload: ContestUpdatePayload): Promise<string>
  remove(id: number | string): Promise<string>
  byStatus(status: string): Promise<Contest[]>
  search(keyword: string): Promise<Contest[]>
}

export const contestApi: ContestApi = {
  async list() {
    if (USE_MOCKS) {
      return mockDelay(demoContests)
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.contestList,
    })

    return data.map(normalizeContest)
  },

  async detail(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay(demoContests.find((contest) => String(contest.id) === String(id)) ?? demoContests[0])
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.contestDetail(id),
    })

    return normalizeContest(data)
  },

  create(payload: ContestPayload) {
    if (USE_MOCKS) {
      return mockDelay('创建成功')
    }

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.contestAdd,
      data: toContestServer(payload),
    })
  },

  update(payload: ContestUpdatePayload) {
    if (USE_MOCKS) {
      return mockDelay('更新成功')
    }

    return request<string>({
      method: 'PUT',
      url: API_ENDPOINTS.contestUpdate,
      data: toContestServer(payload),
    })
  },

  remove(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay('删除成功')
    }

    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.contestDelete(id),
    })
  },

  async byStatus(status: string) {
    const list = await this.list()
    return list.filter((contest) => contest.status === status)
  },

  async search(keyword: string) {
    if (USE_MOCKS) {
      return mockDelay(demoContests.filter((contest) => contest.title.includes(keyword)))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.contestSearch,
      params: { keyword },
    })

    return data.map(normalizeContest)
  },
}