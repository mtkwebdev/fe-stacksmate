<template>
  <div class="container">
    <line-chart
      v-if="loaded"
      :chartData="chartData"
      :chartLabels="chartLabels"/>
  </div>
</template>

<script>
import LineChart from '@/components/charts/Chart.vue'
import axios from 'axios'

export default {
  name: 'LineChartContainer',
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartData: null,
    chartLabels: null
  }),
  mounted () {
    axios.get('https://tapi.risidio.com/mesh/v1/rates/binance')
      .then(response => {
        const filteredData = response.data.filter(data => data.symbol === 'STXBTC')
        this.chartData = filteredData.map(filteredData => filteredData.openPrice)
        this.chartLabels = filteredData.map(filteredData => filteredData.openTime)
        this.chartLabels.forEach((element, index) => {
          this.chartLabels[index] = new Date(element).toLocaleString()
        })
        this.loaded = true
      })
      .catch(err => {
        this.errorMessage = err.response.data.error
        this.showError = true
      })
  }
}
</script>
