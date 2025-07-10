import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mstenant-find/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/resolve': {
        target: 'https://dns.google',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/resolve/, '/resolve'),
        headers: {
          'Accept': 'application/dns-json'
        }
      },
      '/ip-api': {
        target: 'https://ipapi.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ip-api/, ''),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Microsoft-Tenant-Finder/1.0'
        }
      }
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});