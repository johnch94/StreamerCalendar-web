import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { createStreamer, deleteStreamer } from '../api/streamers'
import Icon from '../components/common/Icon'
import Logo from '../components/common/Logo'
import LogoutButton from '../auth/LogoutButton'
import StreamerForm from '../components/streamer/StreamerForm'
import StreamerList from '../components/streamer/StreamerList'
import { useStreamers } from '../hooks/useStreamers'
import { useStreams } from '../hooks/useStreams'
import { sortPlatforms } from '../utils/streamer'
import './StreamerPage.css'

function StreamerPage() {
  const { streamers, error: loadError, isLoading, hasLoaded, reload: reloadStreamers } = useStreamers()
  // 카드에 표시할 방송 기록 수 / 활동 플랫폼 집계용 (MVP 규모에서는 전체 조회로 충분)
  const { streams, reload: reloadStreams } = useStreams()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const statsById = useMemo(() => {
    const stats = {}
    streams.forEach((stream) => {
      const entry = (stats[stream.streamerId] ??= { recordCount: 0, platforms: new Set() })
      entry.recordCount += 1
      entry.platforms.add(stream.platform)
    })
    return Object.fromEntries(
      Object.entries(stats).map(([id, { recordCount, platforms }]) => [
        id,
        { recordCount, platforms: sortPlatforms(platforms) },
      ]),
    )
  }, [streams])

  function toggleForm() {
    setFormError(null)
    setIsFormOpen((open) => !open)
  }

  async function handleCreate(data) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      await createStreamer(data)
      reloadStreamers()
      setIsFormOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(streamer) {
    // 백엔드는 스트리머 삭제 시 연관 방송 기록을 함께 삭제(cascade)한다
    const recordCount = statsById[streamer.id]?.recordCount ?? 0
    const message =
      recordCount > 0
        ? `'${streamer.name}'을(를) 삭제할까요?\n방송 기록 ${recordCount}건도 함께 삭제돼요.`
        : `'${streamer.name}'을(를) 삭제할까요?`
    if (!window.confirm(message)) return

    setActionError(null)
    try {
      await deleteStreamer(streamer.id)
      reloadStreamers()
      reloadStreams()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const error = actionError ?? loadError

  return (
    <div className="streamer-page">
      <header className="top-bar">
        <Logo />
        <div className="top-bar__actions">
          <Link to="/calendar" className="top-bar__back">
            <Icon name="arrowLeft" size={16} />
            캘린더로 돌아가기
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="streamer-page__main">
        <div className="streamer-page__heading">
          <div className="streamer-page__heading-text">
            <h1 className="streamer-page__title">스트리머 관리</h1>
            <p className="sc-muted">즐겨보는 스트리머를 등록하고 관리해요</p>
          </div>
          <button type="button" className="btn btn--primary streamer-page__add" onClick={toggleForm} aria-expanded={isFormOpen}>
            <Icon name="plus" size={16} strokeWidth={2.4} />새 스트리머 등록
          </button>
        </div>

        {isFormOpen && (
          <StreamerForm onSubmit={handleCreate} onCancel={toggleForm} isSubmitting={isSubmitting} error={formError} />
        )}

        {error && (
          <p className="sc-alert" role="alert">
            {error}
          </p>
        )}

        {isLoading && !hasLoaded ? (
          <p className="sc-muted">불러오는 중...</p>
        ) : (
          <StreamerList streamers={streamers} statsById={statsById} onDelete={handleDelete} />
        )}
      </main>
    </div>
  )
}

export default StreamerPage
