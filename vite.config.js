import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3001, // 设置开发服务器端口 // 自动打开浏览器
    cors: true, // 允许跨域
    proxy: {
      // 配置代理
      '/api': {
        target: 'http://localhost:8082', // 目标服务器
        changeOrigin: true, // 改变源
        // secure: false, // 接受无效证书
        // ws: true, // 代理 websockets
        rewrite: (path) => path.replace(/^\/api/, ''), // 将 /api 重写为空
      }
    }
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境去除 console
        drop_debugger: true // 生产环境去除 debugger
      }
    }
  }
})
