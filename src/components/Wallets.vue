<template>
<div v-if="loading">
  <loopbomb-spinner />
</div>
<div v-else>
  <div v-if="playMode">
    <div class="container">
      <h1>Play Mode On!</h1>
      <!--
      <div class="mt-4 container text-right d-flex justify-content-start">
        {{truncMe(getStaxAddress)}}
      </div>
      -->
      <b-form inline>
        <div class="mt-2">
          <div class="mb-3">
            <label for="address" class="mb-2 sr-only">Select Account</label>
            <b-form-select @change="changeAccount" v-model="address" :options="wallets" placeholder="Choose Test Wallet"></b-form-select>
            <b-form-text class="">
              <span v-if="address">Address <span style="font-size: 0.7rem;">{{truncMe(address)}}</span> <br/> Balance {{balance}} <br/></span>
            </b-form-text>
            <b-form-text class="text-right">
              <a href="#" @click.prevent="openImportCreate(1)">import</a> |
              <a href="#" @click.prevent="openImportCreate(2)">create</a>
            </b-form-text>
          </div>
        </div>
      </b-form>
    </div>
    <div class="container text-right d-flex justify-content-end">
      <wallet-import-account v-if=" accounting === 1" @importAccount="importCreateAccount"/>
      <wallet-create-account v-else-if=" accounting === 2" @createAccount="importCreateAccount"/>
    </div>
    <div class="container d-flex justify-content-end">
      <b-form-text class="mt-3" v-if="accounting < 3">
        <div  class="text-danger"></div>
      </b-form-text>
      <b-form-text class="mt-3">
        <div class="text-danger" style="display: block;">{{feedback}}</div>
      </b-form-text>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import LoopbombSpinner from '@/components/utils/LoopbombSpinner'
import WalletImportAccount from '@/components/wallet/WalletImportAccount'
import WalletCreateAccount from '@/components/wallet/WalletCreateAccount'
// import { Wallet } from '@blockstack/keychain'

export default {
  name: 'Wallets',
  components: {
    LoopbombSpinner,
    WalletImportAccount,
    WalletCreateAccount
  },
  data () {
    return {
      section: 1,
      loading: true,
      address: null,
      feedback: null,
      accounting: 3,
      warningMsg: 'Warning: this is for test purposes only - don\'t enter seeds / private keys unless you know what you are doing.'
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    openImportCreate: function (account) {
      this.accounting = account
      this.feedback = null
      this.address = null
      this.feedback = this.warningMsg
    },
    truncMe: function (address) {
      address = address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length)
      return address
    },
    importCreateAccount: function (data) {
      if (!data.text) {
        this.feedback = 'Please set an account name.'
        return
      } else if (!this.account.sk) {
        this.feedback = 'Private key is needed to import an account.'
        return
      }
      this.$store.dispatch('addAccount', data).then((account) => {
        this.loading = false
        this.account = account
      })
    },
    changeAccount: function (val) {
      // this.$store.dispatch('fetchWalletInfo', this.address)
      this.feedback = null
      this.accounting = 3
      if (val && val.startsWith('S')) {
        this.$store.commit('setCurrentAccount', val)
      }
    }
  },
  computed: {
    wallets () {
      const wallets = this.$store.getters[APP_CONSTANTS.KEY_WALLETS]
      const options = [{ value: null, text: 'Select a Test Wallet', balance: 0 }]
      wallets.forEach(function (wallet) {
        options.push({
          value: wallet.keyInfo.address,
          text: wallet.label,
          balance: wallet.balance
        })
      })
      return options
    },
    playMode () {
      const playMode = this.$store.getters[APP_CONSTANTS.KEY_PLAY_MODE]
      return playMode
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.name
    },
    balance () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.address)
      return (wallet && wallet.balance) ? wallet.balance : 0
    },
    getStaxAddress () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      return wallet.keyInfo.address
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
