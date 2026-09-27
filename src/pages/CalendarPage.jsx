import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import CalendarHeader from '../components/calendar/CalendarHeader'
import MonthCalendar from '../components/calendar/MonthCalendar'
import Icon from '../components/common/Icon'
import Logo from '../components/common/Logo'
import StreamerAvatar from '../components/common/StreamerAvatar'
import StreamDetailPanel from '../components/stream/StreamDetailPanel'
import StreamRecordModal from '../components/stream/StreamRecordModal'
import { useStreamers } from '../hooks/useStreamers'
import { useStreams } from '../hooks/useStreams'
import { formatDate, isSameMonth, parseDate } from '../utils/date'
import '../components/stream/stream.css'
import './CalendarPage.css'

function parseIntParam(value, min, max) {
  const n = Number.parseInt(value, 10)
  return Number.isInteger(n) && n >= min && n <= max ? n : null
}

function CalendarPage() {
  const today = new Date()
  const [searchParams, setSearchParams] = useSearchParams()

  // 보고 있는 달과 스트리머 필터는 URL 쿼리(?year=&month=&streamer=)로 관리해서 새로고침/공유 시에도 유지
  const year = parseIntParam(searchParams.get('year'), 1970, 9999) ?? today.getFullYear()
  const month = parseIntParam(searchParams.get('month'), 1, 12) ?? today.getMonth() + 1
  const streamerFilter = parseIntParam(searchParams.get('streamer'), 1, Number.MAX_SAFE_INTEGER)

  const [selectedDate, setSelectedDate] = useState(() => (isSameMonth(today, year, month) ? today : null))
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { streamers, error: streamersError } = useStreamers()
  const {
    streams,
    error: streamsError,
    isLoading,
    reload: reloadStreams,
  } = useStreams({ year, month, streamerId: streamerFilter ?? undefined })

  const streamerById = useMemo(() => Object.fromEntries(streamers.map((s) => [s.id, s])), [streamers])

  // broadcastDate('YYYY-MM-DD') 기준으로 묶어서 MonthCalendar에 전달
  const streamsByDate = useMemo(() => {
    return streams.reduce((acc, stream) => {
      const key = stream.broadcastDate
      if (!acc[key]) acc[key] = []
      acc[key].push(stream)
      return acc
    }, {})
  }, [streams])

  const selectedStreams = selectedDate ? (streamsByDate[formatDate(selectedDate)] ?? []) : []

  function updateParams(updates) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) next.delete(key)
        else next.set(key, String(value))
      })
      return next
    })
  }

  function moveMonth(delta) {
    const target = new Date(year, month - 1 + delta, 1)
    updateParams({ year: target.getFullYear(), month: target.getMonth() + 1 })
    setSelectedDate(null)
  }

  const openForm = () => setIsFormOpen(true)
  const closeForm = useCallback(() => setIsFormOpen(false), [])

  function handleStreamSaved(saved) {
    // 저장한 방송 날짜로 캘린더를 이동해서 바로 확인할 수 있게 한다
    const savedDate = parseDate(saved.broadcastDate)
    if (isSameMonth(savedDate, year, month)) {
      reloadStreams()
    } else {
      updateParams({ year: savedDate.getFullYear(), month: savedDate.getMonth() + 1 })
    }
    setSelectedDate(savedDate)
    setIsFormOpen(false)
  }

  const defaultFormDate = formatDate(selectedDate ?? (isSameMonth(today, year, month) ? today : new Date(year, month - 1, 1)))

  return (
    <div className="calendar-page">
      <header className="top-bar">
        <Logo />

        <div className="calendar-page__filters" role="group" aria-label="스트리머 필터">
          <button
            type="button"
            className="streamer-pill"
            aria-pressed={streamerFilter === null}
            onClick={() => updateParams({ streamer: null })}
          >
            <span className="streamer-pill__all">All</span>
            전체
          </button>
          {streamers.map((streamer) => (
            <button
              key={streamer.id}
              type="button"
              className="streamer-pill"
              aria-pressed={streamerFilter === streamer.id}
              onClick={() => updateParams({ streamer: streamer.id })}
            >
              <StreamerAvatar streamer={streamer} size={24} />
              {streamer.name}
            </button>
          ))}
        </div>

        <div className="top-bar__actions">
          <Link to="/streamers" className="btn btn--outline">
            <Icon name="user" size={16} />
            스트리머 관리
          </Link>
          <button type="button" className="btn btn--primary" onClick={openForm}>
            <Icon name="plus" size={16} strokeWidth={2.4} />
            방송 기록 추가
          </button>
        </div>
      </header>

      <div className="calendar-page__subbar">
        <CalendarHeader year={year} month={month} onPrevMonth={() => moveMonth(-1)} onNextMonth={() => moveMonth(1)} />
      </div>

      {(streamsError || streamersError) && (
        <div className="calendar-page__alerts">
          {streamsError && (
            <p className="sc-alert" role="alert">
              방송 기록을 불러오지 못했어요: {streamsError}
            </p>
          )}
          {streamersError && (
            <p className="sc-alert" role="alert">
              스트리머 목록을 불러오지 못했어요: {streamersError}
            </p>
          )}
        </div>
      )}

      <main className="calendar-page__main">
        <section className="calendar-page__grid" aria-busy={isLoading}>
          <MonthCalendar
            year={year}
            month={month}
            streamsByDate={streamsByDate}
            streamerById={streamerById}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </section>

        <aside className="calendar-page__detail" aria-label="방송 상세">
          <StreamDetailPanel
            date={selectedDate}
            streams={selectedStreams}
            isLoading={isLoading}
            onAddRecord={openForm}
          />
        </aside>
      </main>

      {isFormOpen && (
        <StreamRecordModal
          streamers={streamers}
          defaultDate={defaultFormDate}
          defaultStreamerId={streamerFilter ?? undefined}
          onClose={closeForm}
          onSaved={handleStreamSaved}
        />
      )}
    </div>
  )
}

export default CalendarPage
