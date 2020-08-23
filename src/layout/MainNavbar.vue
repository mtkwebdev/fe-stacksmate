<template>
<div>
<div class="bg-black navbar">
  <div class="container">

  <b-navbar toggleable="md" type="dark" style="width: 100%; margin: 0; padding-right:0;padding-left:0;">
    <b-navbar-brand href="#">
      <div class="d-block d-md-none">
        <router-link to="/" class="navbar-brand"><img height="30px" :src="logo"/></router-link>
      </div>
      <div class="d-none d-md-block">
        <router-link to="/" class="navbar-brand"><img height="50px" :src="logo"/></router-link>
      </div>

      <!-- <router-link v-if="isHomePage" to="/get-stacks" class="navbar-brand"><img width="40px" height="40px" :src="nounStack"/></router-link> -->
    </b-navbar-brand>

    <b-navbar class="mr-auto" v-if="!isHomePage">
      <!-- <b-nav-text class="mr-3">Get Stacks:</b-nav-text> -->
      <b-nav-text><router-link :class="isActive('get-stacks')" to="/get-stacks">Get Stax</router-link></b-nav-text>
      <b-nav-text><router-link class="ml-3" :class="isActive('transfer-stacks')" to="/transfer-stacks">Transfer Stax</router-link></b-nav-text>
      <b-nav-text><router-link class="ml-3" :class="isActive('contracts')" to="/contracts">Contracts</router-link></b-nav-text>
    </b-navbar>

    <exchange-rates class="ml-auto nav-text d-block d-md-none" v-if="isHomePage"/>

    <b-navbar-toggle class="" target="nav-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon width="20px" height="30px" v-if="expanded" icon="chevron-contract"></b-icon>
        <img width="20px" v-else :src="toggler"/>
      </template>
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
        <b-navbar class="ml-auto">

        <exchange-rates class="nav-text d-none d-md-block" v-if="isHomePage"/>
        <b-nav-item-dropdown class="nav-text" right caret v-if="isHomePage">
          <template v-slot:button-content>
            <span class="header">Circ. STX: 808,734,706</span>
          </template>
          <b-dropdown-item><span style="display: inline-block; width: 150px;">Binance</span> 385,937,152</b-dropdown-item>
          <b-dropdown-item><span style="display: inline-block; width: 150px;">CoinMarketCap</span> 574,811,341</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="nav-text" left caret>
          <template v-slot:button-content>
            <span class="header">{{networkId}}</span>
          </template>
          <b-dropdown-item class="bg-dark" disabled><span class="text-light">Network</span></b-dropdown-item>
          <b-dropdown-item @click="changeNetworkId('testnet')"><span class="text-success">Testnet</span></b-dropdown-item>
          <b-dropdown-item @click="changeNetworkId('mainnet')"><i class="fa fa-ban" aria-hidden="true"></i> <span  class="" style="text-transform: strikethrough;">Mainnet</span></b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="nav-text" right v-if="loggedIn" caret>
          <template v-slot:button-content>
            <span v-if="provider" class="header">{{provider}}</span>
          </template>
          <b-dropdown-item class="bg-dark" disabled><span class="text-light">Provider</span></b-dropdown-item>
          <b-dropdown-item @click="changeProvider('blockstack')">Blockstack PBC</b-dropdown-item>
          <b-dropdown-item @click="changeProvider('risidio')">Risidio</b-dropdown-item>
          <b-dropdown-item @click="changeProvider('local-network')">Local</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="nav-text" right v-else caret>
          <template v-slot:button-content>
            <span v-if="provider" class="header">{{provider}}</span>
          </template>
          <b-dropdown-item @click.prevent="changeAuthenticator('risidio')">Risidio Network</b-dropdown-item>
          <b-dropdown-item @click.prevent="login()">Login to use Blockstack Provider</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown class="nav-text ml-3" right v-if="loggedIn" caret>
          <template v-slot:button-content>
            Account
          </template>
          <b-dropdown-item>{{username}}</b-dropdown-item>
          <b-dropdown-item to="/tx-history">
            <span>Transaction History</span>
          </b-dropdown-item>
          <b-dropdown-item>
            <span @click="logout()">Logout</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item class="nav-text" v-else><span @click="login()">Login</span></b-nav-item>
        </b-navbar>
    </b-collapse>
  </b-navbar>
  </div>
</div>
  <div class=" play-mode w-100" :class="(localPlayMode) ? 'bg-warning text-white' : ''" v-if="!isHomePage">
    <div class="container">
      <div class="d-flex justify-content-end">
        <div class="py-2">
          <b-form-checkbox v-model="localPlayMode" name="check-button" switch>
            <span class="" :class="(localPlayMode) ? 'text-white' : 'text-grey'">dev mode</span>
          </b-form-checkbox>
        </div>
      </div>
    </div>
  </div>
  <div class="container mb-3 d-flex justify-content-between w-100" v-if="!isHomePage">
    <exchange-rates class="nav-text"/>
    <b-nav-item-dropdown class="nav-text" right caret>
      <template v-slot:button-content>
        <span class="header">Circulating STX: 808,734,706</span>
      </template>
      <b-dropdown-item><span style="display: inline-block; width: 150px;">Binance</span> 385,937,152</b-dropdown-item>
      <b-dropdown-item><span style="display: inline-block; width: 150px;">CoinMarketCap</span> 574,811,341</b-dropdown-item>
    </b-nav-item-dropdown>
  </div>

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
  border-top: 1pt solid $yellow;
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
