import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'sicakep-rsudharjono',
    open: true,
    port: 5173,
    https: {
      key: fs.readFileSync('./sicakep-rsudharjono+2-key.pem'),
      cert: fs.readFileSync('./sicakep-rsudharjono+2.pem'),
    }
  }
})