import { request } from '@/api/http'
import {
  normalizeContestStatistics,
  normalizeOverallStatistics,
  normalizeTeacherStatistics,
} from '@/api/normalizers'
import type { ContestStatistics, OverallStatistics, TeacherStatistics } from '@/api/types'
import { USE_MOCKS } from '@/config/env'
import { API_ENDPOINTS } from '../contracts'
import { demoAwards, demoContests, demoReviews, demoSignups, demoUsers, mockDelay } from '../mock-data'

function averageScore(scores: number[]) {
  if (scores.length === 0) {
    return 0
  }

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}

export const statisticsApi = {
  async contest(contestTitle: string) {
    if (USE_MOCKS) {
      const reviews = demoReviews.filter((item) => item.contestTitle === contestTitle)
      const scores = reviews.map((item) => item.score)

      return mockDelay({
        contestTitle,
        signupCount: demoSignups.filter((item) => item.contestTitle === contestTitle).length,
        reviewCount: reviews.length,
        awardCount: demoAwards.filter((item) => item.title === contestTitle).length,
        averageScore: averageScore(scores),
        totalScore: scores.reduce((sum, score) => sum + score, 0),
      })
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.statisticsContest,
      params: { contest_title: contestTitle },
    })

    return normalizeContestStatistics(data)
  },

  async teacher(teacherName: string) {
    if (USE_MOCKS) {
      const reviews = demoReviews.filter((item) => item.teacherName === teacherName)
      const scores = reviews.map((item) => item.score)

      return mockDelay({
        teacherName,
        contestCount: demoSignups.filter((item) => item.teacherName === teacherName).length,
        reviewCount: reviews.length,
        awardCount: demoAwards.filter((item) => item.teacher === teacherName).length,
        averageScore: averageScore(scores),
        totalScore: scores.reduce((sum, score) => sum + score, 0),
      })
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.statisticsTeacher,
      params: { teacher_name: teacherName },
    })

    return normalizeTeacherStatistics(data)
  },

  async overall() {
    if (USE_MOCKS) {
      return mockDelay({
        totalContests: demoContests.length,
        ongoingContests: demoContests.filter((item) => item.status === '进行中').length,
        finishedContests: demoContests.filter((item) => item.status === '已结束').length,
        totalUsers: demoUsers.length,
        totalSignups: demoSignups.length,
        totalReviews: demoReviews.length,
        totalAwards: demoAwards.length,
        averageScore: averageScore(demoReviews.map((item) => item.score)),
      })
    }

    const data = await request<unknown>({
      method: 'GET',
      url: API_ENDPOINTS.statisticsOverall,
    })

    return normalizeOverallStatistics(data)
  },
} satisfies {
  contest: (contestTitle: string) => Promise<ContestStatistics>
  teacher: (teacherName: string) => Promise<TeacherStatistics>
  overall: () => Promise<OverallStatistics>
}
