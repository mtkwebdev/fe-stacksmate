<template>
<div>
<div class="bg-black navbar play-mode">
  <div class="container">

  <b-navbar toggleable="md" type="dark" style="width: 100%; margin: 0; padding-right:0;padding-left:0;">
    <b-navbar-brand href="#">
      <div class="d-block d-md-none">
        <router-link to="/" class="navbar-brand"><img height="30px" :src="logo"/></router-link>
      </div>
      <div class="d-none d-md-block">
        <router-link to="/" class="navbar-brand"><img height="50px" :src="logo"/></router-link>
      </div>
    </b-navbar-brand>

    <exchange-rates class="ml-auto nav-text d-block d-md-none" v-if="isHomePage"/>

    <b-navbar-toggle class="" target="nav-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon width="20px" height="30px" v-if="expanded" icon="chevron-contract"></b-icon>
        <img width="20px" v-else :src="toggler"/>
      </template>
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar class="ml-auto">
          <exchange-rates class="pl-0 nav-text"/>
          <b-nav-item-dropdown class="nav-text" right caret>
            <template v-slot:button-content>
              <span class="header">Circulating: 711,834,032</span>
            </template>
            <b-dropdown-item><span style="display: inline-block; width: 150px;">Total Supply</span> 945,757,398</b-dropdown-item>
          </b-nav-item-dropdown>
        <b-nav-item-dropdown class="nav-text" right v-if="loggedIn" caret>
          <template v-slot:button-content>
            Account
          </template>
          <b-dropdown-item>{{username}}</b-dropdown-item>
          <b-dropdown-item>
            <span @click="logout()">Logout</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item class="nav-text" v-else><span @click="login()">Login</span></b-nav-item>
        <b-nav-item to="/donate" class="nav-text"><span><b-icon icon="gift"/></span></b-nav-item>
        <b-nav-item to="/scene-vue" class="nav-text"><span><b-icon icon="gift"/></span></b-nav-item>
        <b-nav-item to="/scene-plain" class="nav-text"><span><b-icon icon="gift"/></span></b-nav-item>
      </b-navbar>
    </b-collapse>
  </b-navbar>
  </div>
</div>
<!--
  <div class=" play-mode w-100" :class="(localPlayMode) ? 'bg-warning text-white' : ''">
    <div class="container">
      <div class="d-flex justify-content-between">
          <exchange-rates class="pl-0 nav-text"/>
          <b-nav-item-dropdown class="nav-text" right caret>
            <template v-slot:button-content>
              <span class="header">Circulating STX: 711,834,032</span>
            </template>
            <b-dropdown-item><span style="display: inline-block; width: 150px;">Total Supply</span> 945,757,398</b-dropdown-item>
          </b-nav-item-dropdown>
      </div>
    </div>
  </div>
  -->
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
      toggler: require('@/assets/img/navbar/Icon_ionic-md-options.svg'),
      logo: require('@/assets/img/logo/risidio_white.png'),
      nounStack: require('@/assets/img/logo/Risidio_Stacks.svg'),
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
        this.$store.dispatch('initApplication').then(() => {
          this.$store.dispatch('fetchWalletBalances')
          this.$notify({ type: 'success', title: 'Provider', text: 'Network provider has been updated - the provider determines how transactions are broadcast to the blockchain!' })
        })
      }
    },
    isActive (route) {
      return (this.$route.name === route) ? 'active' : 'text-light'
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
    isHomePage () {
      return this.$route.name === 'home'
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

<style lang="scss">
@import "@/assets/scss/custom.scss";
.play-mode {
  border-top: 0pt solid $yellow;
  border-bottom: 1pt solid $yellow;
}
.dropdown-item:hover {
  color: #000 !important;
}
.dropdown-item {
  color: #fff !important;
  text-align: left;
  font-size: 12px;
  font-weight: 300;
}
.header {
  text-transform: capitalize;
}
.active {
  color: #FFFFFF;
}
.nav-text {
  position: relative;
  top: -6px;
  display: inline-block;
}
.nav-text > a {
  text-align: left;
  color: #FFFFFF;
  font-size: 12px;
}
.navbar-text {
  font-size: 12px;
  font-weight: 300;
}
</style>
