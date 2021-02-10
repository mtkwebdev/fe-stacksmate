<template>
<div class="">
  <div class="mb-5 mt-0">
    <div class="tagline"><img width="30px" :src="stxIcon"/> Stacks <span class="tagline1">Mining Stats</span></div>
  </div>
  <div class="">
    <div class="mb-4" v-if="getFees">
      <b-table striped hover
        :fields="t1Fields()"
        :items="t1Values()"
      >
        <template #cell(Chain)="data">
          <span v-html="data.value"></span>
        </template>
      </b-table>
    </div>
    <p><a href="#" @click.prevent="showT2 = !showT2">Toggle miner table</a> <a v-if="showT2" href="#" @click.prevent="showBTC = !showBTC">- show btc addresses</a>
    </p>
    <div class="mb-4" v-if="showT2" :key="componentKey">
      <b-table striped hover
        :fields="t2Fields()"
        :items="t2Values()"
        :sort-by.sync="sortBy"
      >
      </b-table>
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="groupByActualWins">
      <chart-container :graphData="groupByActualWins" />
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="groupByActualWins1">
      <chart-container :graphData="groupByActualWins1" />
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="groupByBurnFee">
      <chart-container :graphData="groupByBurnFee" />
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="findMinerInfo">
      <chart-container :graphData="findMinerInfo" />
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="getBinanceRates">
      <chart-container :graphData="getBinanceRates" />
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="getFeePredictions">
      <bar-chart :graphData="getFeePredictions" />
    </div>
  </div>
</div>
</template>

<script>
import ChartContainer from '@/components/charts/ChartContainer'
import BarChart from '@/components/charts/BarChart'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Homepage',
  components: {
    ChartContainer,
    BarChart
  },
  data () {
    return {
      componentKey: 0,
      showT2: false,
      showBTC: false,
      stxIcon: require('@/assets/img/stacks-icon-white.svg'),
      sortBy: 'Actual Wins'
    }
  },
  watch: {
    showBTC () {
      this.componentKey += 1
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    t1Fields () {
      return ['Chain', 'Block Height (Min)', 'Block Height (Max)', 'Total Burned', 'Avg Burn Per Block', 'Numb Miners', 'Fastest BTC Tx Fee']
    },
    t1Values () {
      const chainInfo = this.$store.getters[APP_CONSTANTS.KEY_MINING_CHAIN_INFO]
      const fees = this.$store.getters[APP_CONSTANTS.KEY_RATES_FEES]
      if (!chainInfo || !fees) return []
      const mapped = [{
        Chain: '<span class="text-danger">Xenon</span>',
        'Block Height (Max)': chainInfo.currentBlockHeightMax,
        'Block Height (Min)': chainInfo.currentBlockHeightMin,
        'Total Burned': chainInfo.totalBurnFee,
        'Avg Burn Per Block': chainInfo.averageBurn,
        'Numb Miners': chainInfo.numbMiners,
        'Fastest BTC Tx Fee': fees.fastestFee
      }]
      return mapped
    },
    t2Fields () {
      if (this.showBTC) {
        return ['STX Address', 'BTC Address', 'Actual Wins', 'Total Wins', 'Number Mined', 'Total Burned', 'Average Burned Per Block']
      } else {
        return ['STX Address', 'Actual Wins', 'Total Wins', 'Number Mined', 'Total Burned', 'Average Burned Per Block']
      }
    },
    t2Values () {
      const minerInfo = this.$store.getters[APP_CONSTANTS.KEY_MINING_GET_MINER_INFO]
      if (!minerInfo) return []
      if (this.showBTC) {
        return minerInfo.map(function (a) {
          return {
            'STX Address': a.stx_address,
            'BTC Address': a.btc_address,
            'Actual Wins': a.actual_win,
            'Total Wins': a.total_win,
            'Number Mined': a.total_mined,
            'Total Burned': a.miner_burned,
            'Average Burned Per Block': a.miner_burned / a.total_mined
          }
        })
      } else {
        return minerInfo.map(function (a) {
          return {
            'STX Address': a.stx_address,
            'Actual Wins': a.actual_win,
            'Total Wins': a.total_win,
            'Number Mined': a.total_mined,
            'Total Burned': a.miner_burned,
            'Average Burned Per Block': a.miner_burned / a.total_mined
          }
        })
      }
    }
  },
  computed: {
    getBinanceRates () {
      return this.$store.getters[APP_CONSTANTS.KEY_RATES_BINANCE]
    },
    getFeePredictions () {
      return this.$store.getters[APP_CONSTANTS.KEY_RATES_FEE_PREDICTIONS]
    },
    getFees () {
      return this.$store.getters[APP_CONSTANTS.KEY_RATES_FEES]
    },
    getChainInfo () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_CHAIN_INFO]
    },
    groupByBurnFee () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_GROUP_BURN_FEE]
    },
    groupByActualWins () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_GROUP_ACTUAL_WINS]
    },
    groupByActualWins1 () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_GROUP_ACTUAL_WINS1]
    },
    findMinerInfo () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_MINER_INFO]
    },
    getMinerInfo () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_GET_MINER_INFO]
    }
  }
}
</script>
<style lang="scss">
</style>
