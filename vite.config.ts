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
    // Enable gzip compression in dev
    middlewareMode: false,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    outDir: 'dist',
    // Disable sourcemap in production for smaller bundle
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Improve tree-shaking
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for React
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // UI libraries chunk
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          // Router chunk
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Utility libraries chunk
          if (id.includes('node_modules/react-hot-toast') || 
              id.includes('node_modules/react-helmet-async') ||
              id.includes('node_modules/react-icons')) {
            return 'vendor-utils';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const extType = name.split('.').pop() || '';
          
          if (/\.(png|jpe?g|svg|gif|webp|ico|avif)$/i.test(name)) {
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better minification
      },
      format: {
        comments: false,
      },
      mangle: {
        safari10: true,
      },
    },
    // Inline assets smaller than 4kb
    assetsInlineLimit: 4096,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500, // More aggressive warning
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@config': resolve(__dirname, './src/config'),
      '@constants': resolve(__dirname, './src/constants'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-helmet-async'
    ],
    // Exclude unnecessary dependencies from pre-bundling
    exclude: [],
  },
  // Enable esbuild for faster builds
  esbuild: {
    legalComments: 'none',
    target: 'es2020',
  },
  envPrefix: ['VITE_'],
});