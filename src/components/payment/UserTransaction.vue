<template>
  <b-card bg-variant="primary">
<b-row class="text-small">
  <b-col cols="2">
    <div v-if="transaction.txStatus === 'pending'">Sending</div>
    <div v-else-if="transaction.txStatus === 'success'">Sent</div>
    <div v-else>Attempted</div>
  </b-col>
  <b-col cols="10">
    <div>{{amount()}} STX</div>
  </b-col>
</b-row>
<b-row class="text-small">
  <b-col md="2" sm="12">
    <div>To</div>
  </b-col>
  <b-col md="10" sm="12">
    <div class="">{{transaction.recipient}}</div>
  </b-col>
</b-row>
<b-row class="text-small">
  <b-col cols="2">
    <div>For</div>
  </b-col>
  <b-col cols="10" class="d-flex justify-content-between">
    <div>{{transaction.paymentAmount}} {{transaction.paymentCurrency}}</div>
    <div v-if="transaction.paymentTx">
      <div v-if="transaction.paymentCurrency.indexOf('L/BTC') === -1">
        <a class="text-info" :href="paymentUri()" target="_blank">{{paymentUriLabel()}} <b-icon icon="arrow-up-right-circle" font-scale="1"/></a>
      </div>
      <div v-else>
        <div><a class="text-info" href="#" @click.prevent="showLightningInvoice = !showLightningInvoice">Lightning Invoice</a></div>
      </div>
    </div>
  </b-col>
  <b-col cols="12">
    <div class="wrapme" v-if="showLightningInvoice">{{transaction.paymentUrl}}</div>
  </b-col>
</b-row>
<b-row class="text-small">
  <b-col cols="2">
    <div>on</div>
  </b-col>
  <b-col cols="10">
    <div>{{timeSent()}}</div>
  </b-col>
</b-row>
<b-row class="text-small">
  <b-col cols="2">
    <div>
      <b-link class="text-white pointer" @click.prevent="showAllFields = !showAllFields">Status</b-link>
    </div>
  </b-col>
  <b-col cols="10">
    <div v-if="transaction.txStatus === 'success'" class="text-info d-flex justify-content-between">
      <div><b-icon class="mr-2" icon="check-circle" font-scale="1"/> {{transaction.txStatus}}</div>
      <div v-if="transaction.txId && transaction.txId.length > 8"><a class="text-info" :href="stacksUri()" target="_blank">stacks explorer <b-icon icon="arrow-up-right-circle" font-scale="1"/></a></div>
    </div>
    <div v-else-if="transaction.txStatus === 'pending'" class="text-warning d-flex justify-content-between">
      <div><b-icon class="mr-2" icon="circle" animation="throb" font-scale="1"/> {{transaction.txStatus}}</div>
      <div v-if="transaction.txId && transaction.txId.length > 8"><a class="text-info" :href="stacksUri()" target="_blank">stacks explorer <b-icon icon="arrow-up-right-circle" font-scale="1"/></a></div>
    </div>
    <div v-else class="text-danger d-flex justify-content-between">
      <div @click="showAllFields = !showAllFields"><b-icon class="mr-2" icon="x-circle" font-scale="1"/>{{transaction.txStatus}}</div>
      <div v-if="transaction.txId && transaction.txId.length > 8"><a class="text-info" :href="stacksUri()" target="_blank">stacks explorer <b-icon icon="arrow-up-right-circle" font-scale="1"/></a></div>
    </div>
  </b-col>
</b-row>
<b-row class="text-small" v-if="showAllFields">
  <b-col cols="2">
    <div>Reference</div>
  </b-col>
  <b-col cols="10">
    <div>{{transaction.id}}</div>
  </b-col>
  <b-col cols="2">
    <div>Payment Id</div>
  </b-col>
  <b-col cols="10">
    <div>{{transaction.paymentId}}</div>
  </b-col>
  <b-col cols="2">
    <div>Payment Tx</div>
  </b-col>
  <b-col cols="10">
    <div>{{transaction.paymentTx}}</div>
  </b-col>
  <b-col cols="2">
    <div>Stacks Tx Counter</div>
  </b-col>
  <b-col cols="10">
    <div>{{transaction.nonce}}</div>
  </b-col>
</b-row>
<b-row class="text-small">
  <b-col cols="12" class="mt-3 text-right">
    <div><b-link class="text-warning" @click.prevent="$emit('txEvent', transaction)">feedback? <b-icon icon="arrow-up-square" font-scale="1"/></b-link></div>
  </b-col>
</b-row>
  </b-card>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import utils from '@/store/utils'

export default {
  name: 'StacksMateWallet',
  components: {
  },
  props: ['transaction'],
  data () {
    return {
      cross: require('@/assets/img/cross.svg'),
      showLightningInvoice: false,
      showAllFields: false
    }
  },
  methods: {
    paymentUri () {
      let uri = null
      if (this.transaction.paymentCode === 'eth-crypto-payment-success') {
        uri = process.env.VUE_APP_ETHERSCAN_API + this.transaction.paymentId
      } else if (this.transaction.paymentCode === 'fiat-payment-success') {
        uri = this.transaction.paymentUrl
      } else if (this.transaction.paymentCurrency.indexOf('BTC') > -1) {
        const baseUri = 'https://www.blockchain.com/btc/address/'
        let btcAddress = this.transaction.paymentUrl.split('bitcoin:')[1]
        btcAddress = btcAddress.split('?')[0]
        uri = baseUri + btcAddress
      } else {
        uri = '#'
      }
      return uri
    },
    paymentUriLabel () {
      let uri = null
      if (this.transaction.paymentCode.indexOf('eth') > -1) {
        uri = 'view on etherscan'
      } else if (this.transaction.paymentCode === 'fiat-payment-success') {
        uri = 'view reciept'
      } else if (this.transaction.paymentCurrency.indexOf('BTC') > -1) {
        uri = (this.transaction.paymentUrl) ? 'view on blockchain' : null
      } else {
        uri = '#'
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
.wrapme {
  overflow-y: scroll;
  margin: 10px 5px;
}
</style>
