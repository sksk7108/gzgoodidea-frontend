// auth.js - 用户认证相关 API 请求
import { post, get } from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data 登录参数
 * @param {string} data.account 用户名
 * @param {string} data.password 密码
 * @returns {Promise}
 */
export function login(data) {
  return post('/employee/login', data)
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return get('/employee/info')
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return post('/employee/logout')
} 