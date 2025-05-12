import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.mount('#app')
