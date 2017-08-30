/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import qs from 'querystring'
import {typeUtil} from '@/utils/typeUtil'
import {dateUtil} from '@/utils/dateUtil'
import {utils} from '@/utils/utils'
import {BASE_URL} from './common'
let base = BASE_URL
let AUTH_TOKEN = localStorage.getItem('access-user')
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
/**
 * 获取去重后的文章列表 POST /es/deDuplicationSearch
 * @param params
 */
export const getDeduplicationArticles = params => {
  return axios.post(`${base}/es/deDuplicationSearch`, params).then(res => {
    let {displayConfig} = params
    let {data} = res
    let renderData = []
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig))
      })
    }
    data.content = renderData
    data.content.forEach(function (item) {
      item.isSearch = true
    })
    return data
  })
}
/**
 * 获取焦点报道的文章列表 POST /es/titleTimeAxis
 * @param params
 */
export const getFocusArticles = params => {
  return axios.post(`${base}/es/titleTimeAxis`, params).then(res => {
    let {displayConfig} = params
    let {data} = res
    let renderData = []
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig))
      })
    }
    data.content = renderData
    return data
  })
}
/**
 * 获取未去重的文章列表 POST /es/findPageByMustShouldDateInType
 * @param params
 */
export const getArticles = params => {
  return axios.post(`${base}/es/findPageByMustShouldDateInType`, params).then(res => {
    let {displayConfig} = params
    let {data} = res
    let renderData = []
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig))
      })
    }
    data.content = renderData
    return data
  })
}

/**
 * 处理文章结果
 * @param item
 * @param displayConfig
 * @returns {*}
 */
function handlerArticleItem(item, displayConfig) {
  displayConfig = displayConfig || {}
  let {sourceLength = 6, titleLength = 15, heightLightWords} = displayConfig
  item.type = item.type.toLowerCase()
  item.nlp.sentiment.label = typeUtil.sentimentType(item.nlp.sentiment.label)
  if (item.type === 'weibo') {
    item.title = item.content
    item.source = (item.author !== undefined && item.author !== null) ? item.author : '未知'
    item.dev = (item.dev !== undefined && item.dev !== null && item.dev !== '') ? item.dev : '未知'
  } else {
    item.source = (item.source !== undefined && item.source !== null) ? item.source : (item.author !== undefined && item.author !== null) ? item.author : '未知'
  }
  if (item.type === 'bbs') {
    item.title = item.title && item.title.length > 0 ? item.title : item.content.substring(0, 50)
  }
  item.collected = false // set the default value for collection.
  item.pubTime = dateUtil.formatDate(new Date(item.pubTime), 'yyyy/MM/dd')
  if (item.source.length > sourceLength) {
    item.source = item.source.substring(0, sourceLength - 1) + '...'
  }
  item.title = utils.heightLightKeywords(item.title, titleLength, '...', heightLightWords)
  item.content = utils.heightLightKeywords(item.content, 160, '...', heightLightWords)
  return item
}

/**
 * 获取用户收藏文章 POST /collect/searchCollect
 * @param params
 */
export const getCollections = params => {
  return axios.post(`${base}/collect/searchCollect`, params).then(res => {
    // let {displayConfig} = params
    // let {data} = res
    // let renderData = []
    // if (data.content.length > 0) {
    //   data.content.forEach(function (item) {
    //     renderData.push(handlerArticleItem(item.esBaseDomain, displayConfig))
    //   })
    // }
    // data.content = renderData
    // data.content.forEach(function (item) {
    //   item.isChecked = false
    //   item.collected = false
    //   item.collectTime = dateUtil.formatDate(new Date(item.dateCreated), 'yyyy/MM/dd hh:mm:ss')
    // })
    // return data
    let {displayConfig} = params
    let {data} = res
    let collectData = {}
    let renderData = []
    collectData.totalElements = data.totalElements
    collectData.content = []
    data.content.forEach(function (item) {
      let node = item.esBaseDomain || {}
      node.collectTime = dateUtil.formatDate(new Date(item.dateCreated), 'yyyy/MM/dd hh:mm:ss')
      if (item.esBaseDomain) {
        collectData.content.push(node)
      }
    })

    if (collectData.content.length > 0) {
      collectData.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig))
      })
    }
    collectData.content = renderData
    collectData.content.forEach(function (item) {
      item.isChecked = false
      item.collected = true
    })
    return collectData
  })
}

/**
 * 统计查询接口 POST /es/filterAndGroupBy
 * 专题的预估量也是调用该接口
 * @param params
 */
export const getFilterAndGroupBy = params => {
  return axios.post(`${base}/es/filterAndGroupBy`, params).then(res => res.data)
}
/**
 * 网民观点评论查询接口
 */
export const getViewPort = params => {
  return axios.post(`${base}/comments/viewport`, params).then(res => res.data)
}

/**
 * 统计查询时间趋势接口 POST /es/filterAndGroupByTime
 * @param params
 * @param gapParams
 */
export const getFilterAndGroupByTime = (params, gapParams) => {
  return axios.post(`${base}/es/filterAndGroupByTime?` + qs.stringify(gapParams), params).then(res => res.data)
}
/**
 * 微博地域接口
 * @param params
 * @param gapParams
 */
export const getWeiboFilterAndGroupBy = params => {
  return axios.post(`${base}/weiboUser/filterAndGroupBy`, params).then(res => res.data)
}
/**
 * 热点微博接口
 * @param params
 * @param gapParams
 */
export const getHotWeibo = params => {
  return axios.post(`${base}/weibo/hotWeibo`, params).then(res => {
    return handlerArticleDeta(res.data)
  })
}
/**
 * add article to collections
 * @param params
 */
export const addTOCollection = params => {
  return axios.get(`${base}/collect/saveCollect2ES.json`, {params: params}).then(res => res.data)
}

/**
 * delete article from the collections
 * @param params
 */
export const deleteFromCollection = params => {
  return axios.get(`${base}/collect/deleteCollectedInOid.json`, {params: params}).then(res => res.data)
}

/**
 * 批量删除我的收藏
 * @param params
 */
export const deleteBatchCollection = params => {
  return axios.get(`${base}/collect/deleteCollectedInOid?oIds=` + params.join(',')).then(res => res.data)
}

/**
 * get the article in collections or nor by article id.
 * @param params
 */
export const hasExitInCollections = params => {
  return axios.get(`${base}/collect/hasCollected.json`, {params: params}).then(res => res.data)
}

/**
 * 根据文章的Id查询文章详情 GET /es/findById/{id}
 * @param params
 * displayConfig 为文章详情的一些展示配置，如当搜索页面通过关键词搜索出文章时，文章详情中要高亮搜索关键词
 */
export const getArticleDetail = params => {
  let {id, displayConfig} = params
  return axios.get(`${base}/news/findById/` + id).then(res => {
    return handlerArticleDetailItem(res.data, displayConfig)
  })
}
function handlerArticleDeta(item) {
  item.content.forEach(function (index) {
    index.pubTime = dateUtil.formatDate(new Date(index.pubTime), 'yyyy/MM/dd')
  })
  return item
}
/**
 * 处理文章详情结果
 * @param item
 * @param displayConfig
 * @returns {*}
 */
// TODO： 文章处理结果还要完善
function handlerArticleDetailItem(item, displayConfig) {
  displayConfig = displayConfig || {}
  let {sourceLength = 6, titleLength = 20, heightLightWords} = displayConfig
  item.type = item.type.toLowerCase()
  item.nlp.sentiment.label = typeUtil.sentimentType(item.nlp.sentiment.label)
  if (item.nlp.keywords.length > 10) {
    item.nlp.keywords.length = 10
  }
  item.nlp.keywords = item.nlp.keywords.join(' ').replace(/&nbsp/ig, '')
  item.source = (item.source !== undefined && item.source !== null) ? item.source : (item.author !== undefined && item.author !== null) ? item.author : '未知'

  if (item.type === 'weibo') {
    item.title = item.content
    item.source = (item.author !== undefined && item.author !== null) ? item.author : '未知'
    item.dev = (item.dev !== undefined && item.dev !== null && item.dev !== '') ? item.dev : '未知'
  } else {
    item.source = (item.source !== undefined && item.source !== null) ? item.source : (item.author !== undefined && item.author !== null) ? item.author : '未知'
  }
  if (item.type === 'bbs') {
    item.title = item.title && item.title.length > 0 ? item.title : item.content.substring(0, 50)
  }
  if (item.type === 'bar') {
    item.title = item.title && item.title.length > 0 ? item.title : item.content.substring(0, 50)
  }

  item.collected = false // set the default value for collection.
  item.pubTime = dateUtil.formatDate(new Date(item.pubTime), 'yyyy/MM/dd')
  if (item.source.length > sourceLength) {
    item.source = item.source.substring(0, sourceLength - 1) + '...'
  }
  item.title = utils.heightLightKeywords(item.title, titleLength, '...', heightLightWords)
  item.content = utils.heightLightKeywords(item.content, item.content.length, '...', heightLightWords)

  return item
}

/**
 * 根据条件统计文章的关键词 POST /es/hotWords
 * @param params
 */
export const getHotWords = params => {
  return axios.post(`${base}/es/hotWords`, params).then(res => res.data)
}

/**
 * 根据文章ID统计文章的关键词 GET /keywords/hotkeywords
 * @param params
 */
export const getDetailHotWords = params => {
  return axios.get(`${base}/keywords/hotkeywords`, {params: params}).then(res => res.data)
}
/*
 * 历史预警预览
 * */
export const getWarningDetails = (params, id) => {
  return axios.get(`${base}/warningLog/info/` + id, {params: params}).then(res => {
    let {displayConfig} = params
    let {data} = res
    let renderData = []
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig))
      })
    }
    data.content = renderData
    return data
  })
}
/**
 * 根据文章ID显示评论 POST /es/findPageByMustShouldDateInType
 * @param params
 */
export const getArticleComment = params => {
  return axios.post(`${base}/es/findPageByMustShouldDateInType`, params).then(res => res.data)
}
/**
 * 根据文章ID统计评论情感分析与评论网民分析 地区分布 GET /es/filterAndGroupBy.json
 * @param params
 */
export const getCommentTypeChart = params => {
  return axios.get(`${base}/es/filterAndGroupBy.json`, {params: params}).then(res => res.data)
}
/**
 * 根据文章ID统计评论热点词云 GET /es/hotWords.jsons
 * @param params
 */
export const getCommentHotwords = params => {
  return axios.get(`${base}/es/hotWords.json`, {params: params}).then(res => res.data)
}

