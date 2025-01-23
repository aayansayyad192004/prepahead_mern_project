import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Specify the output directory explicitly
  },
  define: {
    'process.env': process.env  // This allows access to process.env
  }
});
// vite.config.js

