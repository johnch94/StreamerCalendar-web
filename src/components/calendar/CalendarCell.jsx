function CalendarCell({ date, isCurrentMonth, isToday, isSelected, streams, onClick }) {
  const classNames = [
    'calendar-cell',
    !isCurrentMonth && 'calendar-cell--outside',
    isToday && 'calendar-cell--today',
    isSelected && 'calendar-cell--selected',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classNames} onClick={onClick}>
      <span className="calendar-cell__date">{date.getDate()}</span>
      {streams.length > 0 && (
        <span className="calendar-cell__dot" aria-label={`방송 기록 ${streams.length}건`} />
      )}
    </button>
  )
}

export default CalendarCell
