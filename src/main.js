import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import router from './router'
import Vuex from 'vuex'
import VueSweetalert2 from 'vue-sweetalert2';

Vue.config.productionTip = false

// vue-router
Vue.use(VueRouter)

// vuex
Vue.use(Vuex)

// sweetalert2
Vue.use(VueSweetalert2)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
