import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // akses dari device lain
    open: true,  // otomatis buka browser
    port: 5173,
    // HTTPS dinonaktifkan sementara
    // https: {
    //   key: fs.readFileSync('./sicakep-rsudharjono+2-key.pem'),
    //   cert: fs.readFileSync('./sicakep-rsudharjono+2.pem'),
    // }
  }
})