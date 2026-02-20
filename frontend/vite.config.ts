/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.ts',
      globals: true,
    },
    server: {
      port: 5173,
      open: true,
      https: env.VITE_HTTPS === 'true' ? true : false,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'stellar-vendor': ['stellar-sdk'],
            'ui-vendor': ['recharts', 'date-fns'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    define: {
      // Make env variables available at build time
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.1.0'),
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'stellar-sdk'],
    },
  };
});