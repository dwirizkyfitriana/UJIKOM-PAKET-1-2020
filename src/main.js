import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2'
import dayjs from 'dayjs'

Vue.config.productionTip = false

// vue-router
Vue.use(VueRouter)

// vuex
Vue.use(Vuex)

// sweetalert2
Vue.use(VueSweetalert2)

// dayjs
Vue.filter('date', function (value) {
  if (!value) return ''
  return dayjs(value).format('DD MMM YYYY')
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
