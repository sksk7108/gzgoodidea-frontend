// user.js - 用户状态管理
import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/auth'
import { 
  setToken, getToken, removeToken, 
  setUserInfo, getUserInfo as getStoredUserInfo, removeUserInfo, clearAuth,
  setRememberUsername, getRememberUsername,
  setRememberPassword, getRememberPassword,
  setStoredPassword, getStoredPassword
} from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: getStoredUserInfo() || {},
    rememberMe: getRememberPassword() || false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    account: (state) => state.userInfo.account || '',
    username: (state) => state.userInfo.username || '',
    avatar: (state) => state.userInfo.avatar || '',
    company: (state) => state.userInfo.company || '',
  },

  actions: {
    // 设置Token
    setToken(token) {
      this.token = token
      setToken(token)
    },

    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      setUserInfo(userInfo)
    },
    
    // 保存记住我的设置
    setRememberMe(remember, account, password) {
      this.rememberMe = remember
      setRememberPassword(remember)
      setRememberUsername(account)
      
      if (remember) {
        setStoredPassword(password)
      }
    },

    // 获取记住的登录信息
    getRememberedLogin() {
      return {
        account: getRememberUsername() || '',
        password: getRememberPassword() ? (getStoredPassword() || '') : '',
        remember: getRememberPassword() || false
      }
    },

    // 登录操作
    async login(loginForm) {
      try {
        const { account, password, remember } = loginForm
        // 只发送用户名和密码给后端，不发送记住密码标记
        const response = await login({ account, password })
        
        // 保存token
        this.setToken(response.token)
        
        // 保存用户信息
        this.setUserInfo(response.userInfo || { account })
        
        // 保存记住登录信息
        this.setRememberMe(remember, account, password)
        
        return response
      } catch (error) {
        throw error
      }
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.setUserInfo(data)
        return data
      } catch (error) {
        throw error
      }
    },

    // 登出操作
    async logout() {
      try {
        // await logout()
        console.log('登出');
        
      } catch (error) {
        console.error('登出请求失败:', error)
      } finally {
        // 无论如何都清除本地数据
        this.resetUser()
      }
    },

    // 重置用户状态
    resetUser() {
      this.token = ''
      this.userInfo = {}
      clearAuth()
    }
  }
}) 