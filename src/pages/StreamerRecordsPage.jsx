import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { deleteStream } from '../api/streams'
import Icon from '../components/common/Icon'
import Logo from '../components/common/Logo'
import PlatformBadge from '../components/common/PlatformBadge'
import StreamerAvatar from '../components/common/StreamerAvatar'
import StreamRecordModal from '../components/stream/StreamRecordModal'
import { SOURCE_LABEL } from '../constants/platform'
import { useStreamers } from '../hooks/useStreamers'
import { useStreams } from '../hooks/useStreams'
import { formatDate } from '../utils/date'
import { sortPlatforms } from '../utils/streamer'
import '../components/stream/stream.css'
import './StreamerPage.css'
import './StreamerRecordsPage.css'

// 최신 방송이 위로 오도록 정렬 (같은 날짜면 나중에 등록한 기록이 위)
function compareRecords(a, b) {
  if (a.broadcastDate !== b.broadcastDate) return a.broadcastDate < b.broadcastDate ? 1 : -1
  return b.id - a.id
}

function StreamerRecordsPage() {
  const { streamerId: streamerIdParam } = useParams()
  const streamerId = Number(streamerIdParam)

  const { streamers, error: streamersError, hasLoaded } = useStreamers()
  // 주소의 id가 숫자가 아니면 조회하지 않도록 필터값을 비워서 보낸다 (아래에서 "찾을 수 없음" 처리)
  const { streams, error: streamsError, isLoading, reload } = useStreams({
    streamerId: Number.isInteger(streamerId) ? streamerId : undefined,
  })

  // null: 닫힘, { record: null }: 추가, { record }: 수정
  const [modal, setModal] = useState(null)
  const [actionError, setActionError] = useState(null)

  const streamer = streamers.find((s) => s.id === streamerId)
  const records = useMemo(() => [...streams].sort(compareRecords), [streams])
  const platforms = useMemo(() => sortPlatforms(streams.map((s) => s.platform)), [streams])

  const closeModal = useCallback(() => setModal(null), [])

  function handleModalDone() {
    setModal(null)
    reload()
  }

  async function handleDelete(record) {
    if (!window.confirm(`'${record.title}' 기록을 삭제할까요?`)) return
    setActionError(null)
    try {
      await deleteStream(record.id)
      reload()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const error = actionError ?? streamsError ?? streamersError

  let content
  if (!hasLoaded) {
    content = <p className="sc-muted">불러오는 중...</p>
  } else if (!streamer) {
    content = (
      <div className="streamer-list__empty">
        <Icon name="user" size={40} strokeWidth={1.6} color="#D8CFF5" />
        <p className="sc-muted">스트리머를 찾을 수 없어요. 삭제되었거나 잘못된 주소예요.</p>
        <Link to="/streamers" className="btn btn--primary">
          스트리머 목록으로
        </Link>
      </div>
    )
  } else {
    content = (
      <>
        <div className="records-page__heading">
          <div className="records-page__profile">
            <StreamerAvatar streamer={streamer} size={64} className="jua" />
            <div className="records-page__profile-info">
              <h1 className="records-page__name">{streamer.name}</h1>
              {platforms.length > 0 && (
                <div className="records-page__platforms">
                  {platforms.map((platform) => (
                    <PlatformBadge key={platform} platform={platform} size="sm" />
                  ))}
                </div>
              )}
              <p className="records-page__count">총 {records.length}개 방송 기록</p>
            </div>
          </div>
          <button type="button" className="btn btn--primary records-page__add" onClick={() => setModal({ record: null })}>
            <Icon name="plus" size={16} strokeWidth={2.4} />새 기록 추가
          </button>
        </div>

        <div className="records-table" aria-busy={isLoading}>
          <div className="records-table__head" aria-hidden="true">
            <span className="records-table__date">날짜</span>
            <span className="records-table__platform">플랫폼</span>
            <span className="records-table__title">방송 제목</span>
            <span className="records-table__source">출처</span>
            <span className="records-table__links">링크</span>
            <span className="records-table__actions" />
          </div>

          {records.length === 0 ? (
            <p className="records-table__empty sc-muted">
              {isLoading ? '불러오는 중...' : '아직 등록된 방송 기록이 없어요.'}
            </p>
          ) : (
            <ul className="records-table__body">
              {records.map((record) => {
                const [year, month] = record.broadcastDate.split('-').map(Number)
                return (
                  <li key={record.id} className="records-table__row">
                    <span className="records-table__date">{record.broadcastDate.replaceAll('-', '.')}</span>
                    <span className="records-table__platform">
                      <PlatformBadge platform={record.platform} size="sm" />
                    </span>
                    <Link
                      to={`/calendar?year=${year}&month=${month}&streamer=${streamerId}`}
                      className="records-table__title"
                      title="캘린더에서 보기"
                    >
                      {record.title}
                    </Link>
                    <span className="records-table__source">{SOURCE_LABEL[record.source] ?? record.source}</span>
                    <span className="records-table__links">
                      {record.vodUrl && (
                        <a href={record.vodUrl} target="_blank" rel="noreferrer" className="records-table__link">
                          <Icon name="link" size={13} />
                          바로가기
                        </a>
                      )}
                      {record.youtubeUrl && (
                        <a
                          href={record.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="records-table__yt"
                          aria-label="유튜브 영상 보기"
                          title="유튜브 영상 보기"
                        >
                          <Icon name="play" size={15} color="#FF3B30" />
                        </a>
                      )}
                      {!record.vodUrl && !record.youtubeUrl && <span className="records-table__none">-</span>}
                    </span>
                    <span className="records-table__actions">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`${record.title} 수정`}
                        onClick={() => setModal({ record })}
                      >
                        <Icon name="edit" size={16} color="var(--ink-soft)" />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`${record.title} 삭제`}
                        onClick={() => handleDelete(record)}
                      >
                        <Icon name="trash" size={16} color="var(--danger)" />
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </>
    )
  }

  return (
    <div className="streamer-page">
      <header className="top-bar">
        <Logo />
        <Link to="/streamers" className="top-bar__back">
          <Icon name="arrowLeft" size={16} />
          스트리머 관리로 돌아가기
        </Link>
      </header>

      <main className="streamer-page__main">
        {error && (
          <p className="sc-alert" role="alert">
            {error}
          </p>
        )}
        {content}
      </main>

      {modal && (
        <StreamRecordModal
          streamers={streamers}
          record={modal.record}
          defaultDate={formatDate(new Date())}
          defaultStreamerId={streamerId}
          onClose={closeModal}
          onSaved={handleModalDone}
          onDeleted={handleModalDone}
        />
      )}
    </div>
  )
}

export default StreamerRecordsPage
