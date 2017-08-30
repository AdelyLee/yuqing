'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accountLogin = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var base = _common.BASE_URL; /**
                              * Created by lyc on 17-7-11.
                              */


var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;
/**
 * 账号密码登录
 * @param params
 */
var accountLogin = exports.accountLogin = function accountLogin(params) {
  return _axios2.default.post(base + '/login/login', _querystring2.default.stringify(params)).then(function (res) {
    return res.data;
  });
};

//# sourceMappingURL=user-compiled.js.map