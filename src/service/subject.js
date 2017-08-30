/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import {dateUtil} from '@/utils/dateUtil'
import {utils} from '@/utils/utils'
import {BASE_URL} from './common'
let base = BASE_URL

let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
/**
 * 根据用户获取用户专题 POST /customSubject/findByUser
 * @param params
 */
export const getSubjects = params => {
  return axios.post(`${base}/customSubject/findByUser`, params).then(res => {
    let {data} = res
    let {page} = params
    let renderData = []
    if (data.content.length > 0) {
      data.content.forEach(function (item, index) {
        renderData.push(handlerSubjectItem(item, index, page))
      })
    }
    data.content = renderData

    return data
  })
}
/**
 * 获取专题关键字和时间
 * @param params
 */
export const getSpecialKeyWords = params => {
  return axios.get(`${base}/customSubject/` + params).then(res => res.data)
}

/**
 * 获取预警的关键字和时间和名字
 * @param params
 */
export const getWarningKeyWords = params => {
  return axios.get(`${base}/warningLog/` + params).then(res => res.data)
}
/**
 * 处理专题列表结果
 * @param item
 * @param index
 * @param params
 * @returns {*}
 */
function handlerSubjectItem(item, index, params) {
  let {limit, page} = params
  let skip = limit * (page - 1)
  let subject = utils.decodeSubject(item)
  subject.number = skip + index + 1
  subject.startFormatDate = dateUtil.formatDate(subject.startDate, 'yyyy-MM-dd')
  subject.endFormatDate = dateUtil.formatDate(subject.endDate, 'yyyy-MM-dd')

  return item
}
/**
 * 新建专题 POST /customSubject/
 * @param params
 */
export const addSubject = params => {
  return axios.post(`${base}/customSubject/`, params).then(res => res.data)
}
/**
 * 修改专题 PUT /customSubject/{id}
 * @param params
 */
export const editSubject = params => {
  params = handlerSaveSubjectItem(params)
  return axios.put(`${base}/customSubject/` + params.id, params).then(res => res.data)
}
/**
 * 处理保存专题
 * @param params
 * @returns {*}
 */
function handlerSaveSubjectItem(params) {
  let subject = utils.encodeSubject(params)
  delete subject.number
  delete subject.estimate

  return subject
}
/**
 * 更新专题报告 GET /customSubject/updateReport/{id}
 * @param params
 */
export const updateCustomSubjectReport = params => {
  return axios.get(`${base}/customSubject/updateReport/` + params.id).then(res => res.data)
}

/**
 * 删除专题 DELETE /customSubject/{id}
 * @param params
 */
export const deleteSubject = params => {
  return axios.delete(`${base}/customSubject/` + params.id).then(res => res.data)
}
