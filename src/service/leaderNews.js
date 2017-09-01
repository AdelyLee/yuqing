/**
 * Created by Administrator on 2017/8/31.
 */
import axios from 'axios'
import {BASE_URL} from './common'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
/**
 * 获得树形结构词库数据
 * @param params
 * @param name
 */
export const getDragTree = params => {
  return axios.get(`${base}/organizationalStructure/getTree.json`, {params: params}).then(res => res.data)
}
