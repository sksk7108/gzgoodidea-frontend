// auth.js - 用户认证相关的本地存储管理

// Token 存储键名
const TOKEN_KEY = 'auth_token'
// 用户信息存储键名
const USER_INFO_KEY = 'user_info'
// 记住用户名存储键名
const REMEMBER_USERNAME_KEY = 'remember_username'
// 记住密码标记
const REMEMBER_PASSWORD_KEY = 'remember_password'
// 存储的密码键名
const STORED_PASSWORD_KEY = 'stored_password'

/**
 * 存储 Token 到本地
 * @param {string} token
 */
export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

/**
 * 从本地获取 Token
 * @returns {string|null}
 */
export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

/**
 * 移除本地存储的 Token
 */
export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

/**
 * 存储用户信息到本地
 * @param {Object} userInfo
 */
export function setUserInfo(userInfo) {
  sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

/**
 * 从本地获取用户信息
 * @returns {Object|null}
 */
export function getUserInfo() {
  const userInfo = sessionStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * 移除本地存储的用户信息
 */
export function removeUserInfo() {
  sessionStorage.removeItem(USER_INFO_KEY)
}

/**
 * 设置记住用户名
 * @param {string} username
 */
export function setRememberUsername(username) {
  localStorage.setItem(REMEMBER_USERNAME_KEY, username)
}

/**
 * 获取记住的用户名
 * @returns {string|null}
 */
export function getRememberUsername() {
  return localStorage.getItem(REMEMBER_USERNAME_KEY)
}

/**
 * 设置记住密码标记
 * @param {boolean} isRemember
 */
export function setRememberPassword(isRemember) {
  localStorage.setItem(REMEMBER_PASSWORD_KEY, isRemember ? '1' : '0')
}

/**
 * 获取记住密码标记
 * @returns {boolean}
 */
export function getRememberPassword() {
  return localStorage.getItem(REMEMBER_PASSWORD_KEY) === '1'
}

/**
 * 存储密码
 * @param {string} password
 */
export function setStoredPassword(password) {
  localStorage.setItem(STORED_PASSWORD_KEY, password)
}

/**
 * 获取存储的密码
 * @returns {string|null}
 */
export function getStoredPassword() {
  return localStorage.getItem(STORED_PASSWORD_KEY)
}

/**
 * 清除所有认证相关数据
 */
export function clearAuth() {
  removeToken()
  removeUserInfo()
  // 注意：不清除记住的用户名和密码，这样下次登录时仍然可以使用
} 