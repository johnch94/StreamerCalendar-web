import { useCallback, useEffect, useState } from 'react'
import { getStreamers } from '../api/streamers'

// 스트리머 목록 조회 훅. 로딩 여부 계산 방식은 useStreams와 동일
export function useStreamers() {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({ version: -1, data: [], error: null })

  useEffect(() => {
    let ignore = false

    getStreamers()
      .then((data) => {
        if (!ignore) setResult({ version, data: data ?? [], error: null })
      })
      .catch((err) => {
        if (!ignore) setResult((prev) => ({ version, data: prev.data, error: err.message }))
      })

    return () => {
      ignore = true
    }
  }, [version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return {
    streamers: result.data,
    error: result.error,
    isLoading: result.version !== version,
    hasLoaded: result.version >= 0,
    reload,
  }
}
