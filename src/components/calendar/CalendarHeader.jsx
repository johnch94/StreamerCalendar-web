function CalendarHeader({ year, month, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      <button type="button" onClick={onPrevMonth} aria-label="이전 달">
        ‹
      </button>
      <h2>
        {year}년 {month}월
      </h2>
      <button type="button" onClick={onNextMonth} aria-label="다음 달">
        ›
      </button>
    </div>
  )
}

export default CalendarHeader
