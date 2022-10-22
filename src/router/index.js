import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/Home/self/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/backgroundset',
    name: 'backgroundset',
    component: () => import('../pages/BackgroundSet/self/BackgroundSet.vue')
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  //结合electron要使用hash的方式
  history: createWebHashHistory(),
  routes
})

export default router
