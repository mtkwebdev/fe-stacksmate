<template>
<div class="mb-5 mx-2" style="position: relative; top: 60px;">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="tagline">Risidio <span class="tagline1">Stacks Stats</span></div>
      </div>
    </div>
    <div class="mb-4" v-if="getFees">
      <h4>Latest Block Stats</h4>
      <b-table striped hover
        :fields="fields()"
        :items="values()"
      >
      </b-table>
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="groupByActualWinPerBlock">
      <chart-container :graphData="groupByActualWinPerBlock" />
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
    <div>
      <div class="mb-5 mx-5">
        <div class="level2">
          Get stacking with tools and services that help you get going.
        </div>
        <div class="w-100 my-4 d-flex justify-content-between">
          <b-button to="/donate" variant="info" class="text-white button1" style="width: 49%;">Support Us</b-button>
          <b-button to="/information" variant="outline-info" class="text-info button2" style="width: 49%;">Learn more</b-button>
        </div>
      </div>
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
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    fields () {
      return ['Block Height', 'Total Burned', 'Average Burn', 'Fastest BTC Tx Fee']
    },
    values () {
      const chainInfo = this.$store.getters[APP_CONSTANTS.KEY_MINING_CHAIN_INFO]
      const fees = this.$store.getters[APP_CONSTANTS.KEY_RATES_FEES]
      if (!chainInfo || !fees) return []
      const mapped = [{
        'Block Height': chainInfo.currentBlockHeight,
        'Total Burned': chainInfo.totalBurnFee,
        'Average Burn': chainInfo.averageBurn,
        'Fastest BTC Tx Fee': fees.fastestFee
      }]
      return mapped
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
    groupByActualWinPerBlock () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_GROUP_ACTUAL_WINS]
    },
    findMinerInfo () {
      return this.$store.getters[APP_CONSTANTS.KEY_MINING_MINER_INFO]
    }
  }
}
</script>
<style lang="scss">
</style>
