import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/runrhythm-vite/",   // 👈 matches your repo name
  server: {
    port: 3000,
  },
});