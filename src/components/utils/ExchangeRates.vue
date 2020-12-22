<template>
<b-nav-item-dropdown caret v-if="exchangeRate">
  <template v-slot:button-content>
    STX: <span>{{amountTrunc}}</span> <span v-html="exchangeRate.currency"></span>
  </template>
  <b-dropdown-item v-for="(rate, idx) in exchangeRates" :key="idx" @click.prevent="changeFiatCurrency(rate.currency)">{{rate.currency}}</b-dropdown-item>
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
    fiatSymbol () {
      const exchangeRate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE]
      if (exchangeRate.fiatCurrency === 'EUR') {
        return '&euro;'
      } else if (exchangeRate.fiatCurrency === 'GBP') {
        return '&pound;'
      } else if (exchangeRate.fiatCurrency === 'JPY') {
        return '&yen;'
      } else {
        return '&dollar;'
      }
    },
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
      return (exchangeRate.stxPrice).toFixed(4)
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
