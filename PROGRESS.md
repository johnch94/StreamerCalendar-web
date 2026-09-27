# 프론트엔드 작업 진척도 (StreamerCalendar-web)

> 점검일: 2026-09-28 · 기준 커밋: `d8413db` (2026-09-28) · 스펙 기준: 루트 `CLAUDE.md` (MVP 기능 / UI 디자인) · 디자인 기준: `streamercalendar-html/` 퍼블리싱 시안 5종

## 요약

| 항목 | 상태 |
| --- | --- |
| API 연동 레이어 (streamers / streams) | ✅ 백엔드 MVP API 전부 래핑 |
| 캘린더 메인 (월 이동, 기록 표시, 날짜 상세) | ✅ 시안 반영 완료 |
| 스트리머 관리 (목록 / 등록 / 삭제) | ✅ 카드형 UI 반영 완료, 카드 클릭 시 스트리머별 기록 페이지로 이동 (수정은 백엔드 API 없음) |
| 스트리머별 방송 기록 (목록 / 수정 / 삭제) | ✅ 완료 (`/streamers/:streamerId`) |
| 방송 기록 입력 폼 | ✅ 모달형 추가 / 수정 / 삭제 완료 |
| 스트리머별 필터 | ✅ 완료 (API `streamerId` 파라미터 사용, URL 쿼리 유지) |
| 랜딩 페이지 | ✅ 완료 |
| 디자인 시스템 적용 (바이올렛·Jua·Gowun Dodum) | ✅ 디자인 토큰 + 공통 컴포넌트 적용 |
| 빌드 / 린트 | ✅ `npm run build` 성공 · `npm run lint` 에러 0건 |
| 테스트 | ⬜ 없음 |

**진척도(체감): MVP 기능 기준 약 90%, 디자인 포함 시 약 90%.** 시안 5종(스트리머별 기록 페이지 포함)과 방송 기록 추가·수정·삭제가 모두 동작합니다. 테스트와 README가 남아 있습니다.

## 기술 스택 (실제)

- **React 19 + Vite 8** (JavaScript, TypeScript 아님)
- **react-router 8**을 씁니다. 라우트는 `/`(랜딩), `/calendar`, `/streamers`, `/streamers/:streamerId`(스트리머별 기록)이고, 그 밖의 경로는 `/`로 리다이렉트합니다.
- 캘린더는 라이브러리 없이 직접 구현했습니다 (`utils/date.js`의 `getMonthMatrix`).
- API Base URL: `VITE_API_BASE_URL` (`.env.example` → `http://localhost:8080/api`)
- 폰트는 Google Fonts(Jua, Gowun Dodum)를 `index.html`에서 불러옵니다.

## 현재 구현 현황

### 디렉터리 구조
```
src/
├── api/          client.js(fetch 래퍼, 에러 message 파싱), streamers.js, streams.js
├── components/
│   ├── calendar/ MonthCalendar(요일+그리드), CalendarHeader(월 이동), CalendarCell(아바타+제목, 최대 3건 + "+N개 더")
│   ├── stream/   StreamRecordModal(추가/수정/삭제 API 호출 + 모달), StreamRecordForm(폼, 수정 모드 지원), StreamDetailPanel(우측 상세), stream.css
│   ├── streamer/ StreamerForm, StreamerList(카드)
│   └── common/   Icon, Logo, Modal, PlatformBadge, StreamerAvatar, common.css
├── constants/    platform.js (PLATFORM / SOURCE enum + PLATFORM_META 라벨·컬러, SOURCE_LABEL), links.js (GitHub URL)
├── hooks/        useStreams, useStreamers (데이터 페칭 + 경쟁 상태 방지 + reload)
├── pages/        LandingPage, CalendarPage, StreamerPage, StreamerRecordsPage (+ 페이지별 CSS)
└── utils/        date.js (월 그리드, YYYY-MM-DD 포맷/파싱, 날짜 비교), streamer.js (id 기반 색상, 이니셜, 플랫폼 정렬)
```

### 화면별 상태 (디자인 5종 기준)

| 화면 | 상태 | 구현된 것 | 빠진 것 |
| --- | --- | --- | --- |
| 1. 랜딩 페이지 | ✅ | 내비게이션, 히어로(캘린더 미리보기), 기능 소개 4종, 사용 방법 3단계, 지원 플랫폼, 기술 스택 푸터, 모바일 대응 | — |
| 2. 캘린더 메인 | ✅ | 상단 바(스트리머 필터 pill, 스트리머 관리 링크, 기록 추가), 월 이동 서브 바, 날짜 칸에 아바타+제목, 우측 상세 패널(플랫폼 뱃지·스트리머·출처·다시보기/유튜브 링크), 빈 상태, `?year=&month=&streamer=` URL 동기화, 900px 이하에서 상세 패널을 아래로 배치 | — |
| 3. 스트리머 관리 | ✅ | 카드 그리드(아바타, 방송 기록 수, 활동 플랫폼 뱃지, 프로필 클릭 시 기록 페이지로 이동), 펼침형 등록 폼, 삭제 시 cascade 경고("방송 기록 N건도 함께 삭제돼요") | 수정 (백엔드 API 없음) |
| 4. 방송 기록 입력 폼 | ✅ | 모달(ESC·바깥 클릭으로 닫기), 추가/수정 모드(제목·버튼 문구 전환), 수정 모드의 "이 기록 삭제", 스트리머 pill 선택, 날짜 입력(선택 날짜 기본값), 출처 표시(MANUAL), 플랫폼 pill 5종, 제목·링크 입력, 캘린더에서 저장하면 해당 날짜로 이동 | — |
| 5. 스트리머별 방송 기록 | ✅ | 프로필(아바타, 활동 플랫폼, 총 기록 수), 새 기록 추가(해당 스트리머 기본 선택), 기록 표(날짜·플랫폼·제목·출처·링크, 최신순), 행별 수정(모달)·삭제(확인창), 제목 클릭 시 해당 월 캘린더로 이동, 존재하지 않는 스트리머 안내, 모바일에서 카드형 행 | — |

### 시안과 다르게 구현한 부분
- **스트리머 색상:** 백엔드에 색상 필드가 없어서 id를 기준으로 팔레트에서 고정 색을 배정합니다. 프로필 이미지가 있으면 이미지를 씁니다.
- **스트리머 카드 "수정" 버튼:** 백엔드에 `PUT /api/streamers/{id}`가 없어서 뺐습니다.
- **스트리머 관리 버튼:** 캘린더 시안에는 스트리머 관리로 가는 동선이 없어서 상단 바에 추가했습니다.
- **플랫폼 선택지:** 입력 폼에 시안에 없던 트위치를 추가했습니다. API Enum에 있는 값입니다.
- **입력 폼의 유튜브 링크 필드 (결정 필요):** 최신 `record-form.html` 시안에서는 유튜브 링크 입력이 빠졌지만, 코드에는 남겨 두었습니다. 캘린더 상세에는 여전히 "유튜브 영상 보기"가 있고, 후보 큐(Phase 2)가 없는 지금은 이 필드가 `youtubeUrl`을 넣는 유일한 경로입니다. 또 `PUT`은 전체 교체라서, 필드를 없애면 수정할 때 기존 유튜브 링크가 지워집니다. 라벨은 시안대로 "원본 링크"로 바꿨습니다.
- **스트리머별 기록 표:** 시안의 `MM.DD` 대신 `YYYY.MM.DD`를 표시하고 최신순으로 정렬합니다 (여러 해의 기록이 섞이면 월/일만으로는 구분할 수 없음). 링크 칸에는 다시보기 "바로가기"와 함께, 유튜브 링크가 있으면 재생 아이콘도 보여줍니다. 행 삭제는 시안과 달리 확인창을 거칩니다.
- **스트리머 카드 통계:** 방송 기록 수와 활동 플랫폼은 `GET /api/streams`로 전체 기록을 불러와 클라이언트에서 계산합니다. MVP 규모(스트리머 1~5명)에서는 문제없지만, 데이터가 늘면 백엔드 집계 API가 필요합니다.

## 해결된 문제 (이전 점검 대비)

- ~~P0-1 ESLint 에러 2건~~ → `hooks/useStreams`, `useStreamers`로 분리했습니다. effect 안에서 setState를 동기로 호출하지 않습니다.
- ~~P0-2 등록 실패 시 입력값이 날아감~~ → 폼은 성공했을 때만 닫히고(언마운트되면서 초기화), 실패하면 입력값과 에러 메시지를 그대로 보여줍니다.
- ~~P1-3 월 이동 경쟁 상태~~ → 응답에 조회 조건(queryKey)을 함께 저장하고 effect cleanup에서 `ignore` 플래그를 세워, 늦게 도착한 응답을 버립니다.
- ~~P1-4 스트리머 삭제 확인 문구~~ → 백엔드 `CascadeType.ALL`에 맞춰 연관 기록 건수를 경고합니다.
- ~~P1-5 스트리머 목록 로딩 실패 무시~~ → 캘린더 상단에 에러를 표시합니다.
- ~~P1-6 `index.html` 템플릿~~ → `lang="ko"`, 타이틀과 description을 넣었습니다.
- ~~P1-7 템플릿 잔여물~~ → `react.svg`, `vite.svg`, `App.css`, `index.css`의 템플릿 변수를 정리했습니다. (README는 아직 남아 있음)
- ~~P2-8 라우팅 없음~~ → react-router를 도입했습니다.
- ~~P2-9 URL 미반영~~ → 년/월과 스트리머 필터를 쿼리에 반영합니다. 선택한 날짜는 아직 URL에 없습니다.
- ~~P2-10 상세에 스트리머 이름/source 없음~~ → 표시합니다.
- ~~P2-12 CalendarCell 접근성~~ → 버튼에 `aria-label`("9월 23일, 방송 기록 N건")과 `aria-pressed`를 달았습니다.
- ~~방송 기록 수정/삭제 UI 없음~~ → 스트리머별 기록 페이지(`/streamers/:streamerId`)에서 행별 수정·삭제를 할 수 있고, 수정 모달 안에서도 삭제할 수 있습니다. API 호출은 `StreamRecordModal`로 모아 캘린더와 기록 페이지가 함께 씁니다.

## 남은 문제

### 🟠 P1
1. **캘린더 상세 패널에서는 수정할 수 없습니다.** 시안대로 수정·삭제는 스트리머별 기록 페이지에만 있습니다. 캘린더에서 바로 고치고 싶다면 상세 항목에 수정 버튼을 붙이면 됩니다 (`StreamRecordModal`에 `record`만 넘기면 됨).
2. **README가 Vite 기본 템플릿 그대로입니다.** 포트폴리오용으로 실행 방법, 화면 캡처, 구조 설명을 써야 합니다. 쓰지 않는 `assets/hero.png`도 남아 있습니다.

### 🟡 P2
3. 테스트가 없습니다. `utils/date.js`와 `utils/streamer.js`는 순수 함수라 Vitest 단위 테스트를 붙이기 쉽습니다. 훅과 폼은 React Testing Library로 테스트할 수 있습니다.
4. 선택한 날짜가 URL에 없습니다. `?date=YYYY-MM-DD`를 추가하면 "이 방송" 링크를 바로 공유할 수 있습니다.
5. 방송 기록 추가/수정 모달과 기록이 있는 상태의 기록 표는 헤드리스 캡처로 확인하지 못했습니다 (확인하려면 DB에 데이터를 써야 해서). 실제 등록·수정·삭제 흐름을 브라우저에서 한 번 수동으로 점검해야 합니다.
6. 모달에 포커스 트랩이 없습니다 (Tab 키로 모달 밖 요소까지 이동할 수 있음).
7. 스트리머 단건 조회 API(`GET /api/streamers/{id}`)가 없어서, 기록 페이지는 스트리머 목록 전체를 불러와 id로 찾습니다.

## 남은 과제 (체크리스트)

### MVP 마무리
- [x] 린트 에러 해결 + 데이터 페칭 훅 분리
- [x] 폼 실패 시 입력값 유지
- [x] 스트리머별 필터 (`getStreams`에 `streamerId` 전달)
- [x] 방송 기록 수정 / 삭제 UI (스트리머별 기록 페이지)
- [x] 스트리머별 방송 기록 페이지
- [x] 입력 폼에 날짜 필드 추가 (선택 날짜를 기본값으로)
- [x] 월 이동 경쟁 상태 처리
- [x] 스트리머 삭제 경고 문구를 백엔드 cascade 정책과 맞추기
- [x] `index.html` 타이틀/lang, 템플릿 파일 정리
- [ ] README 작성
- [ ] 단위/컴포넌트 테스트 (Vitest + RTL)

### 디자인 적용 (`streamercalendar-html` 시안 기준)
- [x] 디자인 토큰 정의: 바이올렛 `#7C5CFC` 메인, 코랄/옐로/민트/블루 보조 컬러
- [x] 폰트: Jua(제목) + Gowun Dodum(본문)
- [x] 캘린더 메인: 필터 바 + 우측 상세 패널 레이아웃
- [x] 스트리머 관리: 카드 목록 + 등록 폼
- [x] 방송 기록 입력: 모달형
- [x] 플랫폼별 컬러 뱃지 (CHZZK / SOOP / YOUTUBE / TWITCH / OTHER)
- [x] `components/common`: Icon, Logo, Modal, PlatformBadge, StreamerAvatar (버튼·입력·알림은 `index.css`의 `.btn`, `.sc-input`, `.sc-alert` 유틸 클래스)
- [x] 랜딩 페이지 (포트폴리오용)
- [x] 라우터 도입 (`/`, `/calendar`, `/streamers`, `/streamers/:streamerId`)
- [x] 반응형 기본 대응 (1100 / 900 / 720px 브레이크포인트)

### 결정 필요
- [ ] **입력 폼에서 유튜브 링크 필드를 뺄지.** 최신 시안에서는 빠졌지만 현재는 유지 중입니다 (위 "시안과 다르게 구현한 부분" 참고). 빼려면 유튜브 연결을 후보 큐(Phase 2)로 넘기는 결정이 먼저 필요합니다.
- [ ] **플랫폼별 필터 추가 여부.** MVP 스펙에는 있지만 시안에는 스트리머 필터만 있습니다. API는 `platform` 파라미터를 이미 지원합니다.
- [ ] **스트리머 수정 기능.** 넣으려면 백엔드에 `PUT /api/streamers/{id}`가 먼저 필요합니다.
- [ ] **Next.js vs Vite 유지.** 현재는 Vite(SPA)입니다. 랜딩 페이지 SEO가 중요하지 않다면 Vite를 유지하고 `CLAUDE.md`를 수정하는 편이 비용이 적습니다.
- [ ] TypeScript 전환 여부 (포트폴리오 어필 측면)
- [ ] 배포 방식 (Vercel / Netlify / S3 등) 및 운영 API URL. SPA 라우팅을 쓰므로 호스팅에서 모든 경로를 `index.html`로 돌려주는 설정이 필요합니다.

### Phase 2
- [ ] 유튜브 후보 큐 관리 화면 (`PENDING` 목록 → 방송 선택해서 `match` / `ignore`)
- [ ] 플랫폼 채널 등록 UI
- [ ] 인증이 도입되면 로그인/관리자 게이트
