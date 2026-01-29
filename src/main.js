import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // Ensures the 90s style is applied globally

const app = createApp(App)
app.use(router)
app.mount('#app')