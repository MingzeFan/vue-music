import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
Vue.config.productionTip = false

fastclick.attach(document.body)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
