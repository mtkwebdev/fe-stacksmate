<template>
<div class="">
  <div class="" style="position: relative; top: 60px;">
    <img width="100%" :src="blocks"/>
    <div class="ml-4 tagline">Risidio <span class="tagline1">Stacking</span></div>
  </div>
  <div class="mb-5" style="position: relative; top: 70px; height: 250px; ">
    <div class="ml-4 my-4 level1">
      Earning Bitcoin while contributing to the development of the user owned internet
    </div>
    <div class="ml-4 my-4 mb-5 level2">
      Acquire Stacks (STX) with R-Pay and follow our tutorial in order to get started with Stacking.
    </div>
  </div>
  <div class="mt-5">
    <div class=" ml-4 my-4 d-flex justify-content-around">
      <b-button to="/get-stacks" variant="warning" class="text-white button1" style="width: 49%;">Start Stacking</b-button>
      <b-button @click="scrollTo()" variant="outline-warning" class="text-white button2" style="width: 49%;">Learn more</b-button>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'HomepageMobile',
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
  }
}
</script>
