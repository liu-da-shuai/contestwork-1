import { request } from '@/api/http'
import { normalizeSignup, toSignupServer } from '@/api/normalizers'
import type { SignupPayload, SignupRecord, SignupUpdatePayload } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { demoSignups, mockDelay } from '../mock-data'

export const signupApi = {
  create(payload: SignupPayload) {
    if (USE_MOCKS) {
      return mockDelay(`${payload.teacherName} 报名成功`)
    }

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.signupAdd,
      data: toSignupServer(payload),
    })
  },

  async list() {
    if (USE_MOCKS) {
      return mockDelay(demoSignups)
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.signupList,
    })

    return data.map(normalizeSignup)
  },

  async detail(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay(demoSignups.find((item) => String(item.id) === String(id)) ?? demoSignups[0])
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.signupDetail(id),
    })

    return normalizeSignup(data)
  },

  update(payload: SignupUpdatePayload) {
    if (USE_MOCKS) {
      return mockDelay('更新成功')
    }

    return request<string>({
      method: 'PUT',
      url: API_ENDPOINTS.signupUpdate,
      data: toSignupServer(payload),
    })
  },

  remove(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay('删除成功')
    }

    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.signupDelete(id),
    })
  },

  async byContest(contestTitle: string) {
    if (USE_MOCKS) {
      return mockDelay(demoSignups.filter((item) => item.contestTitle === contestTitle))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.signupByContest,
      params: { contest_title: contestTitle },
    })

    return data.map(normalizeSignup)
  },

  async byTeacher(teacherName: string) {
    if (USE_MOCKS) {
      return mockDelay(demoSignups.filter((item) => item.teacherName === teacherName))
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.signupByTeacher,
      params: { teacher_name: teacherName },
    })

    return data.map(normalizeSignup)
  },
} satisfies {
  create: (payload: SignupPayload) => Promise<string>
  list: () => Promise<SignupRecord[]>
  detail: (id: number | string) => Promise<SignupRecord>
  update: (payload: SignupUpdatePayload) => Promise<string>
  remove: (id: number | string) => Promise<string>
  byContest: (contestTitle: string) => Promise<SignupRecord[]>
  byTeacher: (teacherName: string) => Promise<SignupRecord[]>
}
