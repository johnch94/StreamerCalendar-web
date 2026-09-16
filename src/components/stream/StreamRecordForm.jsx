import { useState } from 'react'
import { PLATFORM } from '../../constants/platform'

const initialForm = {
  streamerId: '',
  platform: PLATFORM.CHZZK,
  title: '',
  vodUrl: '',
  youtubeUrl: '',
}

function StreamRecordForm({ streamers, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.streamerId || !form.title.trim()) return

    await onSubmit({
      streamerId: Number(form.streamerId),
      platform: form.platform,
      title: form.title.trim(),
      vodUrl: form.vodUrl.trim() || undefined,
      youtubeUrl: form.youtubeUrl.trim() || undefined,
    })

    setForm(initialForm)
  }

  return (
    <form className="stream-form" onSubmit={handleSubmit}>
      <div className="stream-form__row">
        <div className="stream-form__field">
          <label htmlFor="stream-streamer">스트리머 *</label>
          <select id="stream-streamer" name="streamerId" value={form.streamerId} onChange={handleChange} required>
            <option value="" disabled>
              선택하세요
            </option>
            {streamers.map((streamer) => (
              <option key={streamer.id} value={streamer.id}>
                {streamer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="stream-form__field">
          <label htmlFor="stream-platform">플랫폼 *</label>
          <select id="stream-platform" name="platform" value={form.platform} onChange={handleChange} required>
            {Object.values(PLATFORM).map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="stream-form__field">
        <label htmlFor="stream-title">제목 *</label>
        <input id="stream-title" name="title" type="text" value={form.title} onChange={handleChange} required />
      </div>

      <div className="stream-form__row">
        <div className="stream-form__field">
          <label htmlFor="stream-vod">원본 다시보기 링크</label>
          <input
            id="stream-vod"
            name="vodUrl"
            type="url"
            value={form.vodUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="stream-form__field">
          <label htmlFor="stream-youtube">유튜브 링크</label>
          <input
            id="stream-youtube"
            name="youtubeUrl"
            type="url"
            value={form.youtubeUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting || streamers.length === 0}>
        {isSubmitting ? '등록 중...' : '방송 기록 등록'}
      </button>

      {streamers.length === 0 && (
        <p className="stream-form__hint">먼저 스트리머 관리 탭에서 스트리머를 등록해주세요.</p>
      )}
    </form>
  )
}

export default StreamRecordForm
