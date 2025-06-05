import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/Layout/MainLayout.vue'
import Login from '@/views/Login.vue'
import { getToken, getRememberCompanyId } from '@/utils/auth'
import { companyConfig } from '@/config/company-config'

const routes = [
  {
    path: '/login',
    redirect: '/login/VT-10002'
  },
  {
    path: '/login/:loginCompanyId',
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
        redirect: to => {
          // 默认重定向到当前公司ID的首页
          // return { path: `${companyConfig[getRememberCompanyId()].indexPath}` }
          return { path: `${companyConfig[getRememberCompanyId()]? companyConfig[getRememberCompanyId()].indexPath : '/login'}` }
        }
      },
      {
        path: 'index',
        name: 'CompanyIndex',
        component: () => import('@/views/VideoList.vue'),
        meta: {title: '视频列表'}
      },
      {
        path: 'favorites',
        name: 'CompanyFavorites',
        component: () => import('@/views/FavoritesList.vue'),
        meta: {title: '我的收藏'}
      },
      {
        path: 'copywriting',
        name: 'CompanyCopywriting',
        component: () => import('@/views/AiCopywritingList.vue'),
        meta: {title: '智能文案'}
      },
      {
        path: 'keywords',
        name: 'CompanyKeywords',
        component: () => import('@/views/KeywordList.vue'),
        meta: {title: '我的关键词'}
      },
      {
        path: 'benchmark-accounts',
        name: 'BenchmarkAccounts',
        component: () => import('@/views/BenchmarkAccounts.vue'),
        meta: {title: '对标账号'}
      },
      {
        path: 'matrix',
        name: 'CompanyMatrix',
        component: () => import('@/views/MatrixList.vue'),
        meta: {title: '矩阵管理'}
      },
      {
        path: 'ai-config',
        name: 'CompanyAIConfig',
        component: () => import('@/views/AIConfig.vue'),
        meta: {
          hidden: true // 标记为隐藏，不在导航菜单中显示
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title =to.meta.title? `爆米热点 - ${to.meta.title}`:'爆米热点'
  // 检查公司ID是否有效
  if (to.params.loginCompanyId && !companyConfig[to.params.loginCompanyId]) {
    // 如果公司ID无效，重定向到默认公司
    next({ path: '/login/VT-10002' })
    return
  }

  // 身份验证逻辑
  const token = getToken() // 检查是否有token

  if (to.meta.requiresAuth && !token) {
    // 需要认证但未登录，重定向到登录页
    next({ path: `/login/${getRememberCompanyId() || 'VT-10002'}` })
  } else if (to.path.startsWith('/login')) {
    next()
  } else {
    if (companyConfig[getRememberCompanyId()].permittedPaths.includes(to.path)) {
      next()
    } else {
      next({path: '/404'})
    }
  }
})

export default router 