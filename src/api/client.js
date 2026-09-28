// 기본값 /api: 운영은 Vercel rewrites, 개발은 Vite proxy가 백엔드로 넘긴다 (같은 도메인이라 세션 쿠키·CORS 문제 없음)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 관리자 세션이 만료된 상태에서 쓰기 요청이 401을 받으면 AuthProvider가 이 이벤트를 듣고 로그아웃 상태로 바꾼다
export const UNAUTHORIZED_EVENT = 'sc:unauthorized'

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // 관리자 세션 쿠키(JSESSIONID)를 주고받기 위해 필요 (백엔드 CORS allowCredentials와 짝)
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const error = new Error(body?.message || `API 요청 실패: ${response.status}`)
    error.status = response.status
    error.code = body?.code
    // 로그인 실패(INVALID_CREDENTIALS)는 세션 만료가 아니므로 제외
    if (response.status === 401 && body?.code === 'UNAUTHORIZED') {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw error
  }

  if (response.status === 204) return null
  return response.json()
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
