/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import {BASE_URL} from './common'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

/**
 * 获取事故数据
 * @param params
 */
export const getAccidents = params => {
  return axios.post(`${base}/report/aggregate.json`, params).then(res => res.data)
}
/**
 * 获取事故监测事故列表数据
 * @param params
 */
export const getAccidentsList = params => {
  return axios.post(`${base}/accident/findByDate`, params).then(res => res.data)
}
/**
 * 获取事故监测事故列表数据
 * @param params
 */
export const getAccidentsCompanyName = (params, name) => {
  return axios.post(`${base}/accident/findByCompanyFullNameLike?companyFullName=` + name, params).then(res => res.data)
}
/**
 * 获取事故监测关键词
 * @param params
 */
export const getAccidentMonitorKeyWords = params => {
  return axios.get(`${base}/accidentYuqing/keyWords/` + params).then(res => res.data)
}
/**
 * 获取事故内容
 * @param params
 */
export const getAccidentContent = params => {
  return axios.get(`${base}/accident/findById/` + params).then(res => res.data)
}
