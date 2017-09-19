// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// vendor
// import ElementUI from 'element-ui'
// import '@/scss/theme/index.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/scss/main.scss'
// 全局中间件
// Vue.use(ElementUI)
Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
