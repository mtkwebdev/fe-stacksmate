import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/staxStore'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '@/assets/scss/custom.scss'
import Notifications from 'vue-notification'
import VueScrollTo from 'vue-scrollto'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Notifications, { closeOnClick: true, duration: 6000 })
Vue.use(VueScrollTo)

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate () {
    store.dispatch('initApplication')
  }
}).$mount('#app')