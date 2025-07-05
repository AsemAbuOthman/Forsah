import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    }),
    tailwindcss()
  ],

  // optimizeDeps: {
  //   exclude: ['lucide-react'],
  // },
  
  server: {

    proxy:{
      '/api':{
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
    }
  }
})
