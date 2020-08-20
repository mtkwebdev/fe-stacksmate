import Vue from 'vue'
import VueRouter from 'vue-router'
import ContractManagement from '@/views/ContractManagement.vue'
import Stackers from '@/views/Stackers.vue'
import TransactionHistory from '@/views/TransactionHistory.vue'
import Wallets from '@/components/Wallets.vue'
import Converter from '@/components/Converter.vue'
import Contracts from '@/views/Contracts.vue'
import ApiFramework from '@/views/ApiFramework.vue'
import Homepage from '@/views/Homepage.vue'
import Login from '@/views/Login.vue'
import MainNavbar from '@/layout/MainNavbar.vue'
import MainFooter from '@/layout/MainFooter.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/get-stacks',
    name: 'get-stacks',
    components: { default: Stackers, wallets: Wallets, converter: Converter, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/transfer-stacks',
    name: 'transfer-stacks',
    components: { default: Stackers, wallets: Wallets, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/tx-history',
    name: 'tx-history',
    components: { default: TransactionHistory, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/contracts',
    name: 'contracts',
    components: { default: ContractManagement, wallets: Wallets, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/api-demo',
    name: 'api-demo',
    components: { default: ApiFramework, wallets: Wallets, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/',
    name: 'home',
    components: { default: Homepage, header: MainNavbar, footer: MainFooter }
  },
  {
    path: '/contracts',
    name: 'contracts',
    components: { default: Contracts, wallets: Wallets, header: MainNavbar, footer: MainFooter }
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
