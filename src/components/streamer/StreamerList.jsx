import { Link } from 'react-router'
import Icon from '../common/Icon'
import PlatformBadge from '../common/PlatformBadge'
import StreamerAvatar from '../common/StreamerAvatar'

const EMPTY_STATS = { recordCount: 0, platforms: [] }

// statsById: { [streamerId]: { recordCount, platforms } } — 방송 기록에서 집계한 값
function StreamerList({ streamers, statsById = {}, onDelete }) {
  if (streamers.length === 0) {
    return (
      <div className="streamer-list__empty">
        <Icon name="user" size={40} strokeWidth={1.6} color="#D8CFF5" />
        <p className="sc-muted">아직 등록된 스트리머가 없어요. 즐겨보는 스트리머를 등록해보세요!</p>
      </div>
    )
  }

  return (
    <ul className="streamer-list">
      {streamers.map((streamer) => {
        const stats = statsById[streamer.id] ?? EMPTY_STATS
        return (
          <li key={streamer.id} className="streamer-card">
            <Link to={`/admin/streamers/${streamer.id}`} className="streamer-card__profile">
              <StreamerAvatar streamer={streamer} size={52} className="jua" />
              <div className="streamer-card__info">
                <h3 className="streamer-card__name">{streamer.name}</h3>
                <p className="streamer-card__count">{stats.recordCount}개 방송 기록 · 클릭해서 보기</p>
              </div>
            </Link>

            <div className="streamer-card__platforms">
              {stats.platforms.length > 0 ? (
                stats.platforms.map((platform) => <PlatformBadge key={platform} platform={platform} size="sm" />)
              ) : (
                <span className="streamer-card__no-platform">아직 방송 기록이 없어요</span>
              )}
            </div>

            <div className="streamer-card__actions">
              <button type="button" className="btn streamer-card__delete" onClick={() => onDelete(streamer)}>
                <Icon name="trash" size={14} />
                삭제
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default StreamerList
