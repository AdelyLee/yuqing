/**
 * Created by Administrator on 2017/8/24.
 */
import axios from 'axios'
import {BASE_URL} from './common'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

  /**
   * 获取关键词
   * @param params
   * @param gapParams
   */
export const getThesaurus = (params, name) => {
  return axios.post(`${base}/word/searchWordByStatus/` + '?status=' + name, params).then(res => res.data)
}
/**
 * 搜索关键词
 * @param params
 * @param name
 */
export const getSearchThesaurus = (params, name) => {
  return axios.post(`${base}/word/findByWordName/` + name, params).then(res => res.data)
}
/**
 * 点击树形词库右面关键词变化
 * @param params
 * @param name
 */
export const getLibraryThesaurus = (params, name) => {
  return axios.post(`${base}/word/findByLibraryName/` + name, params).then(res => res.data)
}
/**
 * 获得树形结构词库数据
 * @param params
 * @param name
 */
export const getTree = params => {
  return axios.get(`${base}/library/getTreeByUser/`, {params: params}).then(res => res.data)
}
/**
 * 修改树形结构词库数据
 * @param params
 * @param name
 */
export const editTree = (params, treeName) => {
  return axios.put(`${base}/library/` + treeName.id, params).then(res => res.data)
}
/**
 * 添加树形结构节点
 * @param params
 * @param name
 */
export const addTree = params => {
  return axios.post(`${base}/library/`, params).then(res => res.data)
}
/**
 * 删除树形结构节点
 * @param params
 * @param name
 */
export const removeTree = params => {
  return axios.delete(`${base}/library/` + params.id).then(res => res.data)
}
/**
 * 添加词库
 * @param params
 * @param name
 */
export const getAddWords = params => {
  return axios.post(`${base}/word/`, params).then(res => res.data)
}
/**
 * 修改词库
 * @param params
 * @param name
 */
export const editThesaurus = (params, id) => {
  return axios.put(`${base}/word/` + id, params).then(res => res.data)
}
/**
 * 删除词库
 * @param params
 * @param name
 */
export const deleteThesaurus = params => {
  return axios.delete(`${base}/word/` + params.id).then(res => res.data)
}
/**
 * 拼音查询词库
 * @param params
 * @param name
 */
export const getPinyinThesaurus = (params, libraryId, pinyin) => {
  return axios.post(`${base}/word/searchWordByPinyin/` + libraryId + '?firstPinyin=' + pinyin, params).then(res => res.data)
}
