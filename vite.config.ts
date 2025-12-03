import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  // 1. CRITICAL: Ensures assets are requested from root (prevents MIME errors on sub-routes)
  base: '/', 
  
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 2. OPTIONAL: Explicitly match your netlify.toml 'publish' setting
  build: {
    outDir: 'dist', 
  }
})