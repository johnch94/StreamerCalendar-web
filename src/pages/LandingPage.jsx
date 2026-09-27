import { Link } from 'react-router'
import Icon from '../components/common/Icon'
import Logo from '../components/common/Logo'
import PlatformBadge from '../components/common/PlatformBadge'
import { GITHUB_URL } from '../constants/links'
import { getMonthMatrix, isSameMonth } from '../utils/date'
import './LandingPage.css'

// 히어로 영역의 캘린더 미리보기 (정적 예시 데이터)
const PREVIEW_YEAR = 2026
const PREVIEW_MONTH = 7
const PREVIEW_SELECTED_DAY = 15
const PREVIEW_DOTS = { 3: '#1EA7FF', 9: '#FF3B30', 22: '#00D68F', 28: '#1EA7FF' }

const FEATURES = [
  {
    icon: 'calendar',
    color: 'var(--accent)',
    bg: '#F1EBFF',
    title: '달력으로 한눈에',
    description: '월별 캘린더에서 방송이 있던 날짜를 바로 확인해요',
  },
  {
    icon: 'play',
    color: '#FF6F61',
    bg: '#FFE9E7',
    title: '유튜브 영상 역추적',
    description: '"이 영상 언제 방송이었지?" 날짜를 바로 찾을 수 있어요',
  },
  {
    icon: 'list',
    color: '#C99400',
    bg: '#FFF6D9',
    title: '플랫폼 한 곳에서',
    description: '치지직 · 숲 · 유튜브를 한 화면에서 확인해요',
  },
  {
    icon: 'user',
    color: '#00A870',
    bg: '#DFF9EE',
    title: '나만의 스트리머 등록',
    description: '즐겨보는 스트리머만 골라서 기록을 관리해요',
  },
]

const STEPS = [
  { color: 'var(--accent)', title: '스트리머 등록', description: '좋아하는 스트리머를 추가해요' },
  { color: '#FF6F61', title: '방송 기록 입력', description: '날짜·다시보기·유튜브 링크를 입력해요' },
  { color: '#00A870', title: '캘린더에서 확인', description: '달력에서 날짜별로 바로 찾아봐요' },
]

const PLATFORMS = [
  { code: 'CHZZK', label: '치지직 CHZZK' },
  { code: 'SOOP', label: '숲 SOOP' },
  { code: 'YOUTUBE', label: '유튜브 YouTube' },
]

function CalendarPreview() {
  const days = getMonthMatrix(PREVIEW_YEAR, PREVIEW_MONTH).flat()

  return (
    <div className="landing-preview" aria-hidden="true">
      <div className="landing-preview__card">
        <div className="landing-preview__header">
          <span className="jua">
            {PREVIEW_YEAR}년 {PREVIEW_MONTH}월
          </span>
          <div className="landing-preview__nav">
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
        <div className="landing-preview__grid">
          {days.map((date) => {
            if (!isSameMonth(date, PREVIEW_YEAR, PREVIEW_MONTH)) return <div key={date.toISOString()} />
            const day = date.getDate()
            return (
              <div
                key={day}
                className={`landing-preview__day${day === PREVIEW_SELECTED_DAY ? ' landing-preview__day--selected' : ''}`}
              >
                {day}
                {PREVIEW_DOTS[day] && <span className="landing-preview__dot" style={{ background: PREVIEW_DOTS[day] }} />}
              </div>
            )
          })}
        </div>
      </div>
      <div className="landing-preview__tag">유튜브 역추적</div>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Logo size="lg" />
        <div className="landing-nav__links">
          <a href="#features">기능</a>
          <a href="#platforms">지원 플랫폼</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="landing-nav__github">
            <Icon name="github" />
            GitHub
          </a>
          <Link to="/calendar" className="btn btn--primary landing-nav__cta">
            캘린더 보기
          </Link>
        </div>
      </nav>

      <header className="landing-hero">
        <div className="landing-hero__text">
          <h1 className="landing-hero__title">
            좋아하는 스트리머의
            <br />
            모든 방송을
            <br />
            <span className="landing-hero__highlight">달력 하나</span>로
          </h1>
          <p className="landing-hero__description">
            다시보기 링크와 유튜브 업로드 영상을 방송 날짜별로 정리해서 보여줘요.
            <br />
            &ldquo;이 영상이 언제 방송이었지?&rdquo; — 바로 역추적할 수 있어요.
          </p>
          <div className="landing-hero__actions">
            <Link to="/calendar" className="btn btn--primary landing-btn">
              캘린더 둘러보기
              <Icon name="arrowRight" strokeWidth={2.4} />
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn landing-btn landing-btn--outline">
              GitHub 저장소
            </a>
          </div>
        </div>
        <div className="landing-hero__visual">
          <CalendarPreview />
        </div>
      </header>

      <section id="features" className="landing-section">
        <div className="landing-section__heading">
          <h2 className="landing-section__title">왜 StreamerCalendar 인가요?</h2>
          <p className="sc-muted">흩어진 다시보기와 업로드 영상을, 방송 날짜 기준으로 정리해요</p>
        </div>
        <div className="landing-features">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="landing-feature">
              <div className="landing-feature__icon" style={{ background: feature.bg }}>
                <Icon name={feature.icon} size={24} color={feature.color} />
              </div>
              <h3 className="landing-feature__title">{feature.title}</h3>
              <p className="landing-feature__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-steps">
        <h2 className="landing-section__title landing-steps__title">이렇게 사용해요</h2>
        <ol className="landing-steps__list">
          {STEPS.map((step, i) => (
            <li key={step.title} className="landing-steps__item">
              {i > 0 && <Icon name="arrowRight" size={28} color="var(--accent-muted)" className="landing-steps__arrow" />}
              <div className="landing-step">
                <span className="landing-step__number jua" style={{ background: step.color }}>
                  {i + 1}
                </span>
                <h3 className="landing-step__title">{step.title}</h3>
                <p className="landing-step__description">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="platforms" className="landing-section landing-platforms">
        <h2 className="landing-section__title landing-platforms__title">지원 플랫폼</h2>
        <div className="landing-platforms__list">
          {PLATFORMS.map((platform) => (
            <PlatformBadge key={platform.code} platform={platform.code} size="lg">
              {platform.label}
            </PlatformBadge>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer__info">
          <span className="sc-muted">© 2026 StreamerCalendar · 머푸</span>
          <span className="landing-footer__stack">React · Spring Boot · PostgreSQL</span>
        </div>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="landing-footer__github">
          <Icon name="github" size={16} />
          GitHub에서 보기
        </a>
      </footer>
    </div>
  )
}

export default LandingPage
