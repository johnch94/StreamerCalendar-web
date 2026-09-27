// 백엔드 API 명세서의 Enum 정의와 동일하게 유지할 것
export const PLATFORM = {
  CHZZK: 'CHZZK',
  SOOP: 'SOOP',
  YOUTUBE: 'YOUTUBE',
  TWITCH: 'TWITCH',
  OTHER: 'OTHER',
}

export const SOURCE = {
  MANUAL: 'MANUAL',
  CRAWLED: 'CRAWLED',
}

// 플랫폼 뱃지 표시용 라벨/컬러 (fg: 글자, bg: 배경)
export const PLATFORM_META = {
  CHZZK: { label: '치지직', fg: '#00A870', bg: '#DFF9EE' },
  SOOP: { label: '숲', fg: '#0E85D9', bg: '#E2F3FF' },
  YOUTUBE: { label: '유튜브', fg: '#D92B22', bg: '#FFE4E2' },
  TWITCH: { label: '트위치', fg: '#9146FF', bg: '#F0E6FF' },
  OTHER: { label: '기타', fg: '#6B6480', bg: '#EFEDF3' },
}

export const SOURCE_LABEL = {
  MANUAL: '수동 입력',
  CRAWLED: '크롤링 수집',
}
