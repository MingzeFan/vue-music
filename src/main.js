import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'
import fastclick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'
Vue.config.productionTip = false
Vue.use(vueLazyLoad, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
