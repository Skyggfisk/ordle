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
        '@components': '/src/components',
        '@hooks': '/src/hooks',
        '@shared-types': '/src/types',
        '@services': '/src/services',
        '@locales': '/src/locales',
        '@icons': '/src/icons',
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
