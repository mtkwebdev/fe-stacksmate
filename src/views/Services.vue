<template>
<div class="mx-2">
  <div class="mb-5 mt-0">
    <div class="tagline">Risidio <span class="tagline1">Services</span></div>
  </div>
  <div class="mx-auto w-100" id="nextSection">
    <div class="">
      <div class="mb-5 d-flex justify-content-between">
        <div class="mb-5 d-flex justify-content-start">
          <div class="mr-4"><img width="50px" :src="ris3Icon"/></div>
          <div class="">
            <div class="tagline"><span class="tagline1">Paywalls</span></div>
            <div class="">Our implementation of the LSAT - (Lightning Service Authentication
              Token) Protocol enables people to buy things online without having to enter
              credit card details or remember passwords. Combining LSAT with the Stacks
              decentralised application network opens the door to next generation paywall
              services.
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5 d-flex justify-content-between">
        <div class="mb-5 d-flex justify-content-start">
          <div class="mr-4"><img width="50px" :src="ris3Icon"/></div>
          <div class="">
            <div class="tagline"><span class="tagline1">Training</span></div>
            <div class="">We run an apprenticeship program offering training on blockchain
              technologies across the board from business development to marketing and development.
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5 d-flex justify-content-between">
        <div class="mb-5 d-flex justify-content-start">
          <div class="mr-4"><img width="50px" :src="ris3Icon"/></div>
          <div class="">
            <div class="tagline"><span class="tagline1">Payments</span></div>
            <div class="">On-Chain - STX Transfers, Bitcoin payments</div>
            <div class="">Off-Chain - Risidio LSAT Payment Solutions</div>
          </div>
        </div>
        <div class="">
          <iframe :style="videoDimensions" src="https://www.youtube.com/embed/oJCys8ESqEc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

      <div class="mb-5 mb-5 d-flex justify-content-between">
        <div class="mb-4 d-flex justify-content-start">
          <div class="mr-4"><img width="50px" :src="stxIcon"/></div>
          <div class="">
            <div class="tagline"><span class="tagline1">Stacking</span></div>
            <div class="">Earn Bitcoin - by locking your STX tokens</div>
            <div class="">Delegation - even if your below the minimum threshold</div>
          </div>
        </div>
        <div class="">
          <iframe :style="videoDimensions" src="https://www.youtube.com/embed/34KiisI0HHo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

      <div class="mb-5 mb-5 d-flex justify-content-between">
        <div class="mb-4 d-flex justify-content-start">
          <div class="mr-4"><img width="50px" :src="btcIcon"/></div>
          <div class="">
            <div class="tagline"><span class="tagline1">Mining</span></div>
            <div class="">Earn STX - by mining on the Stacks blockchain</div>
            <div class="">Contribute - to the security of the network</div>
          </div>
        </div>
        <div class="">
          <iframe :style="videoDimensions" src="https://www.youtube.com/embed/NwYT02DwJQs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>        </div>
      </div>

      <div class="mb-5 mb-5 d-flex justify-content-between">
        <div class="mb-4 d-flex justify-content-start">
          <div class="mr-4"><img width="50px" :src="ris3Icon"/></div>
          <div class="">
            <div class="tagline"><span class="tagline1">NFTs</span></div>
            <div class="">Manage non fungible tokens on-chain</div>
            <div class="">Off the shelf and tailor made solutions</div>
          </div>
        </div>
        <div class="">
          <iframe :style="videoDimensions" src="https://www.youtube.com/embed/hbTwRFA6dEA" frameborder="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
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
      blocks: require('@/assets/img/Block_Graphic.svg'),
      btcIcon: require('@/assets/img/BTC_icon.svg'),
      stxIcon: require('@/assets/img/stacks-icon-white.svg'),
      risIcon: require('@/assets/img/logo/Risidio_logo_256x256.png'),
      ris3Icon: require('@/assets/img/logo/favicon_dice32x321.png')
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
      width = window.innerWidth / 3
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
