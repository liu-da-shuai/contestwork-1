import { request, requestBlob } from '@/api/http'
import { normalizeAttachment } from '@/api/normalizers'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { mockDelay } from '../mock-data'
import type { AttachmentRecord } from '../types'

// Mock storage
const demoAttachments: AttachmentRecord[] = [
  {
    id: 1,
    signupId: 1,
    filename: 'attachment_data_structure_syllabus.pdf',
    originalName: '数据结构课程教学大纲.pdf',
    filePath: '/uploads/attachments/1/syllabus.pdf',
    fileSize: 1024 * 1024 * 1.5,
    fileType: 'application/pdf',
    uploadTime: '2026-05-10 14:20:00',
  },
  {
    id: 2,
    signupId: 1,
    filename: 'attachment_data_structure_plan.docx',
    originalName: '教案设计说明.docx',
    filePath: '/uploads/attachments/1/plan.docx',
    fileSize: 1024 * 342,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2026-05-10 14:25:00',
  },
]

export const attachmentApi = {
  async list(signupId: number): Promise<AttachmentRecord[]> {
    if (USE_MOCKS) {
      return mockDelay(demoAttachments.filter((item) => item.signupId === signupId))
    }
    const data = await request<unknown[]>({
      method: 'GET',
      url: API_ENDPOINTS.attachmentList,
      params: { signup_id: signupId },
    })
    return data.map(normalizeAttachment)
  },

  async upload(file: File, signupId: number): Promise<string> {
    if (USE_MOCKS) {
      const newAttachment: AttachmentRecord = {
        id: Date.now(),
        signupId,
        filename: `attachment_${Date.now()}_${file.name}`,
        originalName: file.name,
        filePath: `/uploads/attachments/${signupId}/${file.name}`,
        fileSize: file.size,
        fileType: file.type,
        uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      }
      demoAttachments.push(newAttachment)
      return mockDelay('上传成功')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('signup_id', String(signupId))

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.attachmentUpload,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async uploadMultiple(files: File[], signupId: number): Promise<string> {
    if (USE_MOCKS) {
      files.forEach((file) => {
        const newAttachment: AttachmentRecord = {
          id: Date.now() + Math.random(),
          signupId,
          filename: `attachment_${Date.now()}_${file.name}`,
          originalName: file.name,
          filePath: `/uploads/attachments/${signupId}/${file.name}`,
          fileSize: file.size,
          fileType: file.type,
          uploadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        }
        demoAttachments.push(newAttachment)
      })
      return mockDelay('多文件上传成功')
    }

    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    formData.append('signup_id', String(signupId))

    return request<string>({
      method: 'POST',
      url: API_ENDPOINTS.attachmentUploadMultiple,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async download(id: number | string): Promise<Blob> {
    if (USE_MOCKS) {
      return mockDelay(new Blob(['附件虚拟数据'], { type: 'text/plain' }))
    }
    return requestBlob({
      method: 'GET',
      url: API_ENDPOINTS.attachmentDownload(id),
    })
  },

  async remove(id: number | string): Promise<string> {
    if (USE_MOCKS) {
      const idx = demoAttachments.findIndex((item) => String(item.id) === String(id))
      if (idx !== -1) {
        demoAttachments.splice(idx, 1)
      }
      return mockDelay('删除成功')
    }
    return request<string>({
      method: 'DELETE',
      url: API_ENDPOINTS.attachmentDelete(id),
    })
  },
}
