import { useEffect, useMemo, useState } from 'react'
import MonthCalendar from '../components/calendar/MonthCalendar'
import StreamRecordForm from '../components/stream/StreamRecordForm'
import { getStreams, createStream } from '../api/streams'
import { getStreamers } from '../api/streamers'
import { formatDate } from '../utils/date'

function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1) // 1~12
  const [selectedDate, setSelectedDate] = useState(null)
  const [streams, setStreams] = useState([])
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  function loadStreams() {
    setIsLoading(true)
    setError(null)

    return getStreams({ year, month })
      .then((data) => setStreams(data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadStreams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month])

  useEffect(() => {
    // 방송 기록 등록 폼의 스트리머 선택지용. 실패해도 캘린더 자체는 그대로 써야 하니 에러는 조용히 무시
    getStreamers()
      .then((data) => setStreamers(data ?? []))
      .catch(() => {})
  }, [])

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

  function handleSelectDate(date) {
    setSelectedDate(date)
    setShowForm(false)
  }

  function handlePrevMonth() {
    if (month === 1) {
      setYear((y) => y - 1)
      setMonth(12)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function handleNextMonth() {
    if (month === 12) {
      setYear((y) => y + 1)
      setMonth(1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  async function handleCreateStream(form) {
    setIsSubmitting(true)
    setError(null)
    try {
      await createStream({ ...form, broadcastDate: formatDate(selectedDate) })
      await loadStreams()
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="calendar-page">
      <h1>StreamerCalendar</h1>

      {error && <p className="calendar-page__error">방송 기록 처리 중 문제가 발생했어요: {error}</p>}
      {isLoading && <p className="calendar-page__loading">불러오는 중...</p>}

      <MonthCalendar
        year={year}
        month={month}
        streamsByDate={streamsByDate}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {selectedDate && (
        <div className="calendar-page__detail">
          <div className="calendar-page__detail-header">
            <h2>{formatDate(selectedDate)}</h2>
            <button type="button" onClick={() => setShowForm((v) => !v)}>
              {showForm ? '취소' : '방송 기록 추가'}
            </button>
          </div>

          {showForm && (
            <StreamRecordForm streamers={streamers} onSubmit={handleCreateStream} isSubmitting={isSubmitting} />
          )}

          {selectedStreams.length === 0 ? (
            <p>이 날짜에는 등록된 방송 기록이 없어요.</p>
          ) : (
            <ul>
              {selectedStreams.map((stream) => (
                <li key={stream.id}>
                  <strong>{stream.title}</strong> ({stream.platform})
                  <div className="calendar-page__links">
                    {stream.vodUrl && (
                      <a href={stream.vodUrl} target="_blank" rel="noreferrer">
                        원본 다시보기
                      </a>
                    )}
                    {stream.youtubeUrl && (
                      <a href={stream.youtubeUrl} target="_blank" rel="noreferrer">
                        유튜브 영상
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default CalendarPage
