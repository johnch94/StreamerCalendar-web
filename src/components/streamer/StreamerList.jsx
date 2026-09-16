function StreamerList({ streamers, onDelete }) {
  if (streamers.length === 0) {
    return <p className="streamer-list__empty">등록된 스트리머가 없어요.</p>
  }

  return (
    <ul className="streamer-list">
      {streamers.map((streamer) => (
        <li key={streamer.id} className="streamer-list__item">
          {streamer.profileImageUrl ? (
            <img className="streamer-list__avatar" src={streamer.profileImageUrl} alt="" />
          ) : (
            <div className="streamer-list__avatar streamer-list__avatar--placeholder" />
          )}
          <span className="streamer-list__name">{streamer.name}</span>
          <button type="button" className="streamer-list__delete" onClick={() => onDelete(streamer.id)}>
            삭제
          </button>
        </li>
      ))}
    </ul>
  )
}

export default StreamerList
