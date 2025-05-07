import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/Layout/MainLayout.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: MainLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        redirect: '/videos'
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import('@/views/VideoList.vue')
      },
      {
        path: 'keywords',
        name: 'Keywords',
        component: () => import('@/views/KeywordList.vue')
      },
      {
        path: 'ai-config',
        name: 'AIConfig',
        component: () => import('@/views/AIConfig.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token') // 检查是否已登录
  
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     // 需要认证但未登录，重定向到登录页
//     next({ name: 'Login' })
//   } else if (to.name === 'Login' && isAuthenticated) {
//     // 已登录用户访问登录页，重定向到首页
//     next({ name: 'Videos' })
//   } else {
//     next()
//   }
next()
})

export default router 