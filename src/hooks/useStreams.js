import { useCallback, useEffect, useState } from 'react'
import { getStreams } from '../api/streams'

// 방송 기록 조회 훅. params: { streamerId, platform, year, month } (모두 optional)
// - 응답이 어떤 조건(queryKey)에 대한 것인지 함께 저장해서, 월을 빠르게 넘길 때
//   늦게 도착한 이전 요청 응답이 현재 화면을 덮어쓰지 않게 한다.
// - 로딩 여부도 "현재 조건에 대한 응답을 아직 못 받았는지"로 계산해서 effect 안에서 setState를 동기 호출하지 않는다.
export function useStreams({ streamerId, platform, year, month } = {}) {
  const queryKey = [streamerId, platform, year, month].join('|')
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({ queryKey: null, version: -1, data: [], error: null })

  useEffect(() => {
    let ignore = false

    getStreams({ streamerId, platform, year, month })
      .then((data) => {
        if (!ignore) setResult({ queryKey, version, data: data ?? [], error: null })
      })
      .catch((err) => {
        if (!ignore) setResult({ queryKey, version, data: [], error: err.message })
      })

    return () => {
      ignore = true
    }
  }, [queryKey, version, streamerId, platform, year, month])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const isCurrentQuery = result.queryKey === queryKey

  return {
    streams: isCurrentQuery ? result.data : [],
    error: isCurrentQuery ? result.error : null,
    isLoading: !isCurrentQuery || result.version !== version,
    reload,
  }
}
