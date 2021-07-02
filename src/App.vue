<template>
<div id="app">
  <div v-if="!configured">
    <risidio-pay :configuration="configuration"/>
  </div>
  <div :key="componentKey" v-else>
    <router-view name="header"/>
    <div>
      <div class="container">
        <router-view class="my-3" name="wallets"/>
        <router-view id="nav"  class="w-100" style="position: relative; top: 60px;"/>
      </div>
      <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
    </div>
    <router-view name="footer" />
  </div>
</div>
</template>
<script>
import { APP_CONSTANTS } from '@/app-constants'
import RisidioPay from 'risidio-pay'
// const RisidioPay = () => import('risidio-pay')

export default {
  name: 'App',
  components: {
    RisidioPay
  },
  data () {
    return {
      componentKey: 0,
      loading: true,
      configured: false
    }
  },
  watch: {
  },
  mounted () {
    this.setupEventListener()
  },
  beforeCreate () {
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'config-flow', asset: this.gaiaAsset })
    const $self = this
    window.eventBus.$on('rpayEvent', function (data) {
      if (data.opcode === 'configured') {
        $self.$store.dispatch('initApplication').then(() => {
          // $self.$store.dispatch('rpaySearchStore/fetchContractData')
          $self.configured = true
        })
      }
    })
  },
  methods: {
    setupEventListener () {
      const $self = this
      this.loading = false
      if (window.eventBus && window.eventBus.$on) {
        window.eventBus.$on('rpayEvent', function (data) {
          if (data.opcode === 'stx-transaction-finished') {
            const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
            $self.$store.commit('setModalMessage', txResult)
          } else if (data.opcode === 'stx-transaction-sent') {
            const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
            $self.$store.commit('setModalMessage', txResult)
          } else if (data.opcode === 'stx-transaction-error') {
            const txResult = $self.$store.getters[APP_CONSTANTS.KEY_TRANSACTION_DIALOG_MESSAGE]({ dKey: data.opcode, txId: data.txId })
            $self.$store.commit('setModalMessage', txResult)
          } else if (data.opcode === 'configured-logged-in') {
            $self.$store.commit('rpayAuthStore/setAuthResponse', data.session)
            $self.$store.dispatch('rpayAuthStore/fetchMyAccount')
          }
        })
      }
    }
  },
  computed: {
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    }
  }
}
</script>
<style lang="scss">
</style>
