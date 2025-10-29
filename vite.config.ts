import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/react-app/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
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
  },
});
