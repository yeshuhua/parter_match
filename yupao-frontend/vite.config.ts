import { defineConfig, resolveBaseUrl } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // 添加静态资源服务配置
    fs: {
      allow: ['.', './public']
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    })
  ],
})
