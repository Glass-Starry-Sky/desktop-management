import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//使用bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
//vuex
import { store } from './store/index'
//element-plus-icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
//注册element-plus的icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(store)

app.mount('#app')


