/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import qs from 'querystring'
import {BASE_URL} from './common'
let base = BASE_URL

/**
 * 账号密码登录
 * @param params
 */
export const accountLogin = params => {
  return axios.post(`${base}/login/login`, qs.stringify(params)).then(res => res.data)
}

/**
 *  获取登录用户信息 GET /userStyle/findUserStyleByUser
 * @param params
 */
export const getUserConfig = params => {
  return axios.get(`${base}/userStyle/findUserStyleByUser`).then(res => res.data)
}

/**
 *  修改用户主题等配置信息 POST /userStyle/setUserStyle
 * @param params
 */
export const editUserConfig = params => {
  return axios.post(`${base}/userStyle/setUserStyle`, params).then(res => res.data)
}

