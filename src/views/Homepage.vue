<template>
<section class="" id="section-upload" v-if="!loading">
  <b-container fluid class="mt-5" style="min-height: 90vh;">
    <b-row class="text-small">
      <b-col md="12" sm="12">
        <div class="w-md-75 mb-4">
          <h2 class="mb-3">Why Stacks</h2>
          <p class="mb-2">Want to control your own online identity? To
          change social media platform and take your posts with?
          Own digital art just as you own the prints hanging in your living room?</p>
          <p class="mb-2">Get a <a class="text-warning" href="https://www.hiro.so/wallet/install-web" target="_blank">stacks wallet</a>
          and join the conversation about the <span><a class="text-warning" href="https://stacks.org" target="_blank">User Owned Internet?</a></span>
          </p>
          <p><b-link class="pointer" @click.prevent="learnMore = !learnMore">read more..</b-link></p>
          <div v-if="learnMore">
            <p class="mb-3" v-if="profile.loggedIn">You have {{getBalance}} STX in your wallet, with STX you can explore...</p>
            <p class="mb-3" v-else>With STX in your wallet you can explore...</p>
            <ul>
              <li>defi on Bitcoin - about to explode - check out <a class="text-warning" href="https://www.arkadiko.finance/" target="_blank">Arkadiko</a> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'Defi on Bitcoin '" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
              <li>the decentralised web - e.g. <a class="text-warning" href="https://blocksurvey.io/how-it-works" target="_blank">Block Survey</a>  <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'User owned data storage via Gaia is about to revolutionise the way we see the Internet'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
              <li>digital property / NFTs see <a class="text-warning" href="https://thisisnumberone.com/" target="_blank">This Is Number One</a> <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'warning' }" :title="'NFTs on Bitcion bring us closer to the goal of genuine ownership of digital property'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
            </ul>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row class="text-small" v-if="profile.loggedIn">
      <b-col md="12" sm="12">
        <PaymentTrigger :configuration="configuration"/>
      </b-col>
    </b-row>
    <b-row style="min-height: 30vh" class="text-center" v-else-if="webWalletNeeded">
      <b-col cols="12"><p>You need to download the web wallet to login and start minting your very own NFTs!</p></b-col>
      <b-col cols="12"><p><a class="text-white pointer mx-4" :href="webWalletLink" target="_blank">Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></p></b-col>
      <b-col cols="12"><p>Then come back here and reload this tab.. we'll give you the next steps.</p></b-col>
    </b-row>
    <b-row class="text-center mt-5" v-else>
      <b-col cols="12">
        <b-button variant="warning" @click.prevent="startLogin()">Login To Swap</b-button>
      </b-col>
    </b-row>
    <b-row class="text-center" v-if="redirectUrl">
      <b-col><a :href="redirectUrl">Back whence thy came!</a></b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import PaymentTrigger from '@/components/payment/PaymentTrigger'

export default {
  name: 'Homepage',
  components: {
    PaymentTrigger
  },
  data () {
    return {
      learnMore: false,
      loading: true,
      showSMWallet: false,
      stacksMateAccount: null,
      recipient: null,
      redirectUrl: null,
      showRpay: false,
      amountFiat: 5
    }
  },
  watch: {
  },
  mounted () {
    const data = { stxAddress: process.env.VUE_APP_STACKS_TRANSFER_ADDRESS }
    this.$store.dispatch('rpayAuthStore/fetchAccountInfo', data)
    this.$store.dispatch('paymentStore/fetchLastStacksMateTransaction')
    if (this.$route.query.redirectUrl) {
      this.redirectUrl = this.$route.query.redirectUrl
    }
    this.loading = false
  },
  methods: {
    startLogin () {
      // this.$emit('updateEventCode', { eventCode: 'connect-login' })
      const myProfile = this.$store.getters['rpayAuthStore/getMyProfile']
      if (myProfile.loggedIn) {
        this.$emit('connect-login', myProfile)
      } else {
        this.$store.dispatch('rpayAuthStore/startLogin').catch(() => {
          // https://www.hiro.so/wallet/install-web
          this.$store.commit(APP_CONSTANTS.SET_WEB_WALLET_NEEDED)
        })
      }
    }
  },
  computed: {
    configuration () {
      return this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
    },
    getBalance () {
      return (this.profile && this.profile.accountInfo) ? this.profile.accountInfo.balance : 0
    },
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    webWalletNeeded () {
      const webWalletNeeded = this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_NEEDED]
      return webWalletNeeded
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    }
  }
}
</script>
<style lang="scss">
</style>
