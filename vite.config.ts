import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const repoName = 'redis-sds-animation';

// https://vitejs.dev/config/
export default defineConfig({
  // 开发环境使用 /，生产环境使用 HashRouter 不需要 base
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 28605,
    open: true,
  },
  build: {
    // 确保静态资源正确引用
    assetsDir: 'assets',
    sourcemap: false,
    // 优化构建输出
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
