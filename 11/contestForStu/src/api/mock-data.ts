import type {
  AwardRecord,
  Contest,
  LoginPayload,
  ReviewRecord,
  SignupRecord,
  User,
} from './types'

export const demoUsers: User[] = [
  { id: 1, username: 'teacher', name: '张老师', role: 'teacher' },
  { id: 2, username: 'reviewer', name: '李评委', role: 'reviewer' },
  { id: 3, username: 'admin', name: '系统管理员', role: 'admin' },
]

export const demoContests: Contest[] = [
  {
    id: 1,
    title: '青年教师教学竞赛',
    time: '2026-05-01 ~ 2026-06-01',
    status: '进行中',
  },
  {
    id: 2,
    title: '课程思政教学创新大赛',
    time: '2026-06-10 ~ 2026-07-05',
    status: '进行中',
  },
  {
    id: 3,
    title: '数字化课堂教学展示',
    time: '2026-04-15 ~ 2026-05-20',
    status: '已结束',
  },
]

export const demoSignups: SignupRecord[] = [
  {
    id: 1,
    contestTitle: '青年教师教学竞赛',
    teacherName: '张三',
    unit: '计算机学院',
    phone: '13800000000',
    courseName: '数据结构',
    grade: '2024级',
    desc: '以项目实践驱动课堂讨论。',
    time: '2026-05-08',
    score: 85,
  },
]

export const demoReviews: ReviewRecord[] = [
  {
    id: 1,
    contestTitle: '青年教师教学竞赛',
    teacherName: '张三',
    courseName: '数据结构',
    score: 85,
    comment: '课程组织清晰，互动充分。',
  },
]

export const demoAwards: AwardRecord[] = [
  {
    id: 1,
    teacher: '张三',
    title: '青年教师教学竞赛',
    award: '一等奖',
  },
  {
    id: 2,
    teacher: '王敏',
    title: '课程思政教学创新大赛',
    award: '二等奖',
  },
  {
    id: 3,
    teacher: '李华',
    title: '数字化课堂教学展示',
    award: '优秀奖',
  },
]

export function mockDelay<T>(data: T, delay = 220): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), delay)
  })
}

export function findDemoUser(payload: LoginPayload) {
  const role = payload.role ?? 'teacher'

  return (
    demoUsers.find((user) => user.username === payload.username && user.role === role) ??
    demoUsers.find((user) => user.role === role) ??
    demoUsers[0]
  )
}
