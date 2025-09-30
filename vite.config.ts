import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react(), tailwindcss(), svgr()],
    base: '/ordle/',
    resolve: {
      alias: {
        '~': '/src',
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        external: ['src/service-worker.ts'],
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  };
});
