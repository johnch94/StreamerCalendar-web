import { useEffect, useState } from 'react'
import { getStreamers, createStreamer, deleteStreamer } from '../api/streamers'
import StreamerForm from '../components/streamer/StreamerForm'
import StreamerList from '../components/streamer/StreamerList'

function StreamerPage() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function loadStreamers() {
    setIsLoading(true)
    setError(null)
    return getStreamers()
      .then((data) => setStreamers(data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadStreamers()
  }, [])

  async function handleCreate(form) {
    setIsSubmitting(true)
    setError(null)
    try {
      await createStreamer(form)
      await loadStreamers()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id) {
    // 연관 STREAM_RECORD cascade 정책이 아직 미정이라, 있는 경우 삭제가 실패할 수 있음
    if (!window.confirm('이 스트리머를 삭제할까요?')) return

    setError(null)
    try {
      await deleteStreamer(id)
      await loadStreamers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="streamer-page">
      <h1>스트리머 관리</h1>

      {error && <p className="calendar-page__error">{error}</p>}

      <StreamerForm onSubmit={handleCreate} isSubmitting={isSubmitting} />

      {isLoading ? (
        <p className="calendar-page__loading">불러오는 중...</p>
      ) : (
        <StreamerList streamers={streamers} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default StreamerPage
