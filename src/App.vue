<template>
<div id="app" :style="'z-index: -40; min-height: 100vh; background-size: contain; background-image: url(' + bgpixel + ')'">
  <div v-if="!configured">
    <RisidioPay :configuration="appConfig"/>
  </div>
  <div :key="componentKey" v-else>
    <RouterView name="header"/>
    <div class="container">
      <RouterView id="nav"/>
    </div>
    <RouterView name="footer" />
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
      bgpixel: require('@/assets/img/bgpixel.svg'),
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
          const profile = $self.$store.getters[APP_CONSTANTS.KEY_PROFILE]
          $self.$store.dispatch('paymentStore/fetchStacksMateTransactions', profile.stxAddress)
        })
      }
    })
  },
  mounted () {
    this.readPrismicContent()
  },
  methods: {
    readPrismicContent () {
      this.$prismic.client.getSingle('mainfooter').then((document) => {
        if (document) {
          this.$store.commit('contentStore/addMainFooter', document.data)
        }
      })
    }
  },
  computed: {
    appConfig () {
      const appConfig = this.$store.getters[APP_CONSTANTS.KEY_APP_CONFIGURATION]
      return appConfig
    }
  }
}
</script>
<style lang="scss">
</style>
