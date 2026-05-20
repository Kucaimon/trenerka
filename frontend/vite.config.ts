import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Root deploy on Beget (app subdomain document root = public_html)
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    emptyOutDir: true,
    sourcemap: false,
    manifest: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('node_modules/recharts')) return 'recharts'
          if (id.includes('node_modules/@tremor')) return 'tremor'
          if (id.includes('node_modules/@fullcalendar')) return 'fullcalendar'
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            /node_modules\/react\//.test(id)
          ) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@radix-ui')) return 'radix'
          if (id.includes('node_modules/lucide-react')) return 'lucide'
          if (id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/date-fns')) return 'date-fns'
          if (id.includes('node_modules/zod')) return 'zod'
          if (id.includes('node_modules/i18next')) return 'i18n'
          // Avoid Rollup naming chunks "dist" from node_modules/*/dist/*
          return 'vendor'
        },
      },
    },
  },
})
