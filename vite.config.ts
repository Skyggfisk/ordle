import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import VitePluginReactRemoveAttributes from 'vite-plugin-react-remove-attributes';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePluginReactRemoveAttributes({
      attributes: ['data-testid'],
    }),
  ],
  base: '/ordle/',
  build: {
    outDir: 'dist',
  },
});
