// 달력 렌더링에 필요한 날짜 계산 유틸
// (components/calendar 의 MonthCalendar 구현 시 채워 넣을 예정)

export function getMonthMatrix(year, month) {
  // month: 1~12
  // TODO: 해당 월 1일이 속한 주의 일요일부터, 말일이 속한 주의 토요일까지
  //       7일 단위 주(week) 배열의 배열로 반환
}

export function formatDate(date) {
  // TODO: Date -> 'YYYY-MM-DD' 문자열 변환
}

export function isSameDay(a, b) {
  // TODO: 두 날짜가 같은 날인지 비교
}
