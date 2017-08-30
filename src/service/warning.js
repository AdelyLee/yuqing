/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import {BASE_URL} from './common'
import {dateUtil} from '@/utils/dateUtil'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

/**
 * 获取专题预警数据
 * @param params
 */
export const getWarnings = params => {
  return axios.post(`${base}/warningLog/search`, params).then(res => {
    let {data} = res
    let renderData = []
    if (data.content.length > 0) {
      data.content.forEach(function (item, index) {
        renderData.push(handlerWarningItem(item, index, params))
      })
    }
    data.content = renderData

    return data
  })
}
/**
 * 获取历史预警数据
 * @param params
 */
export const getHistoryWarnings = (params, id) => {
  return axios.post(`${base}/warningLog/subject/` + id, params).then(res => res.data)
}
/**
 *删除历史预警
 * @param params
 */
export const deleteHistoryWarnings = (params) => {
  return axios.delete(`${base}/warningLog/` + params).then(res => res.data)
}
/**
 * 处理专题列表结果
 * @param item
 * @param index
 * @param params
 * @returns {*}
 */
function handlerWarningItem(item, index, params) {
  let {limit, page} = params.page
  let skip = limit * (page - 1)
  item.number = skip + index + 1
  item.dateCreated = dateUtil.formatDate(new Date(item.dateCreated), 'yyyy-MM-dd hh:mm:ss')

  return item
}
