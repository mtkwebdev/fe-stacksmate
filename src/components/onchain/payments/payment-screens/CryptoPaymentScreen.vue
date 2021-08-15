<template>
<b-card-text class="action-section">
  <div class="" v-if="timedOutOrExpired || expired">
    <div class="d-flex justify-content-center">
      <p class="mt-4 text-center text-message">Lightning invoice has expired - {{timedOutOrExpired}}</p>
    </div>
    <div class="d-flex justify-content-center">
      <b-button class="btn-pay" @click="$emit('rpayEvent', { opcode: 'crypto-payment-expired' })" variant="outline-danger">Start Over</b-button>
    </div>
  </div>
  <div class="" v-else>
    <p class="mt-4 text-center text-message" v-if="desktopWalletSupported === ''">Scan the QR code <a v-if="paymentOption === 'lightning'" href="#" class="text-danger" @click.prevent="checkChain()">check payment</a></p>
    <p class="mt-4 text-center text-message text-center" v-if="paymentOption === 'fiat'">Enter your card details</p>
    <div class="d-flex justify-content-center">
      <FiatPaymentScreen :configuration="configuration" v-on="$listeners" v-if="paymentOption === 'fiat'"/>
      <LightningPaymentAddress :configuration="configuration" v-on="$listeners" v-if="paymentOption === 'lightning'"/>
      <BitcoinPaymentAddress :configuration="configuration" v-on="$listeners" v-if="paymentOption === 'bitcoin'"/>
      <StacksPaymentAddress :configuration="configuration" v-on="$listeners" :desktopWalletSupported="desktopWalletSupported" v-if="paymentOption === 'stacks'"/>
      <EthereumPaymentAddress :configuration="configuration" v-on="$listeners" :desktopWalletSupported="desktopWalletSupported" v-if="paymentOption === 'ethereum'"/>
    </div>
  </div>
</b-card-text>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import LightningPaymentAddress from './components/LightningPaymentAddress'
import BitcoinPaymentAddress from './components/BitcoinPaymentAddress'
import StacksPaymentAddress from './components/StacksPaymentAddress'
import EthereumPaymentAddress from './components/EthereumPaymentAddress'
import FiatPaymentScreen from './FiatPaymentScreen'

export default {
  name: 'CryptoPaymentScreen',
  components: {
    LightningPaymentAddress,
    BitcoinPaymentAddress,
    EthereumPaymentAddress,
    StacksPaymentAddress,
    FiatPaymentScreen
  },
  props: ['configuration'],
  data () {
    return {
      expired: false,
      message: null,
      paying: false,
      loading: true
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    checkChain () {
      this.$store.dispatch('rpayStore/checkPayment').then((invoice) => {
        if (invoice && invoice.opcode === 'btc-crypto-payment-success') {
          this.$store.commit('rpayStore/setDisplayCard', 104)
        }
      })
    }
  },
  computed: {
    desktopWalletSupported () {
      const paymentOption = this.configuration.payment.paymentOption
      return paymentOption === 'bitcoin' || paymentOption === 'lightning' || paymentOption === 'stacks1'
    },
    paymentOption () {
      const paymentOption = this.configuration.payment.paymentOption
      return paymentOption
    },
    timedOutOrExpired () {
      const expired = this.$store.getters[APP_CONSTANTS.KEY_INVOICE_EXPIRED]
      return expired
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
