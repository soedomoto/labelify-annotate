import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/react-app/',
  // build: {
  //   rollupOptions: {
  //     output: {
  //       entryFileNames: 'index.js',
  //       assetFileNames: (assetInfo) => {
  //         if (assetInfo.name && assetInfo.name.endsWith('.css')) {
  //           return 'index.css';
  //         }
  //         return assetInfo.name || 'default-asset';
  //       },
  //     },
  //   },
  // },
});
