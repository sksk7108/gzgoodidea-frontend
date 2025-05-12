import { get, post, put, del } from '@/utils/request'

/**
 * 获取视频列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getVideoList(params) {
  return get('/api/videos', params)
}

/**
 * 获取视频详情
 * @param {String} id - 视频ID
 * @returns {Promise}
 */
export function getVideoDetail(id) {
  return get(`/api/videos/${id}`)
}

/**
 * 根据标签获取视频
 * @param {String} tag - 标签
 * @param {Object} params - 其他查询参数
 * @returns {Promise}
 */
export function getVideosByTag(tag, params) {
  return get('/api/videos/list', { ...params, keywords: tag })
}

/**
 * 根据来源获取视频
 * @param {String} source - 视频来源
 * @param {Object} params - 其他查询参数
 * @returns {Promise}
 */
export function getVideosBySource(source, params) {
  return get('/api/videos/list', { ...params, hotSource: source })
}

/**
 * 通过视频审核
 * @param {String} id - 视频ID
 * @returns {Promise}
 */
export function auditVideoStatus(id, data) {
  return put(`/api/videos/${id}/audit?status=${data.status}`)
}


/**
 * 删除视频
 * @param {String} id - 视频ID
 * @returns {Promise}
 */
export function deleteVideo(id) {
  return del(`/api/videos/${id}`)
} 