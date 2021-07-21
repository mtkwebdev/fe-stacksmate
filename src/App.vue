<template>
<div id="app">
  <div v-if="!configured">
    <risidio-pay :configuration="configuration"/>
  </div>
  <div :key="componentKey" v-else>
    <router-view name="header"/>
    <div>
      <div class="container">
        <router-view id="nav"/>
      </div>
    </div>
    <router-view name="footer" />
  </div>
  <notifications :duration="5000" classes="r-notifs" position="bottom left" width="50%"/>
  <waiting-modal/>
  <success-modal />
</div>
</template>
<script>
import { APP_CONSTANTS } from '@/app-constants'
import RisidioPay from 'risidio-pay'
import SuccessModal from '@/components/utils/SuccessModal'
import WaitingModal from '@/components/utils/WaitingModal'
// const RisidioPay = () => import('risidio-pay')

export default {
  name: 'App',
  components: {
    SuccessModal,
    WaitingModal,
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
  beforeCreate () {
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'config-flow', asset: this.gaiaAsset })
    const $self = this
    window.eventBus.$on('rpayEvent', function (data) {
      if (data.opcode === 'configured') {
        $self.$store.dispatch('initApplication').then(() => {
          $self.configured = true
        })
      }
    })
  },
  methods: {
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
