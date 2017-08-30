'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWarnings = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _common = require('./common');

var _dateUtil = require('@/utils/dateUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var base = _common.BASE_URL; /**
                              * Created by lyc on 17-7-11.
                              */


var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;

/**
 * 获取专题预警数据
 * @param params
 */
var getWarnings = exports.getWarnings = function getWarnings(params) {
  return _axios2.default.post(base + '/warningLog/search', params).then(function (res) {
    var data = res.data;

    var renderData = [];
    if (data.content.length > 0) {
      data.content.forEach(function (item, index) {
        renderData.push(handlerWarningItem(item, index, params));
      });
    }
    data.content = renderData;

    return data;
  });
};

/**
 * 处理专题列表结果
 * @param item
 * @param index
 * @param params
 * @returns {*}
 */
function handlerWarningItem(item, index, params) {
  var _params$page = params.page,
      limit = _params$page.limit,
      page = _params$page.page;

  var skip = limit * (page - 1);
  item.number = skip + index + 1;
  item.dateCreated = _dateUtil.dateUtil.formatDate(new Date(item.dateCreated), 'yyyy-MM-dd hh:mm:ss');

  return item;
}

//# sourceMappingURL=warning-compiled.js.map