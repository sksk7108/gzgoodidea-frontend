import { get, post, del, put } from '@/utils/request'

/**
 * 获取关键词列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getKeywordList(params) {
  return get('/keywords', params)
}

/**
 * 获取关键词列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getKeywordGroupsList() {
    return get('/employee/keywords')
}

/**
 * 新增关键词
 * @param {Object} data - 关键词数据
 * @returns {Promise}
 */
export function addKeyword(data) {
  return post('/keywords', data)
}

/**
 * 删除关键词
 * @param {String} id - 关键词ID
 * @returns {Promise}
 */
export function deleteKeyword(id) {
  return del(`/employee/keyword/${id}`)
}

/**
 * 更新关键词
 * @param {Object} data - 关键词数据
 * @returns {Promise}
 */
export function updateKeyword(data) {
  return put(`/employee/keyword`, data)
}
