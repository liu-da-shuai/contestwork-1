import type { User } from '@/api'

const USER_KEY = 'contest_user'
export const SESSION_CHANGE_EVENT = 'contest-session-change'

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

export function saveCurrentUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  notifySessionChange()
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY)
  notifySessionChange()
}

export function getDashboardPath(user: User | null) {
  switch (user?.role) {
    case 'admin':
      return '/admin/dashboard'
    case 'teacher':
      return '/teacher/dashboard'
    case 'reviewer':
      return '/reviewer/dashboard'
    default:
      return '/'
  }
}
