# calendar

캘린더 뷰 관련 컴포넌트가 위치하는 폴더입니다.

- `MonthCalendar` — 월별 캘린더 그리드 (날짜 계산은 `utils/date.js` 사용)
- `CalendarHeader` — 월 이동/표시 헤더
- `CalendarCell` — 날짜 셀, 방송 기록 여부를 점(dot)으로 표시

## TODO
- `api/streams`의 `getStreams({ year, month })`로 실제 방송 기록 데이터 연동
- 날짜 클릭 시 다시보기 + 유튜브 링크 상세 패널/모달
- 스트리머별 / 플랫폼별 필터
