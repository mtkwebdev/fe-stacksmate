<template>
<div v-if="!loading" class="d-flex justify-content-center" :key="componentKey">
  <div class="mx-auto">
    <b-card-group class="">
      <b-card v-if="page === 'payment-page'" header-tag="header" footer-tag="footer">
        <template #header>
          <b-row class="mx-2">
            <b-col cols="12" style="font-size: 1.0rem;">
              <div v-html="paymentMessage"></div>
            </b-col>
          </b-row>
        </template>
        <div>
          <!-- <CryptoPicker :configuration="configuration" v-if="displayCard === 100" @rpayEvent="rpayEvent($event)"/> -->
          <div>
            <OrderInfo :configuration="configuration" v-if="configuration.payment.allowMultiples" class="pb-4" @rpayEvent="rpayEvent($event)"/>
            <div class="d-flex flex-column align-items-center">
              <CryptoOptions :configuration="configuration" @rpayEvent="rpayEvent($event)"/>
              <p class="mt-2 mx-4 text-center text-message" v-html="swapMessage"></p>
              <p v-if="paying" class="mt-2 mx-4 text-center text-message">
                <b-icon icon="circle" animation="throb" font-scale="1"></b-icon> Payment in Progress
                <br/><span class="text-danger text-small">Please leave this tab open until we get the response</span>
              </p>
              <p v-if="nonceBlocked" class="mt-2 mx-4 text-center text-message">
                <b-icon icon="circle" animation="throb" font-scale="1"></b-icon> Waiting for previous transaction to confirm
              </p>
              <CryptoPaymentScreen :configuration="configuration" @rpayEvent="rpayEvent($event)"/>
            </div>
          </div>
          <!-- <ResultPage :configuration="configuration" :result="'error'" v-else @rpayEvent="rpayEvent($event)"/> -->
        </div>
        <template v-slot:footer>
          <FooterView class="mx-4" :paymentStage="paymentStage" @rangeEvent="rangeEvent"/>
        </template>
      </b-card>
      <div v-else>
        <ResultPage :configuration="configuration"/>
      </div>
    </b-card-group>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import CryptoPaymentScreen from './payment-screens/CryptoPaymentScreen'
import CryptoOptions from './payment-screens/components/CryptoOptions'
import OrderInfo from './payment-screens/components/OrderInfo'
import ResultPage from '../ResultPage'
import FooterView from '../FooterView'

export default {
  name: 'PaymentFlow',
  components: {
    FooterView,
    CryptoPaymentScreen,
    OrderInfo,
    CryptoOptions,
    ResultPage
  },
  props: ['configuration', 'recipient'],
  data () {
    return {
      paymentStage: 0,
      passport: 'https://images.prismic.io/digirad/ba438fd3-a07d-4fce-8483-aaf46b975c4b_alexander-sinn-KgLtFCgfC28-unsplash+%281%29%402x.png?auto=compress,format',
      page: 'payment-page',
      message: null,
      paying: false,
      componentKey: 0,
      loading: true,
      successMessage1: 'Payment made - thank you.',
      errorMessage: 'Payment may have been cancelled - please check you are connected to the right network and have sufficient funds in your wallet.'
    }
  },
  mounted () {
    this.initPayment()
    const $self = this
    window.eventBus.$on('rpayEvent', function (data) {
      if (data.opcode === 'eth-payment-pending') {
        $self.paying = true
      } else if (data.opcode === 'btc-crypto-payment-success') {
        $self.doTransfer(data)
      }
    })
  },
  beforeDestroy () {
    this.$store.dispatch('rpayStore/stopCheckPayment')
  },
  methods: {
    initPayment: function () {
      this.$store.dispatch('rpayStore/initialisePaymentFlow', this.configuration).then((invoice) => {
        this.page = 'payment-page'
        if (invoice) {
          if (invoice.data && (invoice.data.status === 'paid' || invoice.data.status === 'processing')) {
            // this.page = 'payment-result'
          }
        }
        this.loading = false
      })
    },
    rangeEvent () {
      this.paymentStage = this.paymentStage++
      this.componentKey++
    },
    getPaymentId (data) {
      if (data.opcode === 'eth-crypto-payment-success') {
        return data.txId
      }
    },
    rpayEvent: function (data) {
      this.paying = false
      if (data.opcode === 'crypto-payment-expired') {
        this.paymentExpired()
      } else if (data.opcode === 'payment-restart') {
        this.paymentExpired()
      } else if (data.opcode.indexOf('-payment-error') > -1) {
        this.$notify({ type: 'danger', title: 'Payments', text: 'Payment was not recieved due to an unexpected error.' })
      } else if (data.opcode.indexOf('-payment-cancelled') > -1) {
        this.$notify({ type: 'warning', title: 'Payments', text: this.errorMessage })
      } else if (data.opcode === 'change-payment-method') {
        this.paymentStage = 1
        this.componentKey++
      } else if (data.opcode.indexOf('-payment-success') > -1) {
        this.doTransfer(data)
      }
    },
    doTransfer (data) {
      data.recipient = this.recipient
      const payment = this.$store.getters[APP_CONSTANTS.KEY_PAYMENT_CONVERT](data)
      this.$store.dispatch('paymentStore/fetchNoncesForStacksMateWallet', payment.stxAddress).then((nonces) => {
        if (nonces) {
          payment.nonce = nonces.possible_next_nonce
        } else {
          payment.nonce = -1
        }
        this.$store.dispatch('paymentStore/sendStacksMateTransaction', payment).then((transaction) => {
          this.$emit('stacksMateEvent', transaction)
        }).catch(() => {
          this.$notify({ type: 'danger', title: 'Payments', text: 'Waiting for the previous stacks transaction to confirm...' })
        })
      })
    },
    paymentExpired () {
      this.$store.dispatch('rpayStore/initialisePaymentFlow', this.configuration).then(() => {
        this.componentKey += 1
        this.loading = false
      })
    }
  },
  computed: {
    swapMessage () {
      if (!this.sufficientFunds) {
        return 'Funds in the StacksMate Wallet are too low to make transfers at this time'
      }
      let sm = 'You send <span class="text-danger">'
      if (this.configuration.payment.paymentOption === 'ethereum') {
        sm += this.configuration.payment.amountEth + '</span> ETH to us. '
      } else if (this.configuration.payment.paymentOption === 'bitcoin' || this.configuration.payment.paymentOption === 'lightning') {
        sm += this.configuration.payment.amountBtc + '</span> BTC to us. '
      } else {
        sm += this.configuration.payment.amountFiat + '</span> ' + this.configuration.payment.currency + ' to us. '
      }
      sm += '<br/>We send <span class="text-danger">' + this.configuration.payment.amountStx + '</span> STX to you. '
      return sm
    },
    nonceBlocked () {
      const stxAddress = process.env.VUE_APP_STACKS_TRANSFER_ADDRESS
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO](stxAddress)
      const lastNonce = this.$store.getters[APP_CONSTANTS.KEY_LAST_NONCE] || -1
      return wallet.accountInfo.nonce <= lastNonce
    },
    sufficientFunds () {
      const stxAddress = process.env.VUE_APP_STACKS_TRANSFER_ADDRESS
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO](stxAddress)
      return (wallet && wallet.accountInfo.balance >= (this.configuration.payment.amountStx * 4))
    },
    paymentMessage () {
      return 'Swap <span class="text-danger">' + this.configuration.payment.amountFiat + '</span> ' + this.configuration.payment.currency + ' for <span class="text-danger">' + this.configuration.payment.amountStx + '</span> STX<br/><span style="font-size: 0.8rem;">to:</span> <span class="text-danger" style="font-size: 0.8rem;">' + this.recipient + '</span>'
    },
    displayCard () {
      const displayCard = this.$store.getters[APP_CONSTANTS.KEY_DISPLAY_CARD]
      return displayCard
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
