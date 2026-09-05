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
        salons: resolve(__dirname, 'salons.html'),
        majlis: resolve(__dirname, 'majlis.html'),
        corners: resolve(__dirname, 'corners.html'),
        curtains: resolve(__dirname, 'curtains.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
        catalog: resolve(__dirname, 'catalog.html'),
        product: resolve(__dirname, 'product.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
