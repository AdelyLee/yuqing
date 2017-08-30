'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAccidents = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lyc on 17-7-11.
 */
var base = _common.BASE_URL;

var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;

/**
 * 获取事故数据
 * @param params
 */
var getAccidents = exports.getAccidents = function getAccidents(params) {
  return _axios2.default.post(base + '/report/aggregate.json', params).then(function (res) {
    return res.data;
  });
};

//# sourceMappingURL=accident-compiled.js.map