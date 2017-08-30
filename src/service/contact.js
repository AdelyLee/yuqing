/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import {BASE_URL} from './common'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
/**
 * 获取用户联系人 POST /contact/findByUser
 * @param params
 */
export const getContacts = params => {
  return axios.post(`${base}/contact/findByType`, params).then(res => res.data)
}
/**
 * 添加用户联系人 POST /contact/
 * @param params
 */
export const addContact = params => {
  return axios.post(`${base}/contact/`, params).then(res => res.data)
}
/**
 * 编辑用户联系人 PUT /contact/{id}
 * @param params
 */
export const editContact = params => {
  return axios.put(`${base}/contact/` + params.id, params).then(res => res.data)
}
/**
 * 删除用户联系人 DELETE /contact/findByUser
 * @param params
 */
export const deleteContact = params => {
  return axios.delete(`${base}/contact/` + params.id).then(res => res.data)
}
/**
 * 添加微信联系人 POST /contact/
 * @param params
 */
export const createNickname = params => {
  return axios.get(`${base}/subscriptionFollower/scanFollower` + '?wechatName=' + params.nickname).then(res => res.data)
}
