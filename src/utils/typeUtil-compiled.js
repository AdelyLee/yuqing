'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeUtil = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lyc on 17-6-1.
 */

var typeUtil = exports.typeUtil = {
  /**
   * 报告类型
   * @param type
   * @returns {string}
   */
  briefingType: function briefingType(type) {
    var briefingType = '';
    type = type.toUpperCase();
    switch (type) {
      case 'DAILY':
        briefingType = '日报';
        break;
      case 'WEEKLY':
        briefingType = '周报';
        break;
      case 'MONTHLY':
        briefingType = '月报';
        break;
      case 'QUARTERLY':
        briefingType = '季报';
        break;
      case 'SEMIANNUAL':
        briefingType = '半年报';
        break;
      case 'ANNUAL':
        briefingType = '年报';
        break;
      case 'SPECIAL':
        briefingType = '专报';
        break;
    }

    return briefingType;
  },
  /**
   * 情感值类型
   * @param type
   * @returns {string}
   */
  sentimentType: function sentimentType(type) {
    var sentimentType = '';
    type = type.toLowerCase();
    switch (type) {
      case 'pos':
        sentimentType = '正面';
        break;
      case 'neg':
        sentimentType = '负面';
        break;
      case 'neu':
        sentimentType = '中性';
        break;
    }

    return sentimentType;
  },
  /**
   * 将显示的情感值转化为数据库存储的对应值
   * @param type
   * @returns {string}
   */
  encodeSentimentType: function encodeSentimentType(type) {
    var sentimentType = '';
    switch (type) {
      case '正面':
        sentimentType = 'POS';
        break;
      case '负面':
        sentimentType = 'NEG';
        break;
      case '中性':
        sentimentType = 'NEU';
        break;
    }

    return sentimentType;
  },

  /**
   * 文章类型
   * @param type
   * @returns {string}
   */
  articleType: function articleType(type) {
    var articleType = '';
    type = type.toLowerCase();
    switch (type) {
      case 'news':
        articleType = '新闻';
        break;
      case 'weibo':
        articleType = '微博';
        break;
      case 'bbs':
        articleType = '论坛';
        break;
      case 'bar':
        articleType = '贴吧';
        break;
      case 'comments':
        articleType = '评论';
        break;
      case 'article':
        articleType = '报道';
        break;
      default:
        articleType = type;
        break;
    }

    return articleType;
  },
  /**
   * 将显示的文章类型转化为数据库存储的对应值
   * @param type
   * @returns {string}
   */
  encodeArticleType: function encodeArticleType(type) {
    var articleType = '';
    switch (type) {
      case '新闻':
        articleType = 'news';
        break;
      case '微博':
        articleType = 'weibo';
        break;
      case '论坛':
        articleType = 'bbs';
        break;
      case '贴吧':
        articleType = 'bar';
        break;
      case '评论':
        articleType = 'comments';
        break;
    }

    return articleType;
  },
  /**
   * 显示星期对应值
   * @param week
   * @returns {string}
   */
  unCodeWeekly: function unCodeWeekly(week) {
    var weekDay = '';
    var weekMap = [{ key: '1', value: '星期二' }, { key: '2', value: '星期三' }, { key: '3', value: '星期四' }, { key: '4', value: '星期五' }, { key: '5', value: '星期六' }, { key: '6', value: '星期日' }, { key: '7', value: '星期一' }];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(weekMap), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        if (week === item.key) {
          weekDay = item.value;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return weekDay;
  }
};

//# sourceMappingURL=typeUtil-compiled.js.map