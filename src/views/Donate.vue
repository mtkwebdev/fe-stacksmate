<template>
<div class="mx-2" style="position: relative; top: 60px;">
  <div class="">
    <div>
      <div class="mb-5 mx-5">
        <div class="mt-0">
          <div class="tagline">Risidio <span class="tagline1">Stacking</span></div>
        </div>
        <div class="level1">
          Earn Bitcoin while contributing to the development of the user owned internet
          <rpay-entry :paymentConfig="configuration" v-if="showLogin"/>
        </div>
      </div>
    </div>
  </div>
    <div class="d-flex justify-content-center mb-5">
      <div class="">
        <iframe :style="videoDimensions" src="https://www.youtube.com/embed/ECMQdapdNyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
    <!--
    <div class="d-flex justify-content-center mb-5">
      <div class="">
        <iframe :style="videoDimensions" src="https://www.youtube.com/embed/oJCys8ESqEc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
    <div class="d-flex justify-content-center mb-5">
      <div class="">
        <iframe :style="videoDimensions" src="https://www.youtube.com/embed/otAh4OTToDY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>      </div>
    </div>
    <div class="d-flex justify-content-center mb-5">
      <div class="">
        <iframe :style="videoDimensions" src="https://www.youtube.com/embed/ymPB-P_7LE8" frameborder="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
    -->
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Donate',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
  },
  computed: {
    videoDimensions () {
      let width = this.$store.getters[APP_CONSTANTS.KEY_SECTION_WIDTH]
      width = window.innerWidth - 200
      const height = width * 432 / 768
      const maxHeight = 750 * 432 / 768
      const minHeight = 320 * 432 / 768
      return 'height: ' + height + 'px; width: ' + width + 'px; max-width: 750px; max-height: ' + maxHeight + 'px;' + 'px; min-width: 320px; min-height: ' + minHeight + 'px;'
    }
  }
}
</script>
<style lang="scss">
</style>
