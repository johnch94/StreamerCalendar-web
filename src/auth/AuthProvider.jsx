import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'
import { UNAUTHORIZED_EVENT } from '../api/client'
import { AuthContext } from './authContext'

const GUEST = { status: 'guest', username: null }

function toState(response) {
  return response?.authenticated ? { status: 'admin', username: response.username } : GUEST
}

// 관리자 로그인 상태를 앱 전체에 제공한다. 실제 권한 체크는 백엔드가 하고, 여기서는 화면 노출만 결정한다
function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', username: null })

  useEffect(() => {
    let ignore = false

    // 서버에 연결할 수 없으면 일반 사용자로 취급 (조회 화면은 그대로 쓸 수 있게)
    authApi
      .getAuthStatus()
      .then((response) => {
        if (!ignore) setState(toState(response))
      })
      .catch(() => {
        if (!ignore) setState(GUEST)
      })

    const handleUnauthorized = () => setState(GUEST)
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)

    return () => {
      ignore = true
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    }
  }, [])

  const login = useCallback(async (username, password, rememberMe) => {
    const response = await authApi.login(username, password, rememberMe)
    setState(toState(response))
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setState(GUEST)
    }
  }, [])

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
