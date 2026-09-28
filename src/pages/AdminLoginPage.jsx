import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import Icon from '../components/common/Icon'
import Logo from '../components/common/Logo'
import { useAuth } from '../hooks/useAuth'
import './AdminLoginPage.css'

const DEFAULT_REDIRECT = '/admin/streamers'

// 다른 사이트로 튕겨 나가지 않도록 앱 내부 경로만 허용
function getRedirectPath(state) {
  const from = state?.from
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : DEFAULT_REDIRECT
}

// login.html 시안 기준. 관리자 1명 구조라 시안의 소셜 로그인 / 회원가입 / 비밀번호 찾기는 제외
function AdminLoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = getRedirectPath(location.state)

  const [form, setForm] = useState({ username: '', password: '', rememberMe: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (status === 'admin') {
    return <Navigate to={redirectPath} replace />
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await login(form.username.trim(), form.password, form.rememberMe)
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(err.message)
      setForm((prev) => ({ ...prev, password: '' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = form.username.trim() && form.password && !isSubmitting

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__heading">
          <Logo size="lg" />
          <h1 className="admin-login__subtitle">관리자만 로그인할 수 있어요</h1>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="sc-field">
            <label className="sc-field__label" htmlFor="admin-username">
              아이디
            </label>
            <input
              id="admin-username"
              name="username"
              className="sc-input admin-login__input"
              type="text"
              autoComplete="username"
              placeholder="아이디 입력"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="sc-field">
            <label className="sc-field__label" htmlFor="admin-password">
              비밀번호
            </label>
            <input
              id="admin-password"
              name="password"
              className="sc-input admin-login__input"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <label className="admin-login__keep">
            <input
              type="checkbox"
              name="rememberMe"
              className="visually-hidden"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <span className="admin-login__check" aria-hidden="true">
              <Icon name="check" size={11} strokeWidth={3} color="#fff" />
            </span>
            로그인 상태 유지
          </label>

          {error && (
            <p className="sc-alert" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary admin-login__submit" disabled={!canSubmit}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="admin-login__footer">
          관리자가 아니신가요? <Link to="/calendar">캘린더 보러 가기</Link>
        </p>
      </div>
    </main>
  )
}

export default AdminLoginPage
