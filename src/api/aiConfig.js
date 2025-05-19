import { get, post, del } from '@/utils/request'
import { put } from '../utils/request'

/**
 * 获取AI配置
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getPrompt(params) {
  return get('/ai/resources/prompts', params)
}

/**
 * 保存Prompt
 * @param {Object} data - 新增数据
 * @returns {Promise}
 */
export function savePrompt(data) {
  return put('/ai/resources/prompts', data)
}

/**
* 获取知识库
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getKnowledge(params) {
  return get('/ai/resources/knowledge', params)
}

/**
 * 保存知识库
 * @param {Object} data - 新增数据
 * @returns {Promise}
 */
export function saveKnowledge(data) {
  return put('/ai/resources/knowledge', data)
}