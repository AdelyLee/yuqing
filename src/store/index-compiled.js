'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _mutations = require('./mutations');

var _mutations2 = _interopRequireDefault(_mutations);

var _action = require('./action');

var _action2 = _interopRequireDefault(_action);

var _getters = require('./getters');

var _getters2 = _interopRequireDefault(_getters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default); /**
                                    * Created by lyc on 17-7-11.
                                    */


var state = {
  userInfo: null, // 用户信息
  login: true, // 是否登录
  emotionAnalysisChartConfig: null, // 情感真负面分析图
  mediaSiteChartChartConfig: null, // 媒体站点柱状图
  mediaTypeTrendAnalysisConfig: null, // 载体类型趋势图
  hotKeywordsConfig: null, // 关键词云图
  articles: null, // 新闻列表
  pager: null, // 列表分页
  baseKeywords: null // 基础关键词
};

exports.default = new _vuex2.default.Store({
  state: state,
  getters: _getters2.default,
  actions: _action2.default,
  mutations: _mutations2.default
});

//# sourceMappingURL=index-compiled.js.map