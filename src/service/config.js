/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import {
  BASE_URL
} from './common'
// import qs from 'querystring'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
/**
 * 获取用户相关关键词
 * @param params
 */
export const getKeywords = params => {
  return axios.get(`${base}/keywords/findByType`, {
    params: params
  }).then(res => res.data)
}
/**
 * 编辑用户相关关键词
 * @param params
 */
export const editKeywords = params => {
  return axios.put(`${base}/keywords/` + params.id, params).then(res => res.data)
}
