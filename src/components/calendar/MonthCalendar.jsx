import { useMemo } from 'react'
import { getMonthMatrix, formatDate, isSameDay, isSameMonth } from '../../utils/date'
import CalendarCell from './CalendarCell'
import './MonthCalendar.css'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 월 이동 헤더(CalendarHeader)는 페이지 상단 서브 바에 따로 배치하고, 여기서는 요일 + 날짜 그리드만 그린다
function MonthCalendar({ year, month, streamsByDate = {}, streamerById = {}, selectedDate, onSelectDate }) {
  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month])
  const today = new Date()

  return (
    <div className="month-calendar">
      <div className="month-calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`month-calendar__weekday${i === 0 || i === 6 ? ' month-calendar__weekday--weekend' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="month-calendar__grid" style={{ gridTemplateRows: `repeat(${weeks.length}, minmax(90px, 1fr))` }}>
        {weeks.flat().map((date) => {
          const dateKey = formatDate(date)
          // 이전/다음 달 날짜는 시안처럼 빈 칸으로 둔다
          if (!isSameMonth(date, year, month)) {
            return <div key={dateKey} aria-hidden="true" />
          }
          return (
            <CalendarCell
              key={dateKey}
              date={date}
              isToday={isSameDay(date, today)}
              isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
              streams={streamsByDate[dateKey] ?? []}
              streamerById={streamerById}
              onClick={() => onSelectDate?.(date)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MonthCalendar
