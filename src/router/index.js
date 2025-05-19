import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/Layout/MainLayout.vue'
import Login from '@/views/Login.vue'
import { getToken } from '@/utils/auth'

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
        path: 'favorites',
        name: 'Favorites',
        component: () => import('@/views/FavoritesList.vue')
      },
      {
        path: 'saved',
        name: 'Saved',
        component: () => import('@/views/SavedList.vue')
      },
      {
        path: 'keywords',
        name: 'Keywords',
        component: () => import('@/views/KeywordList.vue')
      },
      {
        path: 'ai-config',
        name: 'AIConfig',
        component: () => import('@/views/AIConfig.vue'),
        meta: {
          hidden: true // 标记为隐藏，不在导航菜单中显示
        }
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
  const token = getToken() // 检查是否有token
  
  if (to.meta.requiresAuth && !token) {
    // 需要认证但未登录，重定向到登录页
    next({ name: 'Login' })
  } else if (to.name === 'Login' && token) {
    // 已登录用户访问登录页，重定向到首页
    next({ name: 'Videos' })
  } else {
    next()
  }
  next()
})

export default router 