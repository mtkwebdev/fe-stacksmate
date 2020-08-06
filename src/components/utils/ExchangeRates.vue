<template>
<b-nav-item-dropdown caret v-if="exchangeRate">
  <template v-slot:button-content>
    STX: <span>{{amountTrunc}}</span> {{exchangeRate.fiatCurrency}}
  </template>
  <b-dropdown-item v-for="(rate, idx) in exchangeRates" :key="idx" @click.prevent="changeFiatCurrency(rate.fiatCurrency)">{{rate.fiatCurrency}}</b-dropdown-item>
</b-nav-item-dropdown>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ExchangeRates',
  props: {
  },
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    changeFiatCurrency (fiatCurrency) {
      if (fiatCurrency) {
        this.$store.commit(APP_CONSTANTS.COMMIT_FIAT_CURRENCY, fiatCurrency)
      } else {
        this.$notify({ type: 'warning', title: 'Exchange Rates', text: 'Rate not available!' })
      }
    }
  },
  computed: {
    amountTrunc () {
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      // const tunced = Math.round(exchangeRate.amountStx * 10000)
      return (1 / (exchangeRate.amountStx)).toFixed(4)
    },
    exchangeRate () {
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      return exchangeRate
    },
    exchangeRates () {
      const rates = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATES]
      return rates
    }
  }
}
</script>

<style scoped>
</style>
