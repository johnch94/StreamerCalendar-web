# 프론트엔드 작업 진척도 (StreamerCalendar-web)

> 점검일: 2026-09-28 · 기준: `34965e4` + 미커밋 변경(배포 설정) · 스펙 기준: 루트 `CLAUDE.md` (MVP 기능 / UI 디자인) · 디자인 기준: `streamercalendar-html/` 퍼블리싱 시안 6종

## 요약

| 항목 | 상태 |
| --- | --- |
| 화면 (랜딩 / 캘린더 / 스트리머 관리 / 스트리머별 기록 / 기록 입력 모달 / 로그인) | ✅ 시안 6종 반영 |
| 사용자 / 관리자 접근 분리 | ✅ 사용자는 조회 전용, 관리 화면은 `/admin` 하위 + 로그인 필요 |
| API 연동 (streamers / streams / auth) | ✅ 백엔드 API 전부 래핑 |
| 빌드 / 린트 | ✅ `npm run build` 성공 · `npm run lint` 에러 0건 |
| 테스트 | ⬜ 없음 |
| README | ⬜ Vite 기본 템플릿 그대로 |

**진척도(체감): MVP 기준 약 90%.** 기능과 화면은 모두 동작합니다. 테스트, README, 브라우저 수동 점검이 남아 있습니다.

> ⚠️ 배포 설정(`vercel.json`, Vite proxy)은 아직 커밋하지 않았습니다.

## 기술 스택 (실제)

- **React 19 + Vite 8** (JavaScript, TypeScript 아님)
- **react-router 8**
- 캘린더는 라이브러리 없이 직접 구현했습니다 (`utils/date.js`의 `getMonthMatrix`).
- API Base URL: 기본 `/api` (운영: Vercel rewrites, 개발: Vite proxy). `VITE_API_BASE_URL`로 바꿀 수 있습니다. 모든 요청에 `credentials: 'include'`를 붙입니다.
- 폰트는 Google Fonts(Jua, Gowun Dodum)를 `index.html`에서 불러옵니다.

## 접근 구조 (라우트)

| 대상 | 경로 | 화면 |
| --- | --- | --- |
| 사용자 | `/` | 랜딩. 상단에 "로그인" 링크 (관리자로 로그인한 상태면 "관리자 페이지") |
| 사용자 | `/calendar` | 캘린더 (조회 전용) |
| 관리자 | `/admin/login` | 로그인 |
| 관리자 (로그인 필요) | `/admin/streamers` | 스트리머 관리 |
| 관리자 (로그인 필요) | `/admin/streamers/:streamerId` | 스트리머별 방송 기록 관리 |

- 그 밖의 경로는 `/`로 보냅니다. `/admin`은 `/admin/streamers`로 보냅니다.
- `/admin` 하위는 `RequireAdmin`이 로그인 여부를 확인하고, 로그인하지 않았으면 로그인 페이지로 보낸 뒤 로그인하면 원래 주소로 돌려보냅니다.
- 캘린더는 관리자로 로그인했을 때만 "스트리머 관리", "방송 기록 추가", "로그아웃" 버튼과 빈 날짜의 "기록 추가하기" 버튼이 보입니다.
- 로그인 상태는 앱을 열 때 `GET /api/auth/me`로 확인합니다. 관리 중에 세션이 만료돼 401(`UNAUTHORIZED`)을 받으면 로그아웃 상태로 바뀝니다.
- 버튼 숨김은 편의용이고, 실제 권한 체크는 백엔드가 합니다.

## 디렉터리 구조
```
src/
├── api/          client.js(fetch 래퍼, 에러 파싱, credentials 포함, 세션 만료 401 이벤트), auth.js, streamers.js, streams.js
├── auth/         AuthProvider(로그인 상태 제공), authContext, RequireAdmin(/admin 라우트 가드), LogoutButton
├── components/
│   ├── calendar/ MonthCalendar(요일+그리드), CalendarHeader(월 이동), CalendarCell(아바타+제목, 최대 3건 + "+N개 더")
│   ├── stream/   StreamRecordModal(추가/수정/삭제 API 호출 + 모달), StreamRecordForm(폼, 수정 모드 지원), StreamDetailPanel(우측 상세), stream.css
│   ├── streamer/ StreamerForm, StreamerList(카드)
│   └── common/   Icon, Logo, Modal, PlatformBadge, StreamerAvatar, common.css
├── constants/    platform.js (PLATFORM / SOURCE enum + 라벨·컬러), links.js (GitHub URL)
├── hooks/        useStreams, useStreamers (데이터 페칭 + 경쟁 상태 방지 + reload), useAuth
├── pages/        LandingPage, CalendarPage, AdminLoginPage, StreamerPage, StreamerRecordsPage (+ 페이지별 CSS)
└── utils/        date.js (월 그리드, YYYY-MM-DD 포맷/파싱, 날짜 비교), streamer.js (id 기반 색상, 이니셜, 플랫폼 정렬)
```

## 시안과 다르게 구현한 부분
- **스트리머 색상:** 백엔드에 색상 필드가 없어서 id를 기준으로 팔레트에서 고정 색을 배정합니다. 프로필 이미지가 있으면 이미지를 씁니다.
- **스트리머 카드 "수정" 버튼:** 백엔드에 `PUT /api/streamers/{id}`가 없어서 뺐습니다.
- **스트리머 관리 버튼:** 캘린더 시안에는 스트리머 관리로 가는 동선이 없어서 상단 바에 추가했습니다 (관리자에게만 보임).
- **플랫폼 선택지:** 입력 폼에 시안에 없던 트위치를 추가했습니다. API Enum에 있는 값입니다.
- **입력 폼의 유튜브 링크 필드:** 최신 `record-form.html` 시안에서는 빠졌지만 코드에는 남겨 두었습니다 (아래 "결정 필요" 참고). 라벨은 시안대로 "원본 링크"입니다.
- **스트리머별 기록 표:** 시안의 `MM.DD` 대신 `YYYY.MM.DD`로 표시하고 최신순으로 정렬합니다 (여러 해의 기록이 섞이면 월/일만으로 구분할 수 없음). 유튜브 링크가 있으면 재생 아이콘도 보여주고, 행 삭제는 확인창을 거칩니다.
- **스트리머 카드 통계:** 방송 기록 수와 활동 플랫폼은 `GET /api/streams`로 전체 기록을 불러와 클라이언트에서 계산합니다. MVP 규모에서는 문제없지만 데이터가 늘면 백엔드 집계 API가 필요합니다.
- **로그인 페이지 (`login.html`):**
  - Google 로그인, 회원가입, 비밀번호 찾기는 관리자 1명 구조라 뺐습니다.
  - 이메일 칸은 아이디로, 상단 문구는 "관리자만 로그인할 수 있어요"로 바꿨습니다.
  - 맨 아래 문구는 "관리자가 아니신가요? 캘린더 보러 가기"입니다.
  - "로그인 상태 유지"는 시안처럼 기본으로 체크돼 있고, 실제로 14일간 유지됩니다.
- **랜딩 "로그인" 링크:** 관리자로 로그인한 상태면 "관리자 페이지"로 바뀝니다. 모바일에서도 보입니다.

## 남은 문제

### 🟠 P1
1. **브라우저 수동 점검이 필요합니다.** 로그인 → 스트리머/기록 등록·수정·삭제 → 로그아웃 흐름은 API(curl)로만 확인했습니다. 로그인 페이지와 랜딩은 헤드리스 캡처로 시안과 비교했지만, 기록 추가/수정 모달과 기록이 있는 상태의 기록 표는 화면으로 확인하지 못했습니다.
2. **README가 Vite 기본 템플릿 그대로입니다.** 포트폴리오용으로 실행 방법, 화면 캡처, 구조 설명을 써야 합니다. 쓰지 않는 `src/assets/hero.png`도 남아 있습니다.
3. **캘린더 상세 패널에서는 수정할 수 없습니다.** 시안대로 수정·삭제는 스트리머별 기록 페이지에만 있습니다. 캘린더에서 바로 고치려면 관리자일 때 상세 항목에 수정 버튼을 붙이면 됩니다 (`StreamRecordModal`에 `record`만 넘기면 됨).

### 🟡 P2
4. 테스트가 없습니다. `utils/date.js`와 `utils/streamer.js`는 순수 함수라 Vitest 단위 테스트를 붙이기 쉽습니다. 훅, 폼, `RequireAdmin`은 React Testing Library로 테스트할 수 있습니다.
5. 선택한 날짜가 URL에 없습니다. `?date=YYYY-MM-DD`를 추가하면 "이 방송" 링크를 바로 공유할 수 있습니다.
6. 모달에 포커스 트랩이 없습니다 (Tab 키로 모달 밖 요소까지 이동할 수 있음).
7. 스트리머 단건 조회 API(`GET /api/streamers/{id}`)가 없어서, 기록 페이지는 스트리머 목록 전체를 불러와 id로 찾습니다.

## 배포 (Vercel)

- `vercel.json`: `/api/*`는 Render 백엔드(`https://streamercalendar-api.onrender.com`)로 프록시하고, 나머지 경로는 `index.html`로 보냅니다 (SPA 라우팅).
- API 주소 기본값을 `/api`로 바꿨습니다. 로컬 개발은 Vite proxy(`vite.config.js`)가 `localhost:8080`으로 넘겨서 운영과 같은 구조입니다. 환경변수는 필요 없습니다.
- 로컬에서 Vite proxy를 거친 조회·로그인(쿠키 발급)을 확인했습니다.
- [ ] Vercel에서 이 저장소 Import (백엔드 Render 배포가 먼저 필요, 순서는 백엔드 PROGRESS.md 참고)
- [ ] Render 서비스 주소가 다르면 `vercel.json`의 destination 수정

## 결정 필요
- [ ] **입력 폼에서 유튜브 링크 필드를 뺄지.** 후보 큐(Phase 2)가 없는 지금은 이 필드가 `youtubeUrl`을 넣는 유일한 경로입니다. 또 `PUT`은 전체 교체라서, 필드를 없애면 수정할 때 기존 유튜브 링크가 지워집니다.
- [ ] **플랫폼별 필터 추가 여부.** MVP 스펙에는 있지만 시안에는 스트리머 필터만 있습니다. API는 `platform` 파라미터를 이미 지원합니다.
- [ ] **스트리머 수정 기능.** 넣으려면 백엔드에 `PUT /api/streamers/{id}`가 먼저 필요합니다.
- [ ] **Next.js vs Vite 유지.** 현재는 Vite(SPA)입니다. 랜딩 페이지 SEO가 중요하지 않다면 Vite를 유지하는 편이 비용이 적습니다.
- [ ] TypeScript 전환 여부 (포트폴리오 어필 측면)

## Phase 2
- [ ] 유튜브 후보 큐 관리 화면 (`PENDING` 목록 → 방송 선택해서 `match` / `ignore`, `/admin` 하위)
- [ ] 플랫폼 채널 등록 UI
