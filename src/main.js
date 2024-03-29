import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '@/assets/scss/custom.scss'
import PrismicVue from 'prismic-vue'
import linkResolver from './prismic/link-resolver'
import htmlSerializer from './prismic/html-serializer'
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
Vue.use(PrismicVue, {
  endpoint: 'https://dbid.cdn.prismic.io/api/v2',
  linkResolver,
  htmlSerializer
})

window.eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
