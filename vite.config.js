import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/souls-weapon-randomizer.github.io/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})