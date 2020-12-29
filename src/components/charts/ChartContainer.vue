<template>
  <div class="" v-if="graphData">
    <div><h4>{{graphData.title}}</h4></div>
    <div><p>{{graphData.description}}</p></div>
    <div>
      <line-chart :graphData="graphData"/>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/charts/Chart.vue'

export default {
  name: 'LineChartContainer',
  components: { LineChart },
  props: ['graphData'],
  mounted () {
  }
}
</script>
