<template>
<div class="mr-4">
  <div class="" :style="sectionDimensions">
    <div class="d-block d-md-none">
      <homepage-mobile />
    </div>
    <div class="d-none d-md-block">
      <homepage-desktop />
    </div>
  </div>
  <div class="ml-4 mb-4" :style="sectionDimensions">
    <div class="ml-5 pl-4 pb-5 d-flex justify-content-start">
      <div clas="level1">How to get started with Stacking</div>
    </div>
    <div class="d-flex justify-content-center">
      <div class=""><iframe :style="videoDimensions" width="auto" height="auto" src="https://www.youtube.com/embed/ymPB-P_7LE8" frameborder="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
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
      blocks: require('@/assets/img/Block_Graphic.svg')
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
      return 'height: ' + height + 'px; width: ' + width + 'px;'
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
  text-align: left;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0px;
  color: #FFFFFF;
}
.level2 {
  text-align: left;
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 0px;
}
.button1 {
  width: 158px;
  height: 40px;
  background: #FDA800 0% 0% no-repeat padding-box;
  border-radius: 5px;
  font-weight: 600;
  opacity: 1;
}
.button2 {
  width: 158px;
  height: 40px;
  border: 2px solid #FDA800;
  border-radius: 5px;
  opacity: 1;
  font: SemiBold 14px/18px Montserrat;
  font-weight: 600;
  letter-spacing: 0px;
}
</style>
