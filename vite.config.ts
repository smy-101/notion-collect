import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build:{
    rollupOptions:{
      input:{
        main:resolve(__dirname,'index.html'),
        options:resolve(__dirname,'options.html'),
      }
    }
  }
})
