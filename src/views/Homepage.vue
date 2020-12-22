<template>
<div class="mb-5 mx-2" style="position: relative; top: 60px;">
  <div class="">
    <div>
      <div class="mb-5 mx-5">
        <div class="mt-0">
          <div class="tagline">Risidio <span class="tagline1">Stacking</span></div>
        </div>
        <div class="level1">
          Earn Bitcoin while contributing to the development of the user owned internet
        </div>
      </div>
    </div>
    <div class="" style="min-height: 400px;">
      <lineChartContainer></lineChartContainer>
    </div>
    <div>
      <div class="mb-5 mx-5">
        <div class="level2">
          Get stacking with tools and services that help you take part and understand the process.
        </div>
        <div class="my-4 d-flex justify-content-between">
          <b-button to="/donate" variant="info" class="text-white button1" style="width: 49%;">Support Us</b-button>
          <b-button to="/information" variant="outline-info" class="text-info button2" style="width: 49%;">Learn more</b-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LineChartContainer from '@/components/charts/ChartContainer'

export default {
  name: 'Homepage',
  components: {
    LineChartContainer
  },
  data () {
    return {
      blocks: require('@/assets/img/Block_Graphic.svg'),
      btcIcon: require('@/assets/img/BTC_icon.svg'),
      stxIcon: require('@/assets/img/STX_icon.svg'),
      lckIcon: require('@/assets/img/Lock_icon.svg')
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
