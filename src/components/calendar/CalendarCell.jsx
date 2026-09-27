import StreamerAvatar from '../common/StreamerAvatar'

const MAX_VISIBLE_RECORDS = 3

function CalendarCell({ date, isToday, isSelected, streams, streamerById, onClick }) {
  const classNames = ['calendar-cell', isToday && 'calendar-cell--today', isSelected && 'calendar-cell--selected']
    .filter(Boolean)
    .join(' ')

  const visible = streams.slice(0, MAX_VISIBLE_RECORDS)
  const hiddenCount = streams.length - visible.length
  const label = `${date.getMonth() + 1}월 ${date.getDate()}일${streams.length ? `, 방송 기록 ${streams.length}건` : ''}`

  return (
    <button type="button" className={classNames} onClick={onClick} aria-pressed={isSelected} aria-label={label}>
      <span className="calendar-cell__date">{date.getDate()}</span>
      {visible.length > 0 && (
        <span className="calendar-cell__records" aria-hidden="true">
          {visible.map((stream) => (
            <span key={stream.id} className="calendar-cell__record">
              <StreamerAvatar
                size={13}
                streamer={streamerById[stream.streamerId] ?? { id: stream.streamerId, name: stream.streamerName }}
              />
              <span className="calendar-cell__title">{stream.title}</span>
            </span>
          ))}
          {hiddenCount > 0 && <span className="calendar-cell__more">+{hiddenCount}개 더</span>}
        </span>
      )}
    </button>
  )
}

export default CalendarCell
