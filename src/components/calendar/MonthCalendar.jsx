import { useMemo } from 'react'
import { getMonthMatrix, formatDate, isSameDay, isSameMonth } from '../../utils/date'
import CalendarHeader from './CalendarHeader'
import CalendarCell from './CalendarCell'
import './MonthCalendar.css'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function MonthCalendar({
  year,
  month,
  streamsByDate = {},
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) {
  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month])
  const today = new Date()

  return (
    <div className="month-calendar">
      <CalendarHeader year={year} month={month} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />

      <div className="month-calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="month-calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="month-calendar__grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="month-calendar__week">
            {week.map((date) => {
              const dateKey = formatDate(date)
              return (
                <CalendarCell
                  key={dateKey}
                  date={date}
                  isCurrentMonth={isSameMonth(date, year, month)}
                  isToday={isSameDay(date, today)}
                  isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
                  streams={streamsByDate[dateKey] ?? []}
                  onClick={() => onSelectDate?.(date)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthCalendar
