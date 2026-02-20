import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path is set via VITE_BASE_PATH env var or --base CLI flag.
// Defaults to '/' for local dev.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    host: '127.0.0.1',
  },
})
