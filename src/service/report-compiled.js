'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReports = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _dateUtil = require('@/utils/dateUtil');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var base = _common.BASE_URL; /**
                              * Created by lyc on 17-7-11.
                              */


var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;
/**
 * 根据用户获取用户专题报告 POST /briefing/search
 * @param params
 */
var getReports = exports.getReports = function getReports(params) {
  return _axios2.default.post(base + '/briefing/search', params).then(function (res) {
    var data = res.data;

    if (data.content.length > 0) {
      data.content.forEach(function (item) {
        item.createTime = _dateUtil.dateUtil.formatDate(new Date(item.dateCreated), 'yyyy/MM/dd');
      });
    }

    return data;
  });
};

//# sourceMappingURL=report-compiled.js.map