<template>
<div class="wallet-user-mode">
  <div style="min-height: 60px;">
    <h1>Your Stacking Information</h1>
    <div><span class="wallet-label mt-2 text-light" >Name</span><span>{{label}}</span></div>
    <div ref="lndQrcode"><span class="wallet-label text-light" >Address</span>
      <span class="">{{truncMe}}</span>
      <a href="#" @click.prevent="copyAddress" class="wallet-label ml-3" style="text-decoration: underline; font-size: 12px;">Copy <b-icon icon="files"></b-icon></a>
    </div>
    <div><span class="wallet-label text-light">Holdings</span><span>{{balance}}</span></div>
    <div class="mt-3"><span class="text-light">BTC Reward Address</span>
      <span>
        <b-input inline
          ref="btcAddress"
          v-model="btcAddress"
          class=""
          style="width: 100%;"
          ></b-input>
      </span>
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
      btcAddress: null
    }
  },
  mounted () {
    this.loading = false
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
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_MY_PROFILE]
      return profile.name
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
