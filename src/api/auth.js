// auth.js - 用户认证相关 API 请求
import { post, get } from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data 登录参数
 * @param {string} companyId 公司ID
 * @param {string} data.account 用户名
 * @param {string} data.password 密码
 * @returns {Promise}
 */
export function login(companyId,data) {
  return post(`/employee/login/${companyId}`, data)
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

/**
 * 更新用户信息
 * @param {FormData} data 包含用户名和头像的表单数据
 * @returns {Promise}
 */
export function updateUserProfile(data) {
  return post('/employee/updateProfile', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 修改密码
 * @param {Object} data 密码数据
 * @param {string} data.oldPassword 旧密码
 * @param {string} data.newPassword 新密码
 * @returns {Promise}
 */
export function updatePassword(data) {
  return post('/employee/update-password', data)
} 