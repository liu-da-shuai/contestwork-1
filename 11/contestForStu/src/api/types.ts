export interface ApiEnvelope<T> {
  code: 0 | 1
  msg: string
  data: T
}

export const USER_ROLES = ['admin', 'teacher', 'reviewer'] as const
export const CONTEST_STATUSES = ['进行中', '已结束'] as const

export type UserRole = (typeof USER_ROLES)[number]
export type ContestStatus = (typeof CONTEST_STATUSES)[number]

export interface LoginPayload {
  username: string
  password: string
  role?: UserRole
}

export interface RegisterPayload {
  username: string
  password: string
  role: UserRole
}

export interface User {
  id?: number
  username?: string
  password?: string
  name: string
  role: UserRole
}

export interface UserUpdatePayload {
  id: number
  username: string
  password: string
  name: string
  role: UserRole
}

export interface PasswordPayload {
  id: number
  oldPwd: string
  newPwd: string
}

export interface Contest {
  id: number
  title: string
  time: string
  status: ContestStatus | string
}

export type ContestPayload = Omit<Contest, 'id'>
export type ContestUpdatePayload = Contest

export interface SignupPayload {
  contestTitle: string
  teacherName: string
  unit: string
  phone: string
  courseName: string
  grade: string
  desc: string
  time: string
}

export interface SignupRecord extends SignupPayload {
  id: number
  score?: number
}

export interface SignupUpdatePayload extends SignupPayload {
  id: number
}

export interface ReviewPayload {
  contestTitle: string
  teacherName: string
  courseName: string
  score: number
  comment: string
}

export interface ReviewRecord extends ReviewPayload {
  id: number
}

export type ReviewUpdatePayload = ReviewRecord

export interface AwardPayload {
  teacher: string
  title: string
  award: string
}

export interface AwardRecord extends AwardPayload {
  id: number
}

export type AwardUpdatePayload = AwardRecord

export interface ContestStatistics {
  contestTitle: string
  signupCount: number
  reviewCount: number
  awardCount: number
  averageScore: number
  totalScore: number
}

export interface TeacherStatistics {
  teacherName: string
  contestCount: number
  reviewCount: number
  awardCount: number
  averageScore: number
  totalScore: number
}

export interface OverallStatistics {
  totalContests: number
  ongoingContests: number
  finishedContests: number
  totalUsers: number
  totalSignups: number
  totalReviews: number
  totalAwards: number
  averageScore: number
}

// ===================== 新增类型定义 =====================
export interface AttachmentRecord {
  id: number
  signupId: number
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  fileType: string
  uploadTime: string
}

export interface BlindReviewRecord {
  id: number
  contestTitle: string
  signupId: number
  reviewerId: number
  reviewerName: string
  assignedAt: string
  reviewed: boolean
  score?: number
  comment?: string
  reviewedAt?: string
}

export interface PlagiarismTask {
  id: number
  signupId: number
  contestTitle: string
  checkTime: string
  similarity: number
  status: 'pending' | 'completed' | string
  report: string
}

export interface PlagiarismResult {
  id: number
  checkId: number
  targetSignupId: number
  similarity: number
  courseName?: string
  teacherName?: string
}

export interface BackupFile {
  filename: string
  size: number
  createdAt: string
}

