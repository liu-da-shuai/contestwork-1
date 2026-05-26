import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'

const BASE_URL = 'http://localhost:8080'

export const printApi = {
  getSignupPrintUrl(id: number | string): string {
    if (USE_MOCKS) {
      // Just return a virtual dummy printable page
      return `javascript:alert('打印虚拟报名记录 ID: ${id}');window.print();`
    }
    return `${BASE_URL}${API_ENDPOINTS.printSignup}?id=${id}`
  },

  getSignupListPrintUrl(contestTitle: string): string {
    if (USE_MOCKS) {
      return `javascript:alert('打印虚拟竞赛汇总名单: ${contestTitle}');window.print();`
    }
    return `${BASE_URL}${API_ENDPOINTS.printSignupList}?contest_title=${encodeURIComponent(contestTitle)}`
  },
}
