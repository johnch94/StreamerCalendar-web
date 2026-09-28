import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 서버에서도 /api를 백엔드로 넘겨 운영(Vercel rewrites)과 같은 도메인 구조로 맞춘다
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
