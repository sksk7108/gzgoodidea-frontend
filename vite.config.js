import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    // port: 3001, // 设置开发服务器端口
    cors: true, // 允许跨域
    // host: true,
    proxy: {
      // 配置代理
      '/api': {
        // target: 'http://localhost:8082', // 本地 目标后端服务器
        target: 'http://192.168.2.30:8082', // 服务器
        // target: 'http://192.168.2.36:8082', // 内网服务器
        changeOrigin: true, // 改变源
        secure: false, // 接受无效证书
        ws: true, // 代理 websockets
        // rewrite: (path) => path.replace(/^\/api/, ''), // 将 /api 重写为空
        //  configure: (proxy, _options) => {
        //   proxy.on('error', (err, _req, _res) => {
        //     console.log('代理错误:', err);
        //   });
        //   proxy.on('proxyReq', (proxyReq, req, _res) => {
        //     console.log('发送代理请求:', req.method, req.url);
        //   });
        //   proxy.on('proxyRes', (proxyRes, req, _res) => {
        //     console.log('收到代理响应:', proxyRes.statusCode, req.url);
        //   });
        // }
      },
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
