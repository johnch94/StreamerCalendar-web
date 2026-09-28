import { createContext } from 'react'

// value: { status: 'loading' | 'guest' | 'admin', username, login, logout }
export const AuthContext = createContext(null)
