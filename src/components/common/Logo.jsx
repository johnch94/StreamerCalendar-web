import { Link } from 'react-router'
import Icon from './Icon'

function Logo({ to = '/', size = 'md' }) {
  return (
    <Link to={to} className={`logo logo--${size}`}>
      <Icon name="calendar" size={size === 'lg' ? 30 : 24} color="var(--accent)" />
      <span className="jua">StreamerCalendar</span>
    </Link>
  )
}

export default Logo
