import request from '@/utils/request'

/**
 * 获取对标账号列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getBenchmarkAccounts(params) {
  return request({
    url: '/api/videoAccount',
    method: 'get',
    params
  })
}

/**
 * 添加对标账号
 * @param {Object} data 账号数据
 * @returns {Promise}
 */
export function addBenchmarkAccount(data) {
  return request({
    url: '/api/videoAccount',
    method: 'post',
    data
  })
}

/**
 * 更新对标账号
 * @param {String} id 账号ID
 * @param {Object} data 账号数据
 * @returns {Promise}
 */
export function updateBenchmarkAccount(id, data) {
  return request({
    url: `/api/videoAccount/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除对标账号
 * @param {String} id 账号ID
 * @returns {Promise}
 */
export function deleteBenchmarkAccount(id) {
  return request({
    url: `/api/videoAccount/${id}`,
    method: 'delete'
  })
}

/**
 * 触发对标账号数据爬取
 * @param {String} id 账号ID
 * @returns {Promise}
 */
export function crawlBenchmarkAccount(id) {
  return request({
    url: `/api/videoAccount/${id}/crawl`,
    method: 'post'
  })
} 