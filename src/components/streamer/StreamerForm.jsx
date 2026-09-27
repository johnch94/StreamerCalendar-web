import { useState } from 'react'

// 입력값은 폼이 열려 있는 동안 유지되고, 등록 성공 시 페이지에서 폼을 닫으면서(언마운트) 초기화된다
function StreamerForm({ onSubmit, onCancel, isSubmitting, error }) {
  const [form, setForm] = useState({ name: '', profileImageUrl: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return

    onSubmit({
      name: form.name.trim(),
      profileImageUrl: form.profileImageUrl.trim() || undefined,
    })
  }

  return (
    <form className="streamer-form" onSubmit={handleSubmit}>
      <h2 className="streamer-form__title">새 스트리머 등록</h2>

      <div className="streamer-form__row">
        <div className="sc-field">
          <label className="sc-field__label" htmlFor="streamer-name">
            이름
          </label>
          <input
            id="streamer-name"
            name="name"
            className="sc-input"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="예) 밤별"
            maxLength={100}
            required
            autoFocus
          />
        </div>

        <div className="sc-field">
          <label className="sc-field__label" htmlFor="streamer-image">
            프로필 이미지 URL (선택)
          </label>
          <input
            id="streamer-image"
            name="profileImageUrl"
            className="sc-input"
            type="url"
            value={form.profileImageUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>

      {error && (
        <p className="sc-alert" role="alert">
          {error}
        </p>
      )}

      <div className="streamer-form__actions">
        <button type="button" className="btn btn--outline" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn btn--primary" disabled={isSubmitting || !form.name.trim()}>
          {isSubmitting ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </form>
  )
}

export default StreamerForm
