<template>
<div class="mx-2" style="position: relative; top: 60px;">
  <div class="">
    <div>
      <div class="mb-5 mx-5">
        <div class="mt-0">
          <div class="tagline">Risidio <span class="tagline1">Stacking</span></div>
        </div>
      </div>
    </div>
  </div>
  <div class="mx-auto" id="nextSection">
    <div class="mx-auto text-left mb-5" style="max-width: 450px;">
      <div class="level1 mb-5">How to get started with Stacking</div>
      <div class="text-center level2"><img :src="stxIcon"/></div>
      <div class="level2">Delegation means you can take part even if your below the 0.002% threshold.</div>
      <div class="text-center level2"><img :src="lckIcon"/></div>
      <div class="level2">To get stacker register a bitcoin address and lock up some STX.</div>
      <div class="text-center level2"><img :src="btcIcon"/></div>
      <div class="level2">We remove the barriers and provide transparency.</div>
      <div class="level2 border-bottom">Don't trust - verify!</div>
      <div class="level2 pt-4">Check out <a href="https://daemontechnologies.co/" target="_blank">Daemon Technologies</a> for competitions, hackathons and more.</div>
    </div>
    <div class="d-flex justify-content-center mb-5">
      <div class="">
        <iframe :style="videoDimensions" src="https://www.youtube.com/embed/oJCys8ESqEc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
    <!--
    <div class="d-flex justify-content-center mb-5">
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
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Information',
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
