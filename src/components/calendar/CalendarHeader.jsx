import Icon from '../common/Icon'

function CalendarHeader({ year, month, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      <button type="button" className="calendar-header__nav" onClick={onPrevMonth} aria-label="이전 달">
        <Icon name="chevronLeft" size={16} />
      </button>
      <h2 className="calendar-header__title" aria-live="polite">
        {year}년 {month}월
      </h2>
      <button type="button" className="calendar-header__nav" onClick={onNextMonth} aria-label="다음 달">
        <Icon name="chevronRight" size={16} />
      </button>
    </div>
  )
}

export default CalendarHeader
