'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHotWords = exports.hasExitInCollections = exports.deleteFromCollection = exports.addTOCollection = exports.getFilterAndGroupByTime = exports.getFilterAndGroupBy = exports.getArticles = exports.getDeduplicationArticles = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _typeUtil = require('@/utils/typeUtil');

var _dateUtil = require('@/utils/dateUtil');

var _utils = require('@/utils/utils');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lyc on 17-7-11.
 */
var base = _common.BASE_URL;

var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;
/**
 * 获取去重后的文章列表 POST /es/deDuplicationSearch
 * @param params
 */
var getDeduplicationArticles = exports.getDeduplicationArticles = function getDeduplicationArticles(params) {
  return _axios2.default.post(base + '/es/deDuplicationSearch', params).then(function (res) {
    var displayConfig = params.displayConfig;
    var data = res.data;

    var renderData = [];
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig));
      });
    }
    data.content = renderData;

    return data;
  });
};
/**
 * 获取未去重的文章列表 POST /es/findPageByMustShouldDateInType
 * @param params
 */
var getArticles = exports.getArticles = function getArticles(params) {
  return _axios2.default.post(base + '/es/findPageByMustShouldDateInType', params).then(function (res) {
    var displayConfig = params.displayConfig;
    var data = res.data;

    var renderData = [];
    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        renderData.push(handlerArticleItem(item, displayConfig));
      });
    }
    data.content = renderData;

    return data;
  });
};

/**
 * 处理文章结果
 * @param item
 * @param displayConfig
 * @returns {*}
 */
function handlerArticleItem(item, displayConfig) {
  displayConfig = displayConfig || {};
  var _displayConfig = displayConfig,
      _displayConfig$source = _displayConfig.sourceLength,
      sourceLength = _displayConfig$source === undefined ? 6 : _displayConfig$source,
      _displayConfig$titleL = _displayConfig.titleLength,
      titleLength = _displayConfig$titleL === undefined ? 15 : _displayConfig$titleL,
      heightLightWords = _displayConfig.heightLightWords;

  item.type = item.type.toLowerCase();
  item.nlp.sentiment.label = _typeUtil.typeUtil.sentimentType(item.nlp.sentiment.label);
  if (item.type === 'weibo') {
    item.title = item.content;
    item.source = item.author !== undefined && item.author !== null ? item.author : '未知';
    item.dev = item.dev !== undefined && item.dev !== null && item.dev !== '' ? item.dev : '未知';
  } else {
    item.source = item.source !== undefined && item.source !== null ? item.source : item.author !== undefined && item.author !== null ? item.author : '未知';
  }
  if (item.type === 'bbs') {
    item.title = item.title && item.title.length > 0 ? item.title : item.content.substring(0, 50);
  }
  item.collected = false; // set the default value for collection.
  item.pubTime = _dateUtil.dateUtil.formatDate(new Date(item.pubTime), 'yyyy/MM/dd');
  if (item.source.length > sourceLength) {
    item.source = item.source.substring(0, sourceLength - 1) + '...';
  }
  item.title = _utils.utils.heightLightKeywords(item.title, titleLength, '...', heightLightWords);
  item.content = _utils.utils.heightLightKeywords(item.content, 180, '...', heightLightWords);

  return item;
}

/**
 * 统计查询接口 POST /es/filterAndGroupBy
 * 专题的预估量也是调用该接口
 * @param params
 */
var getFilterAndGroupBy = exports.getFilterAndGroupBy = function getFilterAndGroupBy(params) {
  return _axios2.default.post(base + '/es/filterAndGroupBy', params).then(function (res) {
    return res.data;
  });
};

/**
 * 统计查询时间趋势接口 POST /es/filterAndGroupByTime
 * @param params
 * @param gapParams
 */
var getFilterAndGroupByTime = exports.getFilterAndGroupByTime = function getFilterAndGroupByTime(params, gapParams) {
  return _axios2.default.post(base + '/es/filterAndGroupByTime?' + _querystring2.default.stringify(gapParams), params).then(function (res) {
    return res.data;
  });
};

/**
 * add article to collections
 * @param params
 */
var addTOCollection = exports.addTOCollection = function addTOCollection(params) {
  return _axios2.default.get(base + '/collect/saveCollect2ES.json', { params: params }).then(function (res) {
    return res.data;
  });
};

/**
 * delete article from the collections
 * @param params
 */
var deleteFromCollection = exports.deleteFromCollection = function deleteFromCollection(params) {
  return _axios2.default.get(base + '/collect/deleteCollectedInOid.json', { params: params }).then(function (res) {
    return res.data;
  });
};

/**
 * get the article in collections or nor by article id.
 * @param params
 */
var hasExitInCollections = exports.hasExitInCollections = function hasExitInCollections(params) {
  return _axios2.default.get(base + '/collect/hasCollected.json', { params: params }).then(function (res) {
    return res.data;
  });
};

/**
 * 根据条件统计文章的关键词 POST /es/hotWords
 * @param params
 */
var getHotWords = exports.getHotWords = function getHotWords(params) {
  return _axios2.default.post(base + '/es/hotWords', params).then(function (res) {
    return res.data;
  });
};

//# sourceMappingURL=article-compiled.js.map