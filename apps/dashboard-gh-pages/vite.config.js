import { defineConfig } from 'vite';

export default defineConfig({
  base: '/SUPABASESUPERCHARGE/', // important for GitHub Pages path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
