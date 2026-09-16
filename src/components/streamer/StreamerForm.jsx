import { useState } from 'react'

const initialForm = { name: '', profileImageUrl: '' }

function StreamerForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return

    await onSubmit({
      name: form.name.trim(),
      profileImageUrl: form.profileImageUrl.trim() || undefined,
    })
    setForm(initialForm)
  }

  return (
    <form className="streamer-form" onSubmit={handleSubmit}>
      <div className="streamer-form__field">
        <label htmlFor="streamer-name">이름 *</label>
        <input id="streamer-name" name="name" type="text" value={form.name} onChange={handleChange} required />
      </div>

      <div className="streamer-form__field">
        <label htmlFor="streamer-image">프로필 이미지 URL</label>
        <input
          id="streamer-image"
          name="profileImageUrl"
          type="url"
          value={form.profileImageUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '등록 중...' : '스트리머 등록'}
      </button>
    </form>
  )
}

export default StreamerForm
