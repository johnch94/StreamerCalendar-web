import { SOURCE_LABEL } from '../../constants/platform'
import Icon from '../common/Icon'
import PlatformBadge from '../common/PlatformBadge'

// 캘린더 우측 상세 패널: 선택한 날짜의 방송 기록과 다시보기 / 유튜브 링크
function StreamDetailPanel({ date, streams, isLoading, onAddRecord }) {
  if (!date) {
    return (
      <div className="detail-panel__empty">
        <Icon name="calendar" size={40} strokeWidth={1.6} color="#D8CFF5" />
        <p className="sc-muted">날짜를 선택하면 방송 기록을 볼 수 있어요</p>
      </div>
    )
  }

  return (
    <>
      <h2 className="detail-panel__title">
        {date.getMonth() + 1}월 {date.getDate()}일
      </h2>

      {isLoading ? (
        <p className="sc-muted">불러오는 중...</p>
      ) : streams.length === 0 ? (
        <div className="detail-panel__empty">
          <Icon name="calendar" size={40} strokeWidth={1.6} color="#D8CFF5" />
          <p className="sc-muted">이 날짜엔 등록된 방송 기록이 없어요</p>
          {onAddRecord && (
            <button type="button" className="btn btn--primary detail-panel__add" onClick={onAddRecord}>
              기록 추가하기
            </button>
          )}
        </div>
      ) : (
        <ul className="detail-panel__list">
          {streams.map((stream) => (
            <li key={stream.id} className="detail-panel__item">
              <PlatformBadge platform={stream.platform} />
              <p className="detail-panel__stream-title">{stream.title}</p>
              <p className="detail-panel__meta">
                {stream.streamerName} · {SOURCE_LABEL[stream.source] ?? stream.source}
              </p>
              <div className="detail-panel__links">
                {stream.vodUrl ? (
                  <a className="link-row" href={stream.vodUrl} target="_blank" rel="noreferrer">
                    <Icon name="link" color="var(--accent)" />
                    원본 다시보기
                  </a>
                ) : (
                  <span className="link-row link-row--disabled">
                    <Icon name="link" />
                    다시보기 링크 없음
                  </span>
                )}
                {stream.youtubeUrl ? (
                  <a className="link-row" href={stream.youtubeUrl} target="_blank" rel="noreferrer">
                    <Icon name="play" color="#FF3B30" />
                    유튜브 영상 보기
                  </a>
                ) : (
                  <span className="link-row link-row--disabled">
                    <Icon name="play" />
                    연결된 유튜브 영상 없음
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default StreamDetailPanel
