import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'
import router from './router/index.js'
import { fadeIn } from './directives/fadeIn.js'

const app = createApp(App)
app.directive('fade-in', fadeIn)
app.use(router)
app.mount('#app')
