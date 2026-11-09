import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/n8n-chat': {
        target: 'https://amarrr17.app.n8n.cloud',
        changeOrigin: true,
        headers: { origin: '' },
        rewrite: (path) => path.replace(/^\/n8n-chat/, ''),
      },
      '/chat': {
        target: 'wss://amarrr17.app.n8n.cloud',
        changeOrigin: true,
        ws: true,
        headers: { origin: '' },
      },
    },
  },
});
