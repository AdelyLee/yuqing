// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App'
import ElementUI from 'element-ui'
import routes from './router/index'
import store from './store/index'
import 'element-ui/lib/theme-default/index.css'
import 'social-share.js/dist/css/share.min.css'
import '@/assets/iconfont.css'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.config.productionTip = false

const router = new VueRouter({
  // mode: 'history',
  base: '/yuqing/', // 项目根路径
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    window.localStorage.clear()
    next()
  } else {
    let user = (window.localStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  template: '<App/>',
  components: {App}
})
