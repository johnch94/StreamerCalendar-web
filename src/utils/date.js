// 달력 렌더링에 필요한 날짜 계산 유틸

// 해당 연/월(month: 1~12)의 달력 그리드용 날짜 배열을 반환
// 1일이 속한 주의 일요일부터, 말일이 속한 주의 토요일까지 7일 단위 주(week) 배열의 배열로 채움
export function getMonthMatrix(year, month) {
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)

  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const endDate = new Date(lastDayOfMonth)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const weeks = []
  const cursor = new Date(startDate)

  while (cursor <= endDate) {
    const week = []
    for (let i = 0; i < 7; i += 1) {
      week.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
}

// Date -> 'YYYY-MM-DD' 문자열 변환 (백엔드 broadcastDate 포맷과 동일)
export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 두 날짜가 같은 날인지 비교 (시/분/초 무시)
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// date가 year/month(1~12)에 속하는지 (그리드에서 이전/다음 달 날짜 구분용)
export function isSameMonth(date, year, month) {
  return date.getFullYear() === year && date.getMonth() === month - 1
}
