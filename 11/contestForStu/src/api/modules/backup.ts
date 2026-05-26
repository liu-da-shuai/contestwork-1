import { request } from '@/api/http'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { mockDelay } from '../mock-data'
import type { BackupFile } from '../types'

// Mock state
const demoBackups: BackupFile[] = [
  {
    filename: 'backup_20260510_120000.sql',
    size: 1024 * 1024 * 4.25, // 4.25MB
    createdAt: '2026-05-10 12:00:00',
  },
  {
    filename: 'backup_20260515_183000.sql',
    size: 1024 * 1024 * 4.31, // 4.31MB
    createdAt: '2026-05-15 18:30:00',
  },
]

export const backupApi = {
  async list(): Promise<BackupFile[]> {
    if (USE_MOCKS) {
      return mockDelay([...demoBackups])
    }
    return request<BackupFile[]>({
      method: 'GET',
      url: API_ENDPOINTS.backupList,
    })
  },

  async create(): Promise<string> {
    if (USE_MOCKS) {
      const nowStr = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14)
      const formattedDate = new Date().toISOString().replace('T', ' ').substring(0, 19)
      const newBackup: BackupFile = {
        filename: `backup_${nowStr}.sql`,
        size: Math.floor(1024 * 1024 * (4.2 + Math.random() * 0.5)),
        createdAt: formattedDate,
      }
      demoBackups.unshift(newBackup)
      return mockDelay('备份创建成功')
    }
    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.backupCreate,
    })
  },

  async download(filename: string): Promise<Blob> {
    if (USE_MOCKS) {
      return mockDelay(new Blob(['SQLite SQL Backup dump'], { type: 'application/octet-stream' }))
    }
    return request<Blob>({
      method: 'GET',
      url: API_ENDPOINTS.backupDownload,
      params: { filename },
      responseType: 'blob',
    })
  },

  async remove(filename: string): Promise<string> {
    if (USE_MOCKS) {
      const idx = demoBackups.findIndex((b) => b.filename === filename)
      if (idx !== -1) {
        demoBackups.splice(idx, 1)
      }
      return mockDelay('备份删除成功')
    }
    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.backupDelete,
      params: { filename },
    })
  },

  async restore(filename: string): Promise<string> {
    if (USE_MOCKS) {
      return mockDelay(`成功恢复数据库至备份版本: ${filename}`)
    }
    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.backupRestore,
      params: { filename },
    })
  },
}
