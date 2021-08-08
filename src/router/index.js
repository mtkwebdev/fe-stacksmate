import Vue from 'vue'
import VueRouter from 'vue-router'
import Homepage from '@/views/Homepage.vue'
import Login from '@/views/Login.vue'
import MainNavbar from '@/layout/MainNavbar.vue'
import MainFooter from '@/layout/MainFooter.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'swaps',
    components: { default: Homepage, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/swaps',
    name: 'swaps',
    components: { default: Homepage, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/login',
    name: 'login',
    components: { default: Login, header: MainNavbar },
    meta: {
      title: 'Login - Radicle Store',
      metaTags: [
        {
          name: 'description',
          content: 'Login to play Loopbomb is a fantastic art game where you can generate a unique and beautiful artwork and register it on Bitcoin blockchain.'
        },
        {
          property: 'og:description',
          content: 'Login to play Loopbomb is a fantastic art game where you can generate a unique and beautiful artwork and register it on Bitcoin blockchain.'
        }
      ]
    },
    props: {
      header: { colorOnScroll: 400 }
    }
  },
  {
    path: '*',
    redirect: { name: 'home' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

export default router
