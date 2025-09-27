import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Handle SPA routing for GitHub Pages
  preview: {
    port: 4173,
    strictPort: true,
  }
})