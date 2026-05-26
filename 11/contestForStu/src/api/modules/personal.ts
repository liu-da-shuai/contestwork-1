import { request } from '@/api/http'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { mockDelay } from '../mock-data'

export interface PersonalCenterData {
  signups: unknown[]
  reviews: unknown[]
  awards: unknown[]
}

export const personalApi = {
  async getCenter(): Promise<PersonalCenterData> {
    if (USE_MOCKS) {
      return mockDelay({
        signups: [],
        reviews: [],
        awards: [],
      })
    }
    return request<PersonalCenterData>({
      method: 'GET',
      url: API_ENDPOINTS.personalCenter,
    })
  },
}
