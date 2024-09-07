import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import runCommandPlugin from './plugins/vite-plugin-run-command'

const command = 'rsync -avz /home/smy-101/workspace/notion-collect/dist/ /mnt/d/test/dist/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    runCommandPlugin(command)
  ],
})
