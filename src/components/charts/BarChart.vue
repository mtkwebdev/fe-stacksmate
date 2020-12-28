<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['graphData'],
  data () {
    return {
    }
  },
  mounted () {
    this.renderChart({
      labels: this.graphData.chartLabels,
      datasets: this.graphData.datasets
    }, this.graphData.options)
  }
}
</script>
