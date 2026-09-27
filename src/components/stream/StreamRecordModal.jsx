import { useState } from 'react'
import { createStream, deleteStream, updateStream } from '../../api/streams'
import Modal from '../common/Modal'
import StreamRecordForm from './StreamRecordForm'

// 방송 기록 추가/수정 모달. record가 있으면 수정 모드 (수정 완료 + 삭제 버튼 노출)
// API 호출과 제출 상태/에러를 여기서 관리하고, 결과만 onSaved / onDeleted로 알린다
function StreamRecordModal({ streamers, record, defaultDate, defaultStreamerId, onClose, onSaved, onDeleted }) {
  const isEdit = Boolean(record)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function run(action) {
    setIsSubmitting(true)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(err.message)
      setIsSubmitting(false)
    }
    // 성공 시에는 부모가 모달을 닫으므로(언마운트) 상태를 되돌리지 않는다
  }

  function handleSubmit(data) {
    return run(async () => {
      const saved = isEdit ? await updateStream(record.id, data) : await createStream(data)
      onSaved(saved)
    })
  }

  function handleDelete() {
    if (!window.confirm(`'${record.title}' 기록을 삭제할까요?`)) return
    return run(async () => {
      await deleteStream(record.id)
      onDeleted?.(record)
    })
  }

  return (
    <Modal title={isEdit ? '방송 기록 수정' : '방송 기록 추가'} onClose={onClose}>
      <StreamRecordForm
        streamers={streamers}
        initialRecord={record}
        defaultDate={defaultDate}
        defaultStreamerId={defaultStreamerId}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onDelete={isEdit ? handleDelete : undefined}
        isSubmitting={isSubmitting}
        error={error}
      />
    </Modal>
  )
}

export default StreamRecordModal
