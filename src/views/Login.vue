<template>
<loopbomb-spinner v-if="loading"/>
<div class="text-center" v-else>
  <b-modal class="mt-5" id="modal-1" title="Sign Up">
    <div class="row">
      <div class="col-12 my-1">
        <div class="text-center">Create your self owned online identity <a class="text-info" href="https://browser.blockstack.org/sign-up"><i class="fas fa-angle-right mr-2"></i><u>Get Blockstack</u></a></div>
      </div>
    </div>
    <template v-slot:modal-footer>
    </template>
  </b-modal>
  <div class="row">
    <div class="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12 col-xs-12">
      <loopbomb-spinner v-if="waitingForLogin"/>
      <b-card-group v-else>
        <b-card header-tag="header" footer-tag="footer">
          <template v-slot:header class="">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">Blockstack Login</h6>
             </div>
          </template>
          <b-card-text class="mt-5 d-flex justify-content-center" style="height: 10vh;">
            A Blockstack ID enables you to store your<br/> loopbombs securely in an encrypted wallet / library.
            <lsat-entry :paymentConfig="configuration" v-if="showLogin"/>
          </b-card-text>
          <b-card-text  style="height: 8vh;">
            <a href="#" class="btn bg-success text-white px-5" style="border-radius: 20px;" @click.prevent="loginBanter">Login</a>
          </b-card-text>
          <b-card-text  style="height: 15vh;">
            <a href="#" class="mb-3 btn bg-success text-white px-5" style="border-radius: 20px;" @click.prevent="showSignup = !showSignup">Sign Up</a>
            <div v-show="showSignup" class="text-center">Create your self owned online identity <a class="text-info" href="https://browser.blockstack.org/sign-up"><i class="fas fa-angle-right mr-2"></i><u>Get Blockstack</u></a></div>
          </b-card-text>
          <b-card-text style="margin-top: 50px;">
            <a href="https://blockstack.org"><img :src="blockstackLogo" alt="blockstack logo"/></a>
          </b-card-text>
        </b-card>
      </b-card-group>
    </div>
  </div>
</div>
</template>
<script>
import { APP_CONSTANTS } from '@/app-constants'
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'

const BLOCKSTACK_LOGIN = Number(process.env.VUE_APP_BLOCKSTACK_LOGIN)

export default {
  name: 'Login',
  bodyClass: 'login-page',
  components: {
    LoopbombSpinner
  },
  data () {
    return {
      waitingForLogin: true,
      showModal: false,
      loading: false,
      showSignup: false,
      blockstackLogo: '/img/blockstack_logo.png'
    }
  },
  mounted () {
    const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
    if (profile.loggedIn) {
      this.loading = false
      const query = this.$route.query
      if (query && query.redirect) {
        this.$router.push({ path: query.redirect })
      } else {
        this.$router.push({ path: '/' })
      }
    } else {
      if (BLOCKSTACK_LOGIN < 3) {
        this.$store.dispatch('authStore/startLogin')
      } else {
        this.loading = false
        this.$store.dispatch('authStore/fetchMyAccount').then(profile => {
          if (profile.loggedIn) {
            this.$router.push({ path: '/' })
          }
        })
      }
    }
  },
  methods: {
    closeModal: function () {
      this.showModal = false
    },
    loginBanter: function () {
      this.$store.dispatch('authStore/startLogin')
    }
  }
}
</script>
<style>
.my-icon {
  max-width: 20px;
}
</style>
