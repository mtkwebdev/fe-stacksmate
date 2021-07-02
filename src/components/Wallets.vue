<template>
<div v-if="playMode">
    <div class="wallet-play-mode">
      <b-nav-item-dropdown class="nav-link p-0 m-0" style="position: relative; left: -18px;" left caret>
        <template v-slot:button-content class="p-0 m-0">
          <span class="text-white p-0 m-0">Select Test Wallet</span>
        </template>
        <b-dropdown-item @click="changeAccount(wallet)" class="ml-3" v-for="(wallet, index) in wallets" :key="index"><a class="text-white" href="#">{{wallet.label}}</a></b-dropdown-item>
      </b-nav-item-dropdown>
      <div v-if=" accounting === 3">
        <div style="min-height: 60px;">
          <div v-if="wallet">
            <div><span class="wallet-label mt-2 text-light" >Label</span> <span>{{label}}</span></div>
            <div ref="lndQrcode"><span class="wallet-label text-light" >Address</span> <span>{{truncMe}}</span>
              <a href="#" @click.prevent="copyAddress" class="wallet-label ml-2" style="text-decoration: underline; font-size: 12px;">Copy <b-icon icon="files"></b-icon></a>
            </div>
            <div><span class="wallet-label text-light" >Balance</span> <span>{{balance}}</span></div>
            <div><span class="wallet-label text-light" >Tx Count</span> <span>{{nonce}}</span></div>
          </div>
        </div>
      </div>
      <wallet-import-account v-else-if=" accounting === 1" @importAccount="importCreateAccount"/>
      <wallet-create-account v-else-if=" accounting === 2" @createAccount="importCreateAccount"/>
      <div class="mt-3 d-flex justify-content-end" style="font-size: 12px;">
        <a href="#" @click.prevent="openImportCreate(1)">Import Wallet <b-icon icon="arrow-bar-down"></b-icon></a>
      </div>
      <div class="d-flex justify-content-end" style="font-size: 12px;">
        <a href="#" @click.prevent="openImportCreate(2)">Create Wallet <b-icon icon="pencil"></b-icon></a>
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
<div v-else>
  <user-wallet v-if="loggedIn"/>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import UserWallet from '@/components/wallet/UserWallet'
import WalletCreateAccount from '@/components/wallet/WalletCreateAccount'
import WalletImportAccount from '@/components/wallet/WalletImportAccount'
// import { Wallet } from '@blockstack/keychain'

export default {
  name: 'Wallets',
  components: {
    UserWallet,
    WalletImportAccount,
    WalletCreateAccount
  },
  data () {
    return {
      section: 1,
      loading: true,
      wallet: null,
      feedback: null,
      accounting: 3,
      warningMsg: 'Note: this is for test purposes only - don\'t enter seeds / private keys in web sites unless you are clear about the reason.'
    }
  },
  mounted () {
    this.loading = false
    if (!this.wallet) {
      const wallets = this.$store.getters[APP_CONSTANTS.KEY_WALLETS]
      this.wallet = wallets[0]
      this.$store.commit('setCurrentAccount', this.wallet.keyInfo.address)
    }
  },
  methods: {
    openImportCreate: function (accountId) {
      this.accounting = accountId
      this.feedback = null
      // this.feedback = this.warningMsg
    },
    importCreateAccount: function (wallet) {
      if (!wallet.label) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Please specify an account name.' })
        return
      } else if (!wallet.keyInfo.privateKey) {
        this.$notify({ type: 'error', title: 'Transfers', text: 'Private key is needed to import an account' })
        return
      }
      this.$store.dispatch('createOrImportWallet', wallet).then((wallet) => {
        this.loading = false
        this.wallet = wallet
        this.$notify({ type: 'success', title: 'Wallets', text: 'New wallet added to test wallets!' })
      })
    },
    copyAddress () {
      var tempInput = document.createElement('input')
      tempInput.style = 'position: absolute; left: -1000px; top: -1000px'
      tempInput.value = this.wallet.keyInfo.address
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      const flasher = this.$refs.lndQrcode
      flasher.classList.add('flasher')
      setTimeout(function () {
        flasher.classList.remove('flasher')
      }, 1000)
    },
    changeAccount: function (wallet) {
      this.feedback = null
      this.accounting = 3
      this.wallet = wallet
      if (wallet && wallet.keyInfo.address.startsWith('S')) {
        this.$store.commit('setCurrentAccount', wallet.keyInfo.address)
      }
    }
  },
  computed: {
    wallets () {
      const wallets = this.$store.getters[APP_CONSTANTS.KEY_WALLETS]
      return wallets
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    },
    playMode () {
      const playMode = this.$store.getters[APP_CONSTANTS.KEY_PLAY_MODE]
      return playMode
    },
    balance () {
      if (!this.wallet) return
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.wallet.keyInfo.address)
      return (wallet && wallet.balance) ? wallet.balance : 0
    },
    nonce () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.wallet.keyInfo.address)
      return (wallet) ? wallet.nonce : 0
    },
    label () {
      if (!this.wallet) return
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.wallet.keyInfo.address)
      return (wallet) ? wallet.label : 'n/a'
    },
    truncMe: function () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_WALLET](this.wallet.keyInfo.address)
      if (!wallet) return
      let addr = wallet.keyInfo.address
      const width = this.$store.getters[APP_CONSTANTS.KEY_SECTION_WIDTH]
      if (width > 800) {
        return addr
      }
      addr = addr.substring(0, 5) + '...' + addr.substring(addr.length - 5, addr.length)
      return addr
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom.scss";
.text-wallet {
  font-weight: 700;
  font-size: 16px;
}
.dropdown-item:hover {
  color: #000 !important;
}
.dropdown-item {
  color: #fff !important;
}
.nav-link {
    padding: 0;
    margin: 0;
    font-size: 16px;
    color: #fff;
}
.nav-link > a {
    padding: 0 !important;
    font-size: 16px;
    color: #fff;
}
.nav-link:hover {
    color: #fff;
}
.nav-text {
  font-size: 18px;
  padding: 0px;
  margin: 0px;
}
.nav-text > a {
  font-size: 14px;
  padding: 0px;
  margin: 0px;
}
</style>
