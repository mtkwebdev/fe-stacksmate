import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '@/assets/scss/custom.scss'
// import '@/assets/scss/rpay-pay-card.scss'
import Notifications from 'vue-notification'
import VueScrollTo from 'vue-scrollto'
import browserDetect from 'vue-browser-detect-plugin'
const RisidioPay = () => import('risidio-pay')

Vue.config.productionTip = false
Vue.use(browserDetect)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Notifications, { closeOnClick: true, duration: 6000 })
Vue.use(VueScrollTo)
Vue.use(RisidioPay)

window.eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
