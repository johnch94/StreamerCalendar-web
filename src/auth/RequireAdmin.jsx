import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

// /admin 하위 라우트 보호. 로그인하지 않았으면 로그인 페이지로 보내고, 로그인 후 원래 주소로 돌아오게 한다
function RequireAdmin() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <p className="sc-muted auth-checking">로그인 상태를 확인하는 중...</p>
  }

  if (status !== 'admin') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}

export default RequireAdmin
