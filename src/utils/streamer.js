import { PLATFORM } from '../constants/platform'

const PLATFORM_ORDER = Object.values(PLATFORM)

// 플랫폼 코드 모음(Set/Array)을 Enum 정의 순서로 정렬
export function sortPlatforms(platforms) {
  const set = new Set(platforms)
  return PLATFORM_ORDER.filter((p) => set.has(p))
}

// 스트리머에는 별도 색상 필드가 없으므로 id 기준으로 팔레트에서 고정 색상을 배정
const STREAMER_COLORS = ['#7C5CFC', '#00A870', '#0E85D9', '#FF6F61', '#C99400', '#D94BA8']

export function getStreamerColor(id) {
  const index = Math.abs(Number(id) || 0) % STREAMER_COLORS.length
  return STREAMER_COLORS[index]
}

export function getInitial(name = '') {
  return name.trim().charAt(0)
}
