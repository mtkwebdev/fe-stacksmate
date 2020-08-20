<template>
<div class="container mt-5">
  <div class="mx-5 row">
    <div class="col-sm-12">
      <div class="">
        <h4 class="mb-4">Transaction History</h4>
      </div>
      <div class="border-bottom">
        <div v-for="(item, index) in transactions" :key="index">
          <div class="row">
            <div class="col-12 my-1 border p-4">
              <p>Sent {{item.txData.amount}} STX Tokens</p>
              <p>from {{item.txData.fromAddress}}</p>
              <p>to {{item.txData.recipient}}</p>
              <p>at {{updated(item.updated)}}</p>
              <p v-if="item.txData.memo">Memo: {{item.txData.memo}}</p>
              <p>Check at <a class="text-info" target="_blank" :href="explorerUrl(item.txData.result)">testnet tx explorer</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

export default {
  name: 'TransactionHistory',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    explorerUrl (result) {
      return 'https://testnet-explorer.blockstack.org/txid/' + result
    },
    updated (updated) {
      return moment(updated).format('YYYY-MM-DD HH:mm')
    }
  },
  computed: {
    transactions () {
      const transactions = this.$store.getters[APP_CONSTANTS.KEY_TX_HISTORY]
      return transactions
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
