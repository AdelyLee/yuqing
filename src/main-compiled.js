'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _App = require('@/App');

var _App2 = _interopRequireDefault(_App);

var _elementUi = require('element-ui');

var _elementUi2 = _interopRequireDefault(_elementUi);

var _index = require('./router/index');

var _index2 = _interopRequireDefault(_index);

require('element-ui/lib/theme-default/index.css');

require('@/style/common.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Mock from './mock/api/index'
// Mock.init()

_vue2.default.use(_vueRouter2.default); // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

_vue2.default.use(_elementUi2.default);
_vue2.default.config.productionTip = false;

var router = new _vueRouter2.default({
  mode: 'history',
  routes: _index2.default
});

router.beforeEach(function (to, from, next) {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('access-user');
    next();
  } else {
    var user = window.sessionStorage.getItem('access-user');
    if (!user) {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new _vue2.default({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App: _App2.default }
});

//# sourceMappingURL=main-compiled.js.map