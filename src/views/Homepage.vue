<template>
<section class="" id="section-upload">
  <b-container class="mt-5 pt-5">
    <b-row style="min-height: 10vh" v-if="profile.loggedIn">
      <b-col cols="12" v-if="getBalance > 0">
        <p>You have {{getBalance}} STX tokens in this account - more than enough to pay the
          mint fees!</p>
        <p><b-link to="/create">Start Minting NFTs</b-link></p>
      </b-col>
      <b-col md="8" offset-md="2" sm="10" offset-sm="1" v-else>
        <p class="mb-5 text-center">Your wallet has 0 STX tokens</p>
        <p class="mb-2 text-center">A small amount of STX token is needed to mint a new NFT.
          This is to cover
        </p>
        <ul class="ml-5">
          <li>The minting fee charged by the app <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'This is set by the app where you do you minting and will vary from app to app'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
          <li>The network (also known as the gas) fee <b-link router-tag="span" v-b-tooltip.hover="{ variant: 'light' }" :title="'This is a small fee that is shared by all the people who are working to keep the network secure and transparent'" class="text-white ml-3" variant="outline-success"><b-icon class="ml-0" icon="question-circle"/></b-link></li>
        </ul>
        <label class="mt-5" for="item-name">Recipient Address (<a href="#" @click.prevent="useMyAddress">use mine</a>)</label>
        <b-form-input
          id="item-name"
          v-model="stxAddress"
          :state="stxAddressState"
          aria-describedby="item-name-help item-name-feedback"
          placeholder="Enter name of NFT"
          trim></b-form-input>
      </b-col>
    </b-row>
    <b-row style="min-height: 30vh" class="text-center" v-else-if="webWalletNeeded">
      <b-col cols="12"><p>You need to download the web wallet to login and start minting your very own NFTs!</p></b-col>
      <b-col cols="12"><p><a class="text-white pointer mx-4" :href="webWalletLink" target="_blank">Stacks Web Wallet <b-icon class="ml-3" icon="arrow-up-right-square-fill"/></a></p></b-col>
      <b-col cols="12"><p>Then come back here and reload this tab.. we'll give you the next steps.</p></b-col>
    </b-row>
    <b-row  class="text-center" v-else>
      <b-col cols="12"><p>Please login to get started!</p></b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Homepage',
  components: {
  },
  data () {
    return {
      stxAddress: null,
      nftState: 0
    }
  },
  watch: {
  },
  mounted () {
    this.loading = false
    if (this.$route.query && this.$route.query.stxAddress) {
      this.stxAddress = this.$route.query.stxAddress
    }
    if (this.$route.redirectUrl && this.$route.query.redirectUrl) {
      this.redirectUrl = this.$route.query.redirectUrl
    }
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    if (profile.loggedIn) {
      // this.$router.push('/create')
      this.nftState = 3
    } else {
      this.nftState = 1
    }
  },
  methods: {
    useMyAddress: function () {
      this.stxAddress = this.profile.stxAddress
    }
  },
  computed: {
    itemNameState () {
      if (!this.formSubmitted && !this.stxAddress) return null
      return (this.stxAddress && this.stxAddress.length > 2)
    },
    getBalance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.accountInfo) ? profile.accountInfo.balance : 0
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
