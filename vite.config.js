import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sri from 'vite-plugin-sri'

export default defineConfig({
  plugins: [react(), sri()],
  build: {
    sourcemap: true,
  },
})