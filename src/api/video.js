import { get, post, put, del } from '@/utils/request'

/**
 * 获取视频列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getVideoList(params) {
  return get('/videos', params)
}

/**
 * 获取视频详情
 * @param {String} id - 视频ID
 * @returns {Promise}
 */
export function getVideoDetail(id) {
  return get(`/videos/${id}`)
}

/**
 * 根据标签获取视频
 * @param {String} tag - 标签
 * @param {Object} params - 其他查询参数
 * @returns {Promise}
 */
export function getVideosByTag(tag, params) {
  return get('/videos/list', { ...params, keywords: tag })
}

/**
 * 根据来源获取视频
 * @param {String} source - 视频来源
 * @param {Object} params - 其他查询参数
 * @returns {Promise}
 */
export function getVideosBySource(source, params) {
  return get('/videos/list', { ...params, hotSource: source })
}

/**
 * 通过视频审核
 * @param {String} id - 视频ID
 * @returns {Promise}
 */
export function auditVideoStatus(id, data) {
  return put(`/videos/${id}/audit?status=${data.status}`)
}


/**
 * 删除视频
 * @param {String} id - 视频ID
 * @returns {Promise}
 */
export function deleteVideo(id) {
  return del(`/videos/${id}`)
}

/**
 * 收藏/取消收藏视频
 * @param {String} videoId - 视频ID
 * @param {Boolean} isCollected - 是否收藏
 * @returns {Promise}
 */
export function toggleVideoFavorite(videoId, isCollected) {
  return put(`/employee/collect`, { videoId, isCollected })
}

/**
 * 添加文案
 * @param {Object} data - 文案数据
 * @returns {Promise}
 */
export function addVideoCopywriting(data) {
  return post('/employee/collect', data)
}

/**
 * 修改视频文案
 * @param {Object} data - 文案数据
 * @returns {Promise}
 */
export function updateVideoCopywriting(data) {
  return post('/employee/collect', data)
}

/**
 * 删除文案
 * @param {String} id - 文案ID
 * @param {Boolean} isCollected - 是否收藏
 * @returns {Promise}
 */
export function deleteVideoCopywriting(id, isCollected) {
  return post(`/employee/collect`, { id, isCollected })
}

/**
 * 获取收藏视频列表
 * @returns {Promise}
 */
export function getCollectedVideos(params) {
  return get('/employee/collects', params)
}

/**
 * 编辑保存视频信息
 * @param {Object} data - 视频数据
 * @returns {Promise}
 */
export function saveVideoInfo(data) {
  return put(`/videos/${data.id}`, data)
}