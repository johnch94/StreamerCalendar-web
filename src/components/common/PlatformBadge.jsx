import { PLATFORM_META } from '../../constants/platform'

function PlatformBadge({ platform, size = 'md', children }) {
  const meta = PLATFORM_META[platform] ?? PLATFORM_META.OTHER
  return (
    <span className={`platform-badge platform-badge--${size}`} style={{ color: meta.fg, background: meta.bg }}>
      {children ?? meta.label}
    </span>
  )
}

export default PlatformBadge
