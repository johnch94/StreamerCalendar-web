import { Navigate, Route, Routes } from 'react-router'
import RequireAdmin from './auth/RequireAdmin'
import AdminLoginPage from './pages/AdminLoginPage'
import LandingPage from './pages/LandingPage'
import CalendarPage from './pages/CalendarPage'
import StreamerPage from './pages/StreamerPage'
import StreamerRecordsPage from './pages/StreamerRecordsPage'

// 사용자: 랜딩, 캘린더(조회 전용) / 관리자: /admin 하위 (로그인 필요)
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/calendar" element={<CalendarPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<RequireAdmin />}>
        <Route index element={<Navigate to="/admin/streamers" replace />} />
        <Route path="streamers" element={<StreamerPage />} />
        <Route path="streamers/:streamerId" element={<StreamerRecordsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
