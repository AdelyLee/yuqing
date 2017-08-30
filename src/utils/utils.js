/**
 * Created by lyc on 17-6-6.
 */
import {getKeywords} from '@/service/config'
import {dateUtil} from '@/utils/dateUtil'
import {typeUtil} from '@/utils/typeUtil'

export const utils = {
  /**
   * 动态加载css文件
   * @param path
   */
  dynamicLoadingCss: function (path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !')
    }
    let head = document.getElementsByTagName('head')[0]
    let link = document.createElement('link')
    link.id = 'theme'
    link.href = path
    link.rel = 'stylesheet'
    link.type = 'text/css'
    head.appendChild(link)
  },
  /**
   * 动态加载css文件
   * @param path
   */
  deleteThemeCss: function () {
    let head = document.getElementsByTagName('head')[0]
    let link = document.getElementById('theme')
    if (link) {
      head.removeChild(link)
    }
  },
  /**
   * 动态加载js文件
   * @param path
   */
  dynamicLoadingJs: function (path) {
    if (!path || path.length === 0) {
      throw new Error('argument "path" is required !')
    }
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.src = path
    script.type = 'text/javascript'
    head.appendChild(script)
  },
  /**
   * 获取项目根路径
   * @returns {*|string}
   */
  getBasePath: function () {
    let href = window.location.href
    let pathname = window.location.pathname
    let index = href.indexOf(pathname)

    return href.substring(0, index)
  },
  /**
   * 获取URL中的变量
   * @param letiable
   * @returns {*}
   */
  getQueryVariable: function (letiable) {
    let query = ''
    if (window.location.hash) {
      query = window.location.hash.split('?')[1]
    } else if (window.location.search) {
      query = window.location.search.substring(1)
    }
    let lets = query.split('&')
    for (let i = 0; i < lets.length; i++) {
      let pair = lets[i].split('=')
      if (pair[0] === letiable) {
        return pair[1]
      }
    }
    return (false)
  },

  /**
   * 截取字符串，显示字符串中高亮词
   * @param content
   * @param length
   * @param append
   * @param keywords
   * @param divider
   * @returns {*}
   */
  heightLightKeywords: function (content, length, append, keywords, divider) {
    let scriptPattern = '<script[^>]*?>[\\s\\S]*?</script>' // 匹配js标签
    let stylePattern = '<style[^>]*?>(([\\s\\S])*?)</style>' // 匹配style标签
    let tagPattern = '<[^>].*?>' // 匹配html标签

    if (!content) {
      return ''
    }
    let temp
    content = content.replace(new RegExp('&#60', 'gm'), '<')
    content = content.replace(new RegExp('&#62', 'gm'), '>')
    content = content.replace(new RegExp('<!--', 'gm'), '<style>')
    content = content.replace(new RegExp('-->', 'gm'), '</style>')
    content = content.replace(new RegExp(scriptPattern, 'gi'), '')
    content = content.replace(new RegExp(stylePattern, 'gi'), '')
    content = content.replace(new RegExp(tagPattern, 'gi'), '')
    if (divider === undefined) {
      divider = '@'
    }
    if (content.length < length) {
      length = content.length
    }
    temp = content.substring(0, length)
    if (length !== content.length && append !== '') {
      temp += append
    }
    let ks = []
    if (typeof (keywords) !== 'undefined') {
      if (keywords.constructor !== Array) { // 如果不是数组,则形式为a@b@c,先分割为数组
        ks = keywords.split(divider)
        // 去除为''的元素
        for (let i = 0; i < ks.length; i++) {
          if (ks[i].replace(/(^\s*)|(\s*$)/g, '') === '') {
            ks.splice(i)
          }
        }
      } else {
        ks = keywords
      }
      for (let i = 0; i < ks.length; i++) {
        temp = temp.replace(new RegExp(ks[i], 'gm'), '<font style="color: red">' + ks[i] + '</font>')
      }
    }

    return temp
  },
  /**
   * 截取文章详情字符串，显示字符串中高亮词
   * @param content
   * @param length
   * @param append
   * @param keywords
   * @param divider
   * @className
   * @returns {*}
   */
  detailHeightLightKeywords: function (content, length, append, keywords, divider, className) {
    if (!content) {
      return ''
    }
    let temp
    content = content.replace(new RegExp('&#60', 'gm'), '<')
    content = content.replace(new RegExp('&#62', 'gm'), '>')
    content = content.replace(new RegExp('<!--', 'gm'), '<style>')
    content = content.replace(new RegExp('-->', 'gm'), '</style>')
    if (divider === undefined) {
      divider = '@'
    }
    if (content.length < length) {
      length = content.length
    }
    temp = content.substring(0, length)
    if (length !== content.length && append !== '') {
      temp += append
    }
    let ks = []
    if (typeof (keywords) !== 'undefined') {
      if (keywords.constructor !== Array) { // 如果不是数组,则形式为a@b@c,先分割为数组
        ks = keywords.split(divider)
        // 去除为''的元素
        for (let i = 0; i < ks.length; i++) {
          if (ks[i].replace(/(^\s*)|(\s*$)/g, '') === '') {
            ks.splice(i)
          }
        }
      } else {
        ks = keywords
      }
      for (let i = 0; i < ks.length; i++) {
        temp = temp.replace(new RegExp(ks[i], 'gm'), '<font class=' + className + '>' + ks[i] + '</font>')
      }
    }
    return temp
  },
  /**
   * 获取高亮显示的词，根据config获得高亮词，默认为基础关键词高亮
   * @param config
   * @returns {*}
   */
  getHeightLightKeywords: function (config) {
    // if the config is undefined get the baseKeywords
    if (!config) {
      if (!localStorage.getItem('baseKeywords')) {
        let baseKeywordsParams = {type: 'BASIC'}
        getKeywords(baseKeywordsParams).then(baseKeywords => {
          config = baseKeywords
          localStorage.setItem('baseKeywords', JSON.stringify(baseKeywords))
        })
      } else {
        config = JSON.parse(localStorage.getItem('baseKeywords'))
      }
    }
    if (config.mode === 'ADVANCED') {
      let heightLightWords = ''
      heightLightWords = config.expression
      heightLightWords = heightLightWords.replace(/OR/gm, '@')
      heightLightWords = heightLightWords.replace(/AND/gm, '@')
      heightLightWords = heightLightWords.replace(/[(&\\)*^%$#-]/g, '')
      heightLightWords = heightLightWords.replace(/\s/ig, '')
      return heightLightWords
    } else {
      return config.mustWord + '@' + config.shouldWord
    }
  },

  /**
   * 将数据库后台的专题数据转换为页面显示的数据
   * @param subject
   * @returns {*}
   */
  decodeSubject: function (subject) {
    subject.startDate = new Date(subject.startDate)
    subject.endDate = new Date(subject.endDate)
    switch (subject.state) {
      case 'CREATING':
        subject.state = '分析中'
        break
      case 'COMPLETED':
        subject.state = '已完成'
        break
    }

    if (subject.warning) {
      subject.warning.receiveStartTime = subject.warning.receiveStartTime + ':00'
      subject.warning.receiveEndTime = subject.warning.receiveEndTime + ':00'
      subject.warning.atWeekends = subject.warning.atWeekends.toString()
      let [...sentimentLabel] = []
      let [...type] = []
      if (subject.warning.sentimentLabel) {
        subject.warning.sentimentLabel.forEach(function (item) {
          sentimentLabel.push(typeUtil.sentimentType(item))
        })
      }
      subject.warning.sentimentLabel = sentimentLabel
      if (subject.warning.type) {
        subject.warning.type.forEach(function (item) {
          type.push(typeUtil.articleType(item))
        })
      }
      subject.warning.type = type
    }

    return subject
  },
  /**
   * 将页面显示的专题数据转换为后台数据哭保存的数据
   * @param subject
   * @returns {*}
   */
  encodeSubject: function (subject) {
    if (typeof subject.startDate === 'string') {
      subject.startDate = dateUtil.parseDate(subject.startDate)
    }
    if (typeof subject.endDate === 'string') {
      subject.endDate = dateUtil.parseDate(subject.endDate)
    }
    delete subject.number
    subject.startDate = subject.startDate.getTime()
    subject.endDate = subject.endDate.getTime()
    switch (subject.state) {
      case '分析中':
        subject.state = 'CREATING'
        break
      case '已完成':
        subject.state = 'COMPLETED'
        break
    }

    if (subject.warning) {
      subject.warning.receiveStartTime = parseInt(subject.warning.receiveStartTime.split(':')[0])
      subject.warning.receiveEndTime = parseInt(subject.warning.receiveEndTime.split(':')[0])
      subject.warning.atWeekends = !(subject.warning.atWeekends === 'false')

      let [...sentimentLabel] = []
      let [...type] = []
      subject.warning.sentimentLabel.forEach(function (item) {
        sentimentLabel.push(typeUtil.encodeSentimentType(item))
      })
      subject.warning.sentimentLabel = sentimentLabel
      subject.warning.type.forEach(function (item) {
        type.push(typeUtil.encodeArticleType(item))
      })
      subject.warning.type = type
    }

    return subject
  }
}
