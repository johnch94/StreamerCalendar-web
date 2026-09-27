import { getInitial, getStreamerColor } from '../../utils/streamer'

// 프로필 이미지가 있으면 이미지, 없으면 스트리머 고유 색상 + 이름 첫 글자
function StreamerAvatar({ streamer, size = 24, className = '' }) {
  const style = {
    width: size,
    height: size,
    fontSize: Math.max(7, Math.round(size * 0.46)),
    background: getStreamerColor(streamer.id),
  }

  if (streamer.profileImageUrl) {
    return <img className={`avatar ${className}`} src={streamer.profileImageUrl} alt="" style={style} />
  }

  return (
    <span className={`avatar ${className}`} style={style} aria-hidden="true">
      {getInitial(streamer.name)}
    </span>
  )
}

export default StreamerAvatar
