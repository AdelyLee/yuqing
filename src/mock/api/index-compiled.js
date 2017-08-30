'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _axiosMockAdapter = require('axios-mock-adapter');

var _axiosMockAdapter2 = _interopRequireDefault(_axiosMockAdapter);

var _user = require('./data/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let _Users = Users

exports.default = {
  init: function init() {
    var mock = new _axiosMockAdapter2.default(_axios2.default);

    mock.onPost('/login').reply(function (arg) {
      var _JSON$parse = JSON.parse(arg.data),
          username = _JSON$parse.username,
          password = _JSON$parse.password;

      return new _promise2.default(function (resolve, reject) {
        var user = null;
        setTimeout(function () {
          var hasUser = _user.LoginUsers.some(function (u) {
            if (u.username === username && u.password === password) {
              user = JSON.parse((0, _stringify2.default)(u));
              delete user.password;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user: user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });
  }
}; /**
    * Created by lyc on 17-7-11.
    */

//# sourceMappingURL=index-compiled.js.map