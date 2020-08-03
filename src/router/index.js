import Vue from 'vue'
import VueRouter from 'vue-router'
import DeployContract from '@/views/DeployContract.vue'
import Contracts from '@/views/Contracts.vue'
import ApiFramework from '@/views/ApiFramework.vue'
import StaxHub from '@/views/StaxHub.vue'
import Login from '@/views/Login.vue'
import TransferStax from '@/views/TransferStax.vue'
import MainNavbar from '@/layout/MainNavbar.vue'
import MainFooter from '@/layout/MainFooter.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    components: { default: DeployContract, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/api-demo',
    name: 'api-demo',
    components: { default: ApiFramework, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/staxhub',
    name: 'staxhub',
    components: { default: StaxHub, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/contracts',
    name: 'contracts',
    components: { default: Contracts, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/transfers',
    name: 'transfers',
    components: { default: TransferStax, header: MainNavbar, footer: MainFooter }
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
    redirect: { name: 'not-found' }
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
