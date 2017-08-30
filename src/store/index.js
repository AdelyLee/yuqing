/**
 * Created by lyc on 17-7-11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: null, // 用户信息
  login: true, // 是否登录
  basePath: null, // 系统基础路径
  currentPage: null, // 当前页面
  lastViewedPage: null, // 系统上次访问路径
  theme: 'blue', // 系统主题
  baseKeywords: null, // 基础关键词
  focusKeywords: null, // 焦点关键词
  leaderKeywords: null // 领导关键词
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
