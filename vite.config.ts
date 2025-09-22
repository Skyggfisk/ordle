import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
// const VitePluginReactRemoveAttributes =
//   // eslint-disable-next-line @typescript-eslint/no-require-imports
//   require('vite-plugin-react-remove-attributes').default;

// https://vite.dev/config/
export default defineConfig(async () => {
  const { default: VitePluginReactRemoveAttributes } = await import(
    'vite-plugin-react-remove-attributes'
  );

  return {
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
  };
});
