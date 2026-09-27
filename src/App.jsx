import { Navigate, Route, Routes } from 'react-router'
import LandingPage from './pages/LandingPage'
import CalendarPage from './pages/CalendarPage'
import StreamerPage from './pages/StreamerPage'
import StreamerRecordsPage from './pages/StreamerRecordsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/streamers" element={<StreamerPage />} />
      <Route path="/streamers/:streamerId" element={<StreamerRecordsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
