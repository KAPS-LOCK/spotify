import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // MixBuddy (aero theme) keeps its Groq API key in src/themes/aero/.env
  envDir: 'src/themes/aero',
})
