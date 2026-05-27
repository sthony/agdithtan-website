import { createRouter, createWebHistory } from 'vue-router'
import HomePage  from '../pages/HomePage.vue'
import AboutPage from '../pages/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',       component: HomePage  },
    { path: '/about',  component: AboutPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
