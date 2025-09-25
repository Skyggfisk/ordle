import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [react(), tailwindcss(), svgr()],
    base: '/ordle/',
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
