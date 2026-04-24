import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const apiBase = env.VITE_API_BASE ?? 'http://localhost:3000/api/v1';

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': '/src' },
    },
    server: {
      port: 3001,
      // 本地开发：通过 vite 代理避免 CORS，保持调用端仍用 /api/v1 前缀
      proxy: {
        '/api/v1': {
          target: apiBase.replace(/\/api\/v1\/?$/, ''),
          changeOrigin: true,
        },
      },
    },
    define: {
      __API_BASE__: JSON.stringify(apiBase),
    },
  };
});
