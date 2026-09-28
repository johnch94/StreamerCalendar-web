import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

// 관리자 상단 바용 로그아웃 버튼. 로그아웃하면 사용자 화면(캘린더)으로 이동한다
function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  async function handleClick() {
    setIsPending(true)
    try {
      await logout()
    } catch {
      // 서버 세션 해제에 실패해도 화면은 로그아웃 상태로 전환된다 (AuthProvider의 finally)
    }
    navigate('/calendar')
  }

  return (
    <button type="button" className="btn btn--outline" onClick={handleClick} disabled={isPending}>
      {isPending ? '로그아웃 중...' : '로그아웃'}
    </button>
  )
}

export default LogoutButton
