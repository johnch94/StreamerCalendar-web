import { useContext } from 'react'
import { AuthContext } from '../auth/authContext'

// { status, username, isAdmin, login, logout }
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있어요.')
  return { ...context, isAdmin: context.status === 'admin' }
}
