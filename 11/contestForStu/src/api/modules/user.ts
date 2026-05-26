import { request } from '@/api/http'
import { normalizeUser, toPasswordServer, toUserServer } from '@/api/normalizers'
import type { PasswordPayload, User, UserRole, UserUpdatePayload } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { demoUsers, mockDelay } from '../mock-data'

export interface UserApi {
  list(): Promise<User[]>
  detail(id: number | string): Promise<User>
  update(payload: UserUpdatePayload): Promise<string>
  remove(id: number | string): Promise<string>
  changePassword(payload: PasswordPayload): Promise<string>
  byRole(role: UserRole): Promise<User[]>
  logout(): Promise<string>
}

export const userApi: UserApi = {
  async list() {
    if (USE_MOCKS) {
      return mockDelay(demoUsers)
    }

    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.adminUsers,
    })

    return data.map(normalizeUser)
  },

  async detail(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay(demoUsers.find((user) => String(user.id) === String(id)) ?? demoUsers[0])
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.adminUserDetail(id),
    })

    return normalizeUser(data)
  },

  update(payload: UserUpdatePayload) {
    if (USE_MOCKS) {
      return mockDelay('更新成功')
    }

    return request<string>({
      method: 'PUT',
      url: API_ENDPOINTS.adminUsers,
      data: toUserServer(payload),
    })
  },

  remove(id: number | string) {
    if (USE_MOCKS) {
      return mockDelay('删除成功')
    }

    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.adminUserDetail(id),
    })
  },

  changePassword(payload: PasswordPayload) {
    if (USE_MOCKS) {
      return mockDelay('密码修改成功')
    }

    return request<string>({
      method: 'PUT',
      url: API_ENDPOINTS.adminUserPassword,
      data: toPasswordServer(payload),
    })
  },

  async byRole(role: UserRole) {
    const users = await this.list()
    return users.filter((user) => user.role === role)
  },

  async logout() {
    return '登出成功'
  },
}