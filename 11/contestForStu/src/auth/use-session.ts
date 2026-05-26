import { useEffect, useState } from 'react'
import { getCurrentUser, SESSION_CHANGE_EVENT } from './session'

export function useSession() {
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser())

    window.addEventListener(SESSION_CHANGE_EVENT, syncUser)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, syncUser)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  return user
}
