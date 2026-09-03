import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catalog: resolve(__dirname, 'catalog.html'),
        product: resolve(__dirname, 'product.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
