<template>
<div class="mt-5">
  <div class="mx-2 row">
    <div class="col-sm-12">
      <div class="">
        <h4 class="">Transaction History</h4>
      </div>
      <div class="">
        <div v-for="(item, index) in transactions" :key="index">
          <div class="row">
            <div class="col-12 my-1 border-bottom py-4">
              <div>
                <div class="d-flex justify-content-between">
                  <p class="label">{{txType(item.txData.txtype)}}</p>
                  <p>{{updated(item.updated)}}</p>
                </div>
                <p style="font-size: 18px;">{{item.txData.amount}} STX Tokens</p>
                <div class="d-flex justify-content-between">
                  <p class="label">Sender</p>
                  <p>{{truncMe(item.txData.recipient)}}</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p class="label">Dest.</p>
                  <p>{{truncMe(item.txData.fromAddress)}}</p>
                </div>
                <div class="d-flex justify-content-between" v-if="item.txData.txtype !== 'transfer'">
                  <p class="label">Proof</p>
                  <p>{{truncMe(item.txData.preimage)}}</p>
                </div>
                <p v-if="item.txData.memo">Memo: {{item.txData.memo}}</p>
                <div class="mt-4 d-flex justify-content-center">
                  <p><a class="text-info" style="text-decoration: underline;" target="_blank" :href="explorerUrl(item.txData.result)">explorer</a></p>
                </div>
              </div>
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
    },
    truncMe: function (value) {
      if (!value) return ''
      const width = this.$store.getters[APP_CONSTANTS.KEY_SECTION_WIDTH]
      if (width > 500) return value
      value = value.substring(0, 5) + '...' + value.substring(value.length - 5, value.length)
      return value
    },
    txType (type) {
      if (type === 'rpay-swap') {
        return 'Lightning/STX Swap'
      } else {
        return 'Transfer'
      }
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
.label {
  text-transform: capitalize;
}
</style>
