<template>
<div class="bg-black d-flex justify-content-between">
  <b-navbar toggleable="lg" type="dark" style="width: 100%;">
    <b-navbar-brand href="#"><router-link to="/" class="pl-5 navbar-brand"><img :src="logo"/></router-link></b-navbar-brand>

    <b-navbar-toggle class="ml-auto" target="nav-collapse"></b-navbar-toggle>
    <b-collapse class="mr-auto" id="nav-collapse" is-nav>
      <b-navbar-nav class="mr-auto">
        <b-nav-item class="joinUsButton" to='/staxhub'>Community</b-nav-item>
        <b-nav-item class="joinUsButton" to='/'>Contracts</b-nav-item>
        <!-- <b-nav-item class="joinUsButton" to='/contracts'>Contracts</b-nav-item> -->
        <b-nav-item class="joinUsButton" to='/transfers'>Transfers</b-nav-item>
        <!-- <b-nav-item class="joinUsButton" to='/api-demo'>API Demo</b-nav-item> -->
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown class="" right caret>
          <template v-slot:button-content>
            <span class="header">{{networkId}}</span>
          </template>
          <b-dropdown-item class="bg-dark" disabled><span class="text-light">Network</span></b-dropdown-item>
          <b-dropdown-item @click="changeNetworkId('testnet')"><span  class="text-success">Testnet</span></b-dropdown-item>
          <b-dropdown-item @click="changeNetworkId('mainnet')"><i class="fa fa-ban" aria-hidden="true"></i> <span  class="" style="text-transform: strikethrough;">Mainnet</span></b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="" right v-if="loggedIn" caret>
          <template v-slot:button-content>
            <span v-if="provider" class="header">{{provider}}</span>
          </template>
          <b-dropdown-item class="bg-dark" disabled><span class="text-light">Provider</span></b-dropdown-item>
          <b-dropdown-item @click="changeProvider('blockstack')">Blockstack Connect</b-dropdown-item>
          <b-dropdown-item @click="changeProvider('risidio')">Risidio Network</b-dropdown-item>
          <b-dropdown-item @click="changeProvider('local-network')">Local Stax Blockchain</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="" right v-else caret>
          <template v-slot:button-content>
            <span v-if="provider" class="header">{{provider}}</span>
          </template>
          <b-dropdown-item @click.prevent="changeAuthenticator('risidio')">Risidio Network</b-dropdown-item>
          <b-dropdown-item @click.prevent="login()">Login to use Blockstack Provider</b-dropdown-item>
        </b-nav-item-dropdown>

        <exchange-rates style="display: block;"/>
        <b-nav-text style="display: block;">
          <b-form-checkbox v-model="localPlayMode" name="check-button" switch>
            <span :class="(localPlayMode) ? 'text-success' : 'text-grey'">play mode</span>
          </b-form-checkbox>
        </b-nav-text>

        <b-nav-item-dropdown class="v-text ml-3" right v-if="loggedIn" no-caret>
          <template v-slot:button-content>
            <i class="fas fa-cog"></i>
          </template>
          <b-dropdown-item>{{username}}</b-dropdown-item>
          <b-dropdown-item>
            <span @click="logout()">Logout</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item class="joinUsButton" v-else><span @click="login()">Login</span></b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ExchangeRates from '@/components/utils/ExchangeRates'

export default {
  name: 'MainNavbar',
  props: {
    transparent: Boolean,
    colorOnScroll: Number
  },
  components: {
    ExchangeRates
  },
  watch: {
    'localPlayMode' () {
      this.$store.commit(APP_CONSTANTS.COMMIT_TOGGLE_PLAY_MODE)
    }
  },
  data () {
    return {
      logo: require('@/assets/img/logo/risidio_white1.png'),
      localPlayMode: false
    }
  },
  methods: {
    login () {
      this.$store.dispatch('authStore/startLogin')
    },
    logout () {
      this.$store.dispatch('authStore/startLogout').then(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    },
    changeProvider (provider) {
      if (provider) {
        this.$store.commit(APP_CONSTANTS.COMMIT_PROVIDER, provider)
      }
    },
    changePlayMode () {
      // this.$store.commit(APP_CONSTANTS.COMMIT_TOGGLE_PLAY_MODE)
    },
    changeNetworkId (networkId) {
      if (networkId && networkId === 'testnet') {
        this.$store.commit(APP_CONSTANTS.COMMIT_NETWORK_ID, networkId)
      } else {
        this.$notify({ type: 'warning', title: 'Networks', text: 'Stacks 2.0 is not yet live!' })
      }
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
    stxRate () {
      const stxRate = this.$store.getters[APP_CONSTANTS.KEY_STX_RATE]
      return stxRate
    },
    // playMode () {
    // const playMode = this.$store.getters[APP_CONSTANTS.KEY_PLAY_MODE]
    // return playMode
    // },
    fiatCurrency () {
      const fiatCurrency = this.$store.getters[APP_CONSTANTS.KEY_FIAT_CURRENCY]
      return fiatCurrency
    },
    provider () {
      const provider = this.$store.getters[APP_CONSTANTS.KEY_PROVIDER]
      return provider
    },
    networkId () {
      const networkId = this.$store.getters[APP_CONSTANTS.KEY_NETWORK_ID]
      return networkId
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
.header {
  text-transform: capitalize;
}
</style>
