import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 使用环境变量中定义的 API 基础路径
  timeout: 30000, // 请求超时时间 30s
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log('请求URL:', config.url)
    console.log('完整请求地址:', config.baseURL + config.url)
    
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('响应数据:', res)
    
    // 如果返回的是文件流，直接返回
    if (response.config.responseType === 'blob') {
      return res
    }
    
    // 后端可能有不同的数据格式，需要适配
    // 情况1: { code: 200, data: {}, message: '' }
    if (res.code !== undefined) {
      if (res.code !== 200) {
        ElMessage.error(res.msg || '服务器响应异常')
        
        // 处理特定错误码
        if (res.code === 401) {
          // token 过期或未登录
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')

          // 跳转到登录页
          return
        }
        
        return Promise.reject(new Error(res.msg || '服务器响应异常'))
      }
      
      return res.data
    }
    
    // 情况2: 直接返回数据
    return res
  },
  error => {
    console.error('响应错误:', error)
    
    // 处理响应错误
    let message = error.message
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 清除 token 并跳转登录页
          localStorage.removeItem('token')
          localStorage.removeItem('isAdmin')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址出错'
          break
        case 408:
          message = '请求超时'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 501:
          message = '服务未实现'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 封装 GET 请求
export function get(url, params) {
  return service({
    url,
    method: 'get',
    params
  })
}

// 封装 POST 请求
export function post(url, data) {
  return service({
    url,
    method: 'post',
    data
  })
}

// 封装 PUT 请求
export function put(url, data) {
  return service({
    url,
    method: 'put',
    data
  })
}

// 封装 DELETE 请求
export function del(url, params) {
  return service({
    url,
    method: 'delete',
    params
  })
}

// 导出 axios 实例
export default service 