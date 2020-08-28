<template>
<div class="wallet-user-mode py-4">
  <div style="min-height: 60px;">
    <h1>Your Stacking Information</h1>
    <div class="mt-2"><span class="wallet-label mt-2 text-light" >Name</span><span>{{label}}</span></div>
    <div class="mt-2" ref="lndQrcode"><span class="wallet-label text-light" >Address</span>
      <span class="">{{truncMe}}</span>
      <a href="#" @click.prevent="copyAddress" class="wallet-label ml-3" style="text-decoration: underline; font-size: 12px;">Copy <b-icon icon="files"></b-icon></a>
    </div>
    <div class="mt-2"><span class="wallet-label text-light">Holdings</span><span>{{balance}}</span></div>
    <div class="mt-2">
      <div class="">
        <span class="wallet-label text-light" >BTC Address</span>
        <span v-if="btcDisplay" class="">
          <span class="">{{btcAddress}}</span>
          <span><a href="#" @click.prevent="btcDisplay = !btcDisplay" class="wallet-label ml-3" style="text-decoration: underline; font-size: 12px;">Edit <b-icon icon="pencil"></b-icon></a></span>
        </span>
        <span v-else>
          <b-input inline
            ref="btcAddress"
            v-model="btcAddress"
            class=""
            style="width: 100%;"
            @keyup.enter="saveBtcAddress"
            ></b-input>
        </span>
      </div>
    </div>
    <div v-show="false"><span class="wallet-label text-light">Tx Count</span><span class="mr-3">{{nonce}}</span></div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'UserWallet',
  components: {
  },
  data () {
    return {
      wallet: null,
      btcAddress: null,
      btcDisplay: true
    }
  },
  watch: {
    'stackingFile' () {
      const stackingFile = this.$store.getters[APP_CONSTANTS.KEY_STACKING_FILE]
      this.btcAddress = (stackingFile) ? stackingFile.btcAddress : ''
    }
  },
  mounted () {
    this.loading = false
    const stackingFile = this.$store.getters[APP_CONSTANTS.KEY_STACKING_FILE]
    this.btcAddress = (stackingFile) ? stackingFile.btcAddress : ''
  },
  methods: {
    copyAddress () {
      var tempInput = document.createElement('input')
      tempInput.style = 'position: absolute; left: -1000px; top: -1000px'
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      tempInput.value = wallet.keyInfo.address
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
    saveBtcAddress () {
      this.$store.dispatch('rstackStore/saveBtcAddress', this.btcAddress).then((result) => {
        this.$notify({ type: 'success', title: 'Bitcoin Address', text: 'Bitcoin address updated for next reward cycle..' })
        this.btcDisplay = true
      }).catch((error) => {
        this.$notify({ type: 'error', title: 'Bitcoin Address Error', text: error })
      })
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.name
    },
    stackingFile () {
      const stackingFile = this.$store.getters[APP_CONSTANTS.KEY_STACKING_FILE]
      return stackingFile || {}
    },
    balance () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      return (wallet && wallet.balance) ? wallet.balance : 0
    },
    nonce () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      return (wallet) ? wallet.nonce : 0
    },
    label () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
      return (wallet) ? wallet.label : 'n/a'
    },
    truncMe: function () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_USER_WALLET]
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
</style>
