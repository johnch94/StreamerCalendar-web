import { apiClient } from './client'

// 응답: { authenticated, username }
export function getAuthStatus() {
  return apiClient.get('/auth/me')
}

// rememberMe: "로그인 상태 유지" (true면 브라우저를 닫아도 14일간 로그인 유지)
export function login(username, password, rememberMe = false) {
  return apiClient.post('/auth/login', { username, password, rememberMe })
}

export function logout() {
  return apiClient.post('/auth/logout')
}
