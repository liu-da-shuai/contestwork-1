import type {
  AwardPayload,
  AwardRecord,
  AwardUpdatePayload,
  AttachmentRecord,
  BlindReviewRecord,
  Contest,
  ContestPayload,
  ContestStatistics,
  ContestUpdatePayload,
  PasswordPayload,
  PlagiarismResult,
  PlagiarismTask,
  ReviewPayload,
  ReviewRecord,
  ReviewUpdatePayload,
  SignupPayload,
  SignupRecord,
  SignupUpdatePayload,
  TeacherStatistics,
  User,
  UserUpdatePayload,
  OverallStatistics,
} from './types'

type AnyRecord = Record<string, unknown>

function pick<T>(source: AnyRecord, lowerKey: string, upperKey: string, fallback: T): T {
  return (source[lowerKey] ?? source[upperKey] ?? fallback) as T
}

export function normalizeUser(raw: unknown): User {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number | undefined>(source, 'id', 'ID', undefined),
    username: pick<string | undefined>(source, 'username', 'Username', undefined),
    password: pick<string | undefined>(source, 'password', 'Password', undefined),
    name: pick<string>(source, 'name', 'Name', ''),
    role: pick<User['role']>(source, 'role', 'Role', 'teacher'),
  }
}

export function normalizeBlindReview(raw: unknown): BlindReviewRecord {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    contestTitle: pick<string>(source, 'contestTitle', 'ContestTitle', ''),
    signupId: pick<number>(source, 'signupId', 'signupID', 0),
    reviewerId: pick<number>(source, 'reviewerId', 'reviewerID', 0),
    reviewerName: pick<string>(source, 'reviewerName', 'ReviewerName', ''),
    assignedAt: pick<string>(source, 'assignedAt', 'AssignedAt', ''),
    reviewed: pick<boolean>(source, 'reviewed', 'Reviewed', false),
    score: pick<number | undefined>(source, 'score', 'Score', undefined),
    comment: pick<string | undefined>(source, 'comment', 'Comment', undefined),
    reviewedAt: pick<string | undefined>(source, 'reviewedAt', 'ReviewedAt', undefined),
  }
}

export function normalizePlagiarismTask(raw: unknown): PlagiarismTask {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    signupId: pick<number>(source, 'signupId', 'signup_id', 0),
    contestTitle: pick<string>(source, 'contestTitle', 'contest_title', ''),
    checkTime: pick<string>(source, 'checkTime', 'check_time', ''),
    similarity: pick<number>(source, 'similarity', 'Similarity', 0),
    status: pick<string>(source, 'status', 'Status', 'pending'),
    report: pick<string>(source, 'report', 'Report', ''),
  }
}

export function normalizePlagiarismResult(raw: unknown): PlagiarismResult {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    checkId: pick<number>(source, 'checkId', 'check_id', 0),
    targetSignupId: pick<number>(source, 'targetSignupId', 'target_signup_id', 0),
    similarity: pick<number>(source, 'similarity', 'Similarity', 0),
    courseName: pick<string>(source, 'courseName', 'course_name', ''),
    teacherName: pick<string>(source, 'teacherName', 'teacher_name', ''),
  }
}

export function normalizeAttachment(raw: unknown): AttachmentRecord {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    signupId: pick<number>(source, 'signupId', 'SignupID', 0),
    filename: pick<string>(source, 'filename', 'Filename', ''),
    originalName: pick<string>(source, 'originalName', 'OriginalName', ''),
    filePath: pick<string>(source, 'filePath', 'FilePath', ''),
    fileSize: pick<number>(source, 'fileSize', 'FileSize', 0),
    fileType: pick<string>(source, 'fileType', 'FileType', ''),
    uploadTime: pick<string>(source, 'uploadTime', 'UploadTime', ''),
  }
}

export function normalizeContest(raw: unknown): Contest {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    title: pick<string>(source, 'title', 'Title', ''),
    time: pick<string>(source, 'time', 'Time', ''),
    status: pick<string>(source, 'status', 'Status', '进行中'),
  }
}

export function normalizeSignup(raw: unknown): SignupRecord {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    contestTitle: pick<string>(source, 'contestTitle', 'contest_title', ''),
    teacherName: pick<string>(source, 'teacherName', 'teacher_name', ''),
    unit: pick<string>(source, 'unit', 'Unit', ''),
    phone: pick<string>(source, 'phone', 'Phone', ''),
    courseName: pick<string>(source, 'courseName', 'course_name', ''),
    grade: pick<string>(source, 'grade', 'Grade', ''),
    desc: pick<string>(source, 'desc', 'Desc', ''),
    time: pick<string>(source, 'time', 'Time', ''),
    score: pick<number | undefined>(source, 'score', 'Score', undefined),
  }
}

export function normalizeReview(raw: unknown): ReviewRecord {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    contestTitle: pick<string>(source, 'contestTitle', 'ContestTitle', ''),
    teacherName: pick<string>(source, 'teacherName', 'TeacherName', ''),
    courseName: pick<string>(source, 'courseName', 'CourseName', ''),
    score: pick<number>(source, 'score', 'Score', 0),
    comment: pick<string>(source, 'comment', 'Comment', ''),
  }
}

export function normalizeAward(raw: unknown): AwardRecord {
  const source = (raw ?? {}) as AnyRecord

  return {
    id: pick<number>(source, 'id', 'ID', 0),
    teacher: pick<string>(source, 'teacher', 'Teacher', ''),
    title: pick<string>(source, 'title', 'Title', ''),
    award: pick<string>(source, 'award', 'Award', ''),
  }
}

export function normalizeContestStatistics(raw: unknown): ContestStatistics {
  const source = (raw ?? {}) as AnyRecord

  return {
    contestTitle: pick<string>(source, 'contestTitle', 'contest_title', ''),
    signupCount: pick<number>(source, 'signupCount', 'signup_count', 0),
    reviewCount: pick<number>(source, 'reviewCount', 'review_count', 0),
    awardCount: pick<number>(source, 'awardCount', 'award_count', 0),
    averageScore: pick<number>(source, 'averageScore', 'average_score', 0),
    totalScore: pick<number>(source, 'totalScore', 'total_score', 0),
  }
}

export function normalizeTeacherStatistics(raw: unknown): TeacherStatistics {
  const source = (raw ?? {}) as AnyRecord

  return {
    teacherName: pick<string>(source, 'teacherName', 'teacher_name', ''),
    contestCount: pick<number>(source, 'contestCount', 'contest_count', 0),
    reviewCount: pick<number>(source, 'reviewCount', 'review_count', 0),
    awardCount: pick<number>(source, 'awardCount', 'award_count', 0),
    averageScore: pick<number>(source, 'averageScore', 'average_score', 0),
    totalScore: pick<number>(source, 'totalScore', 'total_score', 0),
  }
}

export function normalizeOverallStatistics(raw: unknown): OverallStatistics {
  const source = (raw ?? {}) as AnyRecord

  return {
    totalContests: pick<number>(source, 'totalContests', 'total_contests', 0),
    ongoingContests: pick<number>(source, 'ongoingContests', 'ongoing_contests', 0),
    finishedContests: pick<number>(source, 'finishedContests', 'finished_contests', 0),
    totalUsers: pick<number>(source, 'totalUsers', 'total_users', 0),
    totalSignups: pick<number>(source, 'totalSignups', 'total_signups', 0),
    totalReviews: pick<number>(source, 'totalReviews', 'total_reviews', 0),
    totalAwards: pick<number>(source, 'totalAwards', 'total_awards', 0),
    averageScore: pick<number>(source, 'averageScore', 'average_score', 0),
  }
}

export function toContestServer(payload: ContestPayload | ContestUpdatePayload) {
  const maybeId = 'id' in payload ? { ID: payload.id } : {}
  return { ...maybeId, Title: payload.title, Time: payload.time, Status: payload.status }
}

export function toSignupServer(payload: SignupPayload | SignupUpdatePayload) {
  const maybeId = 'id' in payload ? { id: payload.id } : {}
  return {
    ...maybeId,
    contest_title: payload.contestTitle,
    teacher_name: payload.teacherName,
    unit: payload.unit,
    phone: payload.phone,
    course_name: payload.courseName,
    grade: payload.grade,
    desc: payload.desc,
    time: payload.time,
  }
}

export function toReviewServer(payload: ReviewPayload | ReviewUpdatePayload) {
  const maybeId = 'id' in payload ? { id: payload.id } : {}
  return {
    ...maybeId,
    ContestTitle: payload.contestTitle,
    TeacherName: payload.teacherName,
    CourseName: payload.courseName,
    Score: payload.score,
    Comment: payload.comment,
  }
}

export function toAwardServer(payload: AwardPayload | AwardUpdatePayload) {
  const maybeId = 'id' in payload ? { id: payload.id } : {}
  return { ...maybeId, Teacher: payload.teacher, Title: payload.title, Award: payload.award }
}

export function toUserServer(payload: UserUpdatePayload) {
  return {
    id: payload.id,
    username: payload.username,
    password: payload.password,
    role: payload.role,
    name: payload.name,
  }
}

export function toPasswordServer(payload: PasswordPayload) {
  return {
    id: payload.id,
    old_pwd: payload.oldPwd,
    new_pwd: payload.newPwd,
  }
}
