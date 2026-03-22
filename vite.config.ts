import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const repoName = 'redis-sds-animation';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 部署时使用 /redis-sds-animation/ 作为 base 路径
  base: `/${repoName}/`,
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
