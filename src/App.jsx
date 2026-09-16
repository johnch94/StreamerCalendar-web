import { useState } from 'react'
import CalendarPage from './pages/CalendarPage'
import StreamerPage from './pages/StreamerPage'
import './App.css'

const VIEWS = {
  calendar: '캘린더',
  streamers: '스트리머 관리',
}

function App() {
  const [view, setView] = useState('calendar')

  return (
    <>
      <nav className="app-nav">
        {Object.entries(VIEWS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`app-nav__item${view === key ? ' app-nav__item--active' : ''}`}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {view === 'calendar' ? <CalendarPage /> : <StreamerPage />}
    </>
  )
}

export default App
