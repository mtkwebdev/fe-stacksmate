<template>
<div class="d-flex d-column align-items-center" :style="sectionDimensions">
<div class="d-flex justify-content-start">
  <div class="pr-5" style="width: 55%;">
    <img width="100%" :src="blocks"/>
    <div class="ml-4 tagline" style="position: relative; top: -50px; left: 20px;">Risidio <span class="tagline1">Stacking</span></div>
  </div>
  <div class="" style="width: 40%;">
    <div class="ml-4 my-4 level1">
      Earn Bitcoin while contributing to the development of the user owned internet
    </div>
    <div class="ml-4 my-4 mb-5">
      Swap Lightning btc for Stacks (STX) with rPay - we're lowering the barriers to get Stacking.
    </div>
    <div class="mt-5">
      <div class=" ml-4 my-4 d-flex justify-content-around">
        <b-button to="/get-stacks" variant="info" class="text-white button1" style="width: 40%;">Start Stacking</b-button>
        <b-button v-scroll-to="{ element: '#nextSection', duration: 2500 }" variant="outline-info" class="text-info button2" style="width: 40%;">Learn more</b-button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'HomepageDesktop',
  components: {
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
    }
  }
}
</script>
