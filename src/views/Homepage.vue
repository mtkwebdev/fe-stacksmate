<template>
<div class="mx-2">
  <div class="" :style="sectionDimensions">
    <div class="d-block d-md-none">
      <homepage-mobile />
    </div>
    <div class="d-none d-md-block">
      <homepage-desktop />
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
      <div class="level2">Don't trust - verify!</div>
      <div class="level2 border-top pt-4">For a full tutorial or any questions, watch our videos below, or reach out to us.</div>
    </div>
    <div class="d-flex justify-content-center mb-5">
      <div class="">
        <iframe :style="videoDimensions" src="https://www.youtube.com/embed/ECMQdapdNyM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
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
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import HomepageMobile from '@/components/homepage/HomepageMobile'
import HomepageDesktop from '@/components/homepage/HomepageDesktop'

export default {
  name: 'Homepage',
  components: {
    HomepageMobile,
    HomepageDesktop
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
    background () {
      return {
        border: '1pt solid #fff',
        padding: '0 0 0 0',
        'margin-right': '100px',
        height: 'auto',
        width: '100%',
        'background-repeat': 'no-repeat',
        'background-image': `url(${this.blocks})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'contain',
        'background-size': 'cover',
        'background-color': '#000',
        opacity: 1
      }
    }
  },
  computed: {
    sectionDimensions () {
      const height = this.$store.getters[APP_CONSTANTS.KEY_SECTION_HEIGHT]
      return 'min-height: ' + height + 'px; width: auto;'
    },
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
@import "@/assets/scss/custom.scss";
.video-container {
  max-width: 768px;
  max-height: 432px;
  margin: 0 auto;
}
.tagline {
  font-size: 28px;
  font-weight: 300;
  position: relative;
  top: -35px;
}
.tagline1 {
  font-weight: 600;
  color: $yellow;
}
.level1 {
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
}
.level2 {
  font-size: 16px;
  font-weight: 300;
  margin-top: 20px;
}
.button1 {
  width: 158px;
  height: 40px;
  font-weight: 600;
  background: #50B1B5 0% 0% no-repeat padding-box;
  border-radius: 22px !important;
}
.button2 {
  width: 158px;
  height: 40px;
  background: #323131 0% 0% no-repeat padding-box !important;
  border: 0px solid #50B1B5 !important;
  border-radius: 22px !important;
  font-weight: 600;
}
.button2:hover {
  color: #fff !important;
}
</style>
