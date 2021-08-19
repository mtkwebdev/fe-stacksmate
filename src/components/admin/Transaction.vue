<template>
<b-container>
<b-row class="mb-1 border-bottom text-small py-1">
  <b-col md="3" sm="12">
    <div>Recipient</div>
  </b-col>
  <b-col md="8" sm="12">
    <div>{{transaction.recipient}}</div>
  </b-col>
</b-row>
<b-row class="text-small pb-3">
  <b-col cols="3">
    <div>Transfer Amount</div>
  </b-col>
  <b-col cols="8">
    <div>{{amount()}} STX</div>
  </b-col>
  <b-col cols="3">
    <div>Stacks Tx Status</div>
  </b-col>
  <b-col cols="8">
    <div><span v-if="transaction.status !== 'success'"><b-icon icon="circle" animation="throb" font-scale="1"/></span> {{transaction.txStatus}} <a class="text-info" :href="stacksUri()" target="_blank">view on stacks explorer</a></div>
  </b-col>
  <b-col cols="3">
    <div>Transaction Counter</div>
  </b-col>
  <b-col cols="8">
    <div>{{transaction.nonce}}</div>
  </b-col>
  <b-col cols="3">
    <div>Date</div>
  </b-col>
  <b-col cols="8">
    <div>{{timeSent()}}</div>
  </b-col>
  <b-col cols="3">
    <div>Payment Code</div>
  </b-col>
  <b-col cols="8">
    <div>{{transaction.paymentCode}}</div>
  </b-col>
  <b-col cols="3">
    <div>Payment Amount</div>
  </b-col>
  <b-col cols="8">
    <div>{{transaction.paymentAmount}} {{transaction.paymentCurrency}} <a class="text-info" :href="paymentUri()" target="_blank">{{paymentUriLabel()}}</a></div>
  </b-col>
</b-row>
</b-container>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import utils from '@/store/utils'

export default {
  name: 'Transaction',
  components: {
  },
  props: ['transaction'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    paymentUri () {
      let uri = null
      if (this.transaction.paymentCode === 'eth-crypto-payment-success') {
        uri = process.env.VUE_APP_ETHERSCAN_API + this.transaction.paymentId
      } else if (this.transaction.paymentCode === 'fiat-payment-success') {
        uri = this.transaction.paymentUrl
      } else {
        uri = process.env.VUE_APP_BITCOIN_API + this.transaction.paymentId
      }
      return uri
    },
    paymentUriLabel () {
      let uri = null
      if (this.transaction.paymentCode === 'eth-crypto-payment-success') {
        uri = 'view transaction'
      } else if (this.transaction.paymentCode === 'fiat-payment-success') {
        uri = 'view reciept'
      } else {
        uri = 'view transaction'
      }
      return uri
    },
    stacksUri () {
      const uri = process.env.VUE_APP_STACKS_EXPLORER_API + this.transaction.txId + '?chain=' + process.env.VUE_APP_NETWORK
      return uri
    },
    timeSent () {
      return moment(this.transaction.timeSent).format('DD-MM-YY hh:mm')
    },
    amount () {
      return utils.fromOnChainAmount(this.transaction.microstx)
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
</style>
