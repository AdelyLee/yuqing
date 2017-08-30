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
