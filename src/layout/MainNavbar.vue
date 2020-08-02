<template>
<div class="bg-black d-flex justify-content-between">
  <b-navbar toggleable="lg" type="dark" style="width: 100%;">
    <b-navbar-brand href="#"><router-link to="/" class="pl-5 navbar-brand"><img :src="logo"/></router-link></b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item class="joinUsButton" to='/staxhub'>StaxHub</b-nav-item>
        <b-nav-item class="joinUsButton" to='/'>Deployment</b-nav-item>
        <b-nav-item class="joinUsButton" to='/contracts'>Contracts</b-nav-item>
        <b-nav-item class="joinUsButton" to='/transfers'>Transfers</b-nav-item>
        <b-nav-item class="joinUsButton" to='/api-demo'>API Demo</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown class="v-text ml-3" right v-if="loggedIn" caret>
          <template v-slot:button-content>
            Provider<span v-if="authenticator">: {{authenticator}}</span>
          </template>
          <b-dropdown-item @click="changeAuthenticator('blockstack')">Blockstack Connect</b-dropdown-item>
          <b-dropdown-item @click="changeAuthenticator('risidio')">Risidio Network</b-dropdown-item>
          <b-dropdown-item @click="changeAuthenticator('local network')">Local Stax Blockchain</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown class="v-text ml-3" right v-if="loggedIn" no-caret>
          <template v-slot:button-content>
            <i class="fas fa-cog"></i>
          </template>
          <b-dropdown-item>{{username}}</b-dropdown-item>
          <b-dropdown-divider>
            <lsat-entry :paymentConfig="configuration"/>
          </b-dropdown-divider>
        </b-nav-item-dropdown>
        <b-nav-item class="joinUsButton" to='/login' v-else>Login</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainNavbar',
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  components: {
  },
  data () {
    return {
      logo: require('@/assets/img/logo/risidio_white1.png')
    }
  },
  methods: {
    login () {
      this.$router.push('/login')
    },
    changeAuthenticator (authenticator) {
      this.$store.commit(APP_CONSTANTS.KEY_COMMIT_AUTHENTICATOR, authenticator)
    }
  },
  computed: {
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_LSAT_LOGIN_CONFIGURATION]
      configuration.lookAndFeel = {
        loginStyles: 'color: white; text-decoration: none;'
      }
      window.risidioPaymentConfig = JSON.stringify(configuration)
      return configuration
    },
    isLoginPage () {
      return this.$route.name === 'login'
    },
    authenticator () {
      const authenticator = this.$store.getters[APP_CONSTANTS.KEY_AUTHENTICATOR]
      return authenticator
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.loggedIn
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.name
    },
    showLogin () {
      return this.$route.name !== 'login'
    }
  }
}
</script>

<style scoped>
</style>
