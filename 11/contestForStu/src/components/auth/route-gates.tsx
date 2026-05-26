import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { UserRole } from '@/api'
import { getDashboardPath } from '@/auth/session'
import { useSession } from '@/auth/use-session'

interface RoleGateProps {
  allow: UserRole
  children: ReactNode
}

export function HomeGate({ children }: { children: ReactNode }) {
  const user = useSession()

  if (user) {
    return <Navigate to={getDashboardPath(user)} replace />
  }

  return children
}

export function LoginGate({ children }: { children: ReactNode }) {
  const user = useSession()

  if (user) {
    return <Navigate to={getDashboardPath(user)} replace />
  }

  return children
}

export function RoleGate({ allow, children }: RoleGateProps) {
  const user = useSession()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== allow) {
    return <Navigate to={getDashboardPath(user)} replace />
  }

  return children
}

export function DashboardRedirect() {
  const user = useSession()

  return <Navigate to={user ? getDashboardPath(user) : '/login'} replace />
}
