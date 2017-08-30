'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeywords = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import qs from 'querystring'
/**
 * Created by lyc on 17-7-11.
 */
var base = _common.BASE_URL;

var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;
/**
 * 同步方式获取用户相关关键词
 * @param params
 */
var getKeywords = exports.getKeywords = function getKeywords(params) {
  return _axios2.default.get(base + '/keywords/findByType', { params: params }).then(function (res) {
    return res.data;
  });
};

//# sourceMappingURL=config-compiled.js.map