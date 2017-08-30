/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import qs from 'querystring'
import {dateUtil} from '@/utils/dateUtil'
import {BASE_URL} from './common'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
/**
 * 根据用户获取用户报告 POST /briefing/search
 * @param params
 */
export const getReports = params => {
  return axios.post(`${base}/briefing/search`, params).then(res => {
    let {data} = res
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        item.createTime = dateUtil.formatDate(new Date(item.dateCreated), 'yyyy/MM/dd')
      })
    }

    return data
  })
}
/**
 * 删除用户专报 DELETE /briefing/{id}
 * @param params
 */
export const deleteReport = params => {
  return axios.delete(`${base}/briefing/` + params.id).then(res => res.data)
}
/**
 * 根据用户获取用户报告设置 POST /briefingTask/findByType?briefingType=
 * @param params
 */
export const getReportSetting = params => {
  return axios.post(`${base}/briefingTask/findByType?` + qs.stringify(params)).then(res => {
    let {data} = res
    data.cronExpression.hour = data.cronExpression.hour + ':00'

    return data
  })
}
/**
 * 保存用户报告设置 PUT /briefingTask/
 * @param params
 */
export const editReportSetting = params => {
  return axios.put(`${base}/briefingTask/` + params.id, params).then(res => res.data)
}
/**
 * 获取报告数据 GET /briefing/detail/{id}
 * @param params
 */
export const getBriefingJson = params => {
  return axios.get(`${base}/briefing/detail/` + params.id).then(res => res.data)
}
