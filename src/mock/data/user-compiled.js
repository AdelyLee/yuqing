'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Users = exports.LoginUsers = undefined;

var _mockjs = require('mockjs');

var _mockjs2 = _interopRequireDefault(_mockjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoginUsers = [{
  id: 1,
  username: 'ahjm',
  password: 'ahjm123',
  email: 'liyc@bjtopcom.com',
  name: '北京卓越'
}]; /**
     * Created by lyc on 17-7-11.
     */


var Users = [];
for (var i = 0; i < 100; i++) {
  Users.push(_mockjs2.default.mock({
    id: _mockjs2.default.Random.guid(),
    name: _mockjs2.default.Random.cname(),
    address: _mockjs2.default.mock('@county(true)'),
    'age|18-60': 1,
    birth: _mockjs2.default.Random.date(),
    sex: _mockjs2.default.Random.integer(0, 1)
  }));
}

exports.LoginUsers = LoginUsers;
exports.Users = Users;

//# sourceMappingURL=user-compiled.js.map