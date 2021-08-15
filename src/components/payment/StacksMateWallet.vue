<template>
<b-row class="text-small py-3">
  <b-col cols="2">Balance:</b-col>
  <b-col cols="10">{{smWallet.accountInfo.balance}}</b-col>
  <b-col cols="2">Counter:</b-col>
  <b-col cols="10">
    <span v-if="smWallet.accountInfo.nonce">{{smWallet.accountInfo.nonce}}</span><span v-else>0</span>
    <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'danger' }" :title="'The tx counter (nonce) keeps track of the transactions sent from our address - it is incremented by the network once the transaction is mined. For our purposes it limits the number of StacksMate payments we can make at a given time - for this reason we prevent payments while a transfer is in progress. This slows down our service right now because of slow Stacks Tx times. This issue will be resolved soon.'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link>
  </b-col>
  <b-col md="2" sm="12">Address:</b-col>
  <b-col md="12" lg="10">{{smWallet.stxAddress}}</b-col>
</b-row>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'StacksMateWallet',
  components: {
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
  },
  computed: {
    smWallet () {
      const stxAddress = process.env.VUE_APP_STACKS_TRANSFER_ADDRESS
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_ACCOUNT_INFO](stxAddress)
      return wallet
    }
  }
}
</script>
<style lang="scss">
</style>
