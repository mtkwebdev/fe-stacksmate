<template>
<div id="app">
  <router-view name="header"/>
  <div>
    <div class="container">
      <router-view class="my-3" name="wallets"/>
      <router-view id="nav"  class="w-100" style="position: relative; top: 60px;"/>
    </div>
    <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
  </div>
  <router-view name="footer" />
</div>
</template>
<script>

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  },
  watch: {
  },
  mounted () {
    this.$store.dispatch('fetchWalletBalances')
    const myself = this
    let resizeTimer
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        myself.$store.commit('setWinDims')
        myself.componentKey += 1
      }, 200)
    })
  },
  beforeDestory () {
    this.$store.dispatch('stopWebsockets')
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
