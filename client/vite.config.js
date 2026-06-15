import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ 
      presets: [reactCompilerPreset()],
      exclude: 'node_modules/**'
    }),
    tailwindcss()
  ],
  optimizeDeps: {
    include: ['react-redux', '@reduxjs/toolkit', 'react', 'react-dom', 'js-cookie'],
  },
  server: {
    port: 5173
  }
})
