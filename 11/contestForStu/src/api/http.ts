import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '@/config/env'
import type { ApiEnvelope } from './types'

export class ApiError extends Error {
  code?: number
  status?: number

  constructor(message: string, options?: { code?: number; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.code = options?.code
    this.status = options?.status
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('contest_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const message =
      error.response?.data?.msg ||
      error.message ||
      '网络请求失败，请稍后重试'

    return Promise.reject(
      new ApiError(message, {
        code: error.response?.data?.code,
        status: error.response?.status,
      }),
    )
  },
)

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<ApiEnvelope<T>>(config)
  const payload = response.data

  if (payload.code !== 1) {
    throw new ApiError(payload.msg || '接口返回失败', { code: payload.code })
  }

  return payload.data
}

export async function requestBlob(config: AxiosRequestConfig): Promise<Blob> {
  const response = await http.request<Blob>({
    ...config,
    responseType: 'blob',
  })
  return response.data
}
