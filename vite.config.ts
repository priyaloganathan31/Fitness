import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0) so mobile phones can connect
    port: 5173,
    allowedHosts: true // Allow external host headers from tunnels like localhost.run / localtunnel
  }
})
