'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _App = require('@/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var home = function home(r) {
  return require.ensure([], function () {
    return r(require('../page/home/Hello'));
  }, 'home');
};

exports.default = [{
  path: '/',
  component: _App2.default, // 顶层路由，对应index.html
  children: [
  // 地址为空时跳转home页面
  {
    path: '',
    redirect: '/home'
  },
  // 首页城市列表页
  {
    path: '/home',
    component: home
  }]
}];

//# sourceMappingURL=index-compiled.js.map