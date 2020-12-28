<template>
  <div class="container" v-if="graphData">
    <div class="row mb-4"><div class="col-12">{{graphData.title}}</div></div>
    <div class="row">
      <div class="col-12">
        <line-chart :graphData="graphData"/>
      </div>
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
