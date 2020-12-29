<template>
<div class="">
  <div class="mb-5 mt-0">
    <div class="tagline"><img width="30px" :src="stxIcon"/> Stacks <span class="tagline1">Mining Stats</span></div>
  </div>
  <div class="mb-4">
    <a @click="showMinersInfo = !showMinersInfo"><button class="mb-3">Show Miners' Info</button></a>
    <div v-if="!showMinersInfo" class="mb-5">
      <MinersInfo  />
      <!-- <displayMinersInfo /> -->
    </div>
  </div>
  <div class="">
    <div class="mb-4" v-if="getFees">
      <b-table striped hover
        :fields="fields()"
        :items="values()"
      >
      </b-table>
    </div>
    <div class="mb-4" style="min-height: 400px;" v-if="groupByDistribution">
      <chart-container :graphData="groupByDistribution" />
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
    <!--
    <div>
      <div class="mb-5 mx-5">
        <div class="level2">
          Get stacking with tools and services that help you get going.
        </div>
        <div class="w-100 my-4 d-flex justify-content-between">
          <b-button to="/donate" variant="info" class="text-white button1" style="width: 49%;">Support Us</b-button>
          <b-button to="/services" variant="outline-info" class="text-info button2" style="width: 49%;">Learn more</b-button>
        </div>
      </div>
    </div>
    -->
  </div>
</div>
</template>

<script>
import ChartContainer from '@/components/charts/ChartContainer'
import BarChart from '@/components/charts/BarChart'
import { APP_CONSTANTS } from '@/app-constants'
import MinersInfo from '@/components/minersInfo/MinersInfo'
// import displayMinersInfo from '@/components/minersInfo/displayMinersInfo'

export default {
  name: 'Homepage',
  components: {
    ChartContainer,
    BarChart,
    MinersInfo
    // displayMinersInfo
  },
  data () {
    return {
      showMinersInfo: true,
      stxIcon: require('@/assets/img/stacks-icon-white.svg')
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    fields () {
      return ['Chain', 'Block Height', 'Total Burned', 'Avg Burn Per Block', 'Numb Miners', 'Fastest BTC Tx Fee']
    },
    values () {
      const chainInfo = this.$store.getters[APP_CONSTANTS.KEY_MINING_CHAIN_INFO]
      const fees = this.$store.getters[APP_CONSTANTS.KEY_RATES_FEES]
      if (!chainInfo || !fees) return []
      const mapped = [{
        Chain: 'Krypton',
        'Block Height': chainInfo.currentBlockHeight,
        'Total Burned': chainInfo.totalBurnFee,
        'Avg Burn Per Block': chainInfo.averageBurn,
        'Numb Miners': chainInfo.numbMiners,
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
    groupByDistribution () {
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
