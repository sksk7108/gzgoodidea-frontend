import request from '@/utils/request'

/**
 * 获取矩阵列表
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getMatrixList(params) {
  return request({
    url: '/matrixes',
    method: 'get',
    params
  })
}

/**
 * 获取矩阵详情
 * @param {String|Number} id 矩阵ID
 * @returns {Promise}
 */
export function getMatrixDetail(id) {
  return request({
    url: `/matrix/${id}`,
    method: 'get'
  })
}

/**
 * 创建矩阵
 * @param {Object} data 矩阵数据
 * @returns {Promise}
 */
export function createMatrix(data) {
  return request({
    url: '/matrix',
    method: 'post',
    data
  })
}

/**
 * 更新矩阵
 * @param {String|Number} id 矩阵ID
 * @param {Object} data 更新数据
 * @returns {Promise}
 */
export function updateMatrix(id, data) {
  return request({
    url: `/matrix`,
    method: 'put',
    data: {id, ...data}
  })
}

/**
 * 删除矩阵
 * @param {String|Number} id 矩阵ID
 * @returns {Promise}
 */
export function deleteMatrix(id) {
  return request({
    url: `/matrix/${id}`,
    method: 'delete'
  })
} 