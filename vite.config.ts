import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// Base path is set via VITE_BASE_PATH env var or --base CLI flag.
// Defaults to '/' for local dev.
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    host: '0.0.0.0',
  },
})
