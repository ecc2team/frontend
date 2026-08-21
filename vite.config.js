import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: globalThis.process?.env.GITHUB_ACTIONS === 'true' ? '/frontend/' : '/',
  plugins: [react()],
})
