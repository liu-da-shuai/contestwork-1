import { request } from '@/api/http'
import { normalizeUser } from '@/api/normalizers'
import type { LoginPayload, RegisterPayload, User } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { findDemoUser, mockDelay } from '../mock-data'

export const authApi = {
  async login(payload: LoginPayload) {
    if (USE_MOCKS) {
      return mockDelay(findDemoUser(payload))
    }

    const user = await request<unknown>({
      method: 'POST',
      url: API_ENDPOINTS.login,
      data: payload,
    })

    return normalizeUser(user)
  },

  register(payload: RegisterPayload) {
    if (USE_MOCKS) {
      return mockDelay(`${payload.username} 注册成功`)
    }

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.register,
      data: payload,
    })
  },

} satisfies {
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<string>
}