import { useState } from 'react'
import { PLATFORM, PLATFORM_META } from '../../constants/platform'
import Icon from '../common/Icon'
import StreamerAvatar from '../common/StreamerAvatar'

function toInitialForm(record, defaultDate, defaultStreamerId, streamers) {
  if (record) {
    return {
      streamerId: record.streamerId,
      broadcastDate: record.broadcastDate,
      platform: record.platform,
      title: record.title,
      vodUrl: record.vodUrl ?? '',
      youtubeUrl: record.youtubeUrl ?? '',
    }
  }
  return {
    streamerId: defaultStreamerId ?? streamers[0]?.id ?? null,
    broadcastDate: defaultDate,
    platform: PLATFORM.CHZZK,
    title: '',
    vodUrl: '',
    youtubeUrl: '',
  }
}

// 방송 기록 입력 폼 (StreamRecordModal 안에서 사용). initialRecord가 있으면 수정 모드
// 입력값은 모달이 열려 있는 동안 유지되고, 저장 실패 시에도 초기화되지 않는다 (닫으면 언마운트되며 초기화)
function StreamRecordForm({
  streamers,
  initialRecord,
  defaultDate,
  defaultStreamerId,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
  error,
}) {
  const isEdit = Boolean(initialRecord)
  const [form, setForm] = useState(() => toInitialForm(initialRecord, defaultDate, defaultStreamerId, streamers))

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleChange(e) {
    update(e.target.name, e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.streamerId || !form.broadcastDate || !form.title.trim()) return

    onSubmit({
      streamerId: Number(form.streamerId),
      broadcastDate: form.broadcastDate,
      platform: form.platform,
      title: form.title.trim(),
      vodUrl: form.vodUrl.trim() || undefined,
      youtubeUrl: form.youtubeUrl.trim() || undefined,
    })
  }

  const canSubmit = streamers.length > 0 && form.streamerId && form.broadcastDate && form.title.trim()

  return (
    <form className="stream-form" onSubmit={handleSubmit}>
      <fieldset className="sc-field stream-form__fieldset">
        <legend className="sc-field__label">스트리머</legend>
        {streamers.length === 0 ? (
          <p className="stream-form__hint">먼저 스트리머 관리 화면에서 스트리머를 등록해주세요.</p>
        ) : (
          <div className="stream-form__pills">
            {streamers.map((streamer) => (
              <button
                key={streamer.id}
                type="button"
                className="streamer-pill stream-form__streamer-pill"
                aria-pressed={form.streamerId === streamer.id}
                onClick={() => update('streamerId', streamer.id)}
              >
                <StreamerAvatar streamer={streamer} size={20} />
                {streamer.name}
              </button>
            ))}
          </div>
        )}
      </fieldset>

      <div className="stream-form__row">
        <div className="sc-field">
          <label className="sc-field__label" htmlFor="stream-date">
            방송 날짜
          </label>
          <input
            id="stream-date"
            name="broadcastDate"
            className="sc-input"
            type="date"
            value={form.broadcastDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="sc-field">
          <span className="sc-field__label">출처</span>
          <div className="stream-form__source">수동 입력 (MANUAL)</div>
        </div>
      </div>

      <fieldset className="sc-field stream-form__fieldset">
        <legend className="sc-field__label">플랫폼</legend>
        <div className="stream-form__platforms">
          {Object.values(PLATFORM).map((platform) => {
            const meta = PLATFORM_META[platform]
            const isActive = form.platform === platform
            return (
              <button
                key={platform}
                type="button"
                className="stream-form__platform-pill"
                aria-pressed={isActive}
                style={{ color: meta.fg, background: meta.bg, borderColor: isActive ? meta.fg : 'transparent' }}
                onClick={() => update('platform', platform)}
              >
                {meta.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="sc-field">
        <label className="sc-field__label" htmlFor="stream-title">
          방송 제목
        </label>
        <input
          id="stream-title"
          name="title"
          className="sc-input"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="예) 롤 방송 1부"
          maxLength={255}
          required
        />
      </div>

      <div className="sc-field">
        <label className="sc-field__label" htmlFor="stream-vod">
          원본 링크 (선택)
        </label>
        <input
          id="stream-vod"
          name="vodUrl"
          className="sc-input"
          type="url"
          value={form.vodUrl}
          onChange={handleChange}
          placeholder="https://chzzk.naver.com/..."
        />
      </div>

      <div className="sc-field">
        <label className="sc-field__label" htmlFor="stream-youtube">
          유튜브 영상 링크 (선택)
        </label>
        <input
          id="stream-youtube"
          name="youtubeUrl"
          className="sc-input"
          type="url"
          value={form.youtubeUrl}
          onChange={handleChange}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      {error && (
        <p className="sc-alert" role="alert">
          {error}
        </p>
      )}

      <div className="stream-form__actions">
        {onDelete && (
          <button type="button" className="stream-form__delete" onClick={onDelete} disabled={isSubmitting}>
            <Icon name="trash" size={14} />이 기록 삭제
          </button>
        )}
        <div className="stream-form__buttons">
          <button type="button" className="btn btn--outline" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="btn btn--primary" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? '저장 중...' : isEdit ? '수정 완료' : '저장하기'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default StreamRecordForm
