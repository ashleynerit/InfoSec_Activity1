import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
=======
>>>>>>> cf394a27a1ed7b8cca694598cf5808440fdbf35e
})
