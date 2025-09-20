import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: "**/*.{jsx,tsx}",
    })
  ],
  base: '/',
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          router: ['react-router-dom'],
          utils: ['react-hot-toast', 'react-helmet-async']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const extType = name.split('.').pop() || '';
          
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(name)) {
            return `assets/images/[name]-[hash].${extType}`;
          }
          if (/\.(css)$/i.test(name)) {
            return `assets/css/[name]-[hash].${extType}`;
          }
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(name)) {
            return `assets/fonts/[name]-[hash].${extType}`;
          }
          return `assets/[name]-[hash].${extType}`;
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      format: {
        comments: false,
      },
    },
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion'
    ],
  },
  envPrefix: ['VITE_'],
});