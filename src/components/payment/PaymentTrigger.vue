<template>
  <b-jumbotron bg-variant="dark">
  <div class="w-md-75">
    <p class="text-small" v-html="paymentMessage"></p>
    <label class="mt-2 d-flex justify-content-between" for="item-name">
      <span>Send STX to:</span>
      <b-link v-if="recipient !== profile.stxAddress" class="text-info" @click.prevent="useMyAddress">use my address</b-link>
    </label>
    <b-form-input
      id="item-name"
      v-model="recipient"
      aria-describedby="item-name-help item-name-feedback"
      placeholder="Recipient address - where to send the STX tokens for the swap"
      trim></b-form-input>
    <p class="mt-3 text-left"><b-button variant="outline-warning" @click="showPayment">Get STX</b-button></p>
  </div>
  <b-row class="mt-5" v-if="smWallet" :key="componentKey">
    <b-col class="mb-4" cols="12">
      <b-link class="text-info" @click.prevent="showUserTransactions = !showUserTransactions"><b-icon :icon="(showUserTransactions) ? 'arrow-down' : 'arrow-right'"/> My Transactions</b-link>
      <UserTransactions v-if="showUserTransactions" class="text-xsmall py-3" />
    </b-col>
    <b-col cols="12">
      <b-link class="text-info" @click.prevent="showSMWallet = !showSMWallet"><b-icon :icon="(showSMWallet) ? 'arrow-down' : 'arrow-right'"/> StacksMate Wallet Info</b-link>
      <StacksMateWallet v-if="showSMWallet" class="text-small py-3" />
    </b-col>
  </b-row>
  <b-modal size="md" id="payment-modal" centered>
    <PaymentFlow v-if="showRpay" :configuration="configuration" :recipient="recipient" @stacksMateEvent="stacksMateEvent"/>
    <template #modal-footer class="text-center"><div class="w-100"></div></template>
  </b-modal>
</b-jumbotron>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PaymentFlow from '@/components/onchain/payments/PaymentFlow'
import StacksMateWallet from './StacksMateWallet'
import UserTransactions from './UserTransactions'

export default {
  name: 'PaymentTrigger',
  components: {
    PaymentFlow,
    StacksMateWallet,
    UserTransactions
  },
  data () {
    return {
      componentKey: 0,
      showSMWallet: false,
      recipient: null,
      showRpay: false,
      showUserTransactions: false
    }
  },
  watch: {
  },
  props: ['configuration'],
  mounted () {
    this.$store.dispatch('paymentStore/fetchStacksMateTransactions', this.profile.stxAddress)
    const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
    configuration.payment = Object.assign(configuration.payment, this.getAmounts.fiatAmounts)
    configuration.payment.paymentOption = ''
    configuration.risidioCardMode = 'payment-flow'
    this.configuration = configuration
    const data = { stxAddress: process.env.VUE_APP_STACKS_TRANSFER_ADDRESS }
    this.$store.dispatch('rpayAuthStore/fetchAccountInfo', data)
    if (this.$route.query && this.$route.query.stxAddress) {
      this.recipient = this.$route.query.stxAddress
    }
    if (!this.recipient && this.profile.loggedIn) {
      this.recipient = this.profile.stxAddress
    }
  },
  methods: {
    stacksMateEvent (transaction) {
      this.$bvModal.hide('payment-modal')
      this.showUserTransactions = true
      this.$notify({ type: 'success', title: 'Payments', text: 'Stacks transfer is being sent now.' })
      this.$notify({ type: 'success', title: 'Transfers', text: 'Status is ' + transaction.txStatus + ' - stacks transactions currently take a few minutes to process.' })
      this.componentKey++
    },
    useMyAddress: function () {
      this.recipient = this.profile.stxAddress
    },
    showPayment () {
      this.showRpay = true
      this.$bvModal.show('payment-modal')
      this.$store.dispatch('fetchAddressInfo', this.recipient).then(() => {
        this.showRpay = true
        this.$bvModal.show('payment-modal')
      }).catch((err) => {
        this.$notify({ type: 'error', title: 'Account Error', text: err })
      })
    }
  },
  computed: {
    paymentMessage () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      if (!configuration) return ''

      const amounts = this.getAmounts
      // return '<div>Swap <span class="text-warning">' + configuration.payment.amountFiat + '</span> ' + configuration.payment.currency + ' for <span class="text-warning">' + configuration.payment.amountStx + '</span> STX</div><div class="mt-3">Send the STX to:</span> <span class="text-warning">' + this.recipient + '</div>'
      const baseMessage = '<h3 class="mb-4">' + amounts.baseAmounts.currency + ' <span class="text-warning">' + amounts.baseAmounts.amountFiatFormatted + '</span> Swap</h3>'
      return baseMessage + '<div>Swap <span class="text-warning">' + amounts.fiatAmounts.amountFiatFormatted + '</span> ' + amounts.fiatAmounts.currency + ' for <span class="text-warning">' + amounts.fiatAmounts.amountStx + '</span> STX</div>'
      // <div class="mt-3">Send the STX to:</span> <span class="text-warning">' + this.recipient + '</div>'
    },
    getAmounts () {
      const amounts = this.$store.getters[APP_CONSTANTS.KEY_AMOUNTS]
      return amounts
    },
    smWallet () {
      const stxAddress = process.env.VUE_APP_STACKS_TRANSFER_ADDRESS
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO](stxAddress)
      return wallet
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
</style>
