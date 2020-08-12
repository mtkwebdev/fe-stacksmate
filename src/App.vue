<template>
<div id="app">
  <div>
    <router-view class="navbar" name="header"/>
    <div class="container mt-5 main d-flex justify-content-start">
      <router-view id="nav"  class="w-75"/>
      <div class="w-25 container mt-5">
        <router-view class="" name="wallets"/>
        <router-view class="" name="converter"/>
      </div>
    </div>
    <notifications position="top right" width="30%" style="margin: 20px; top: 100px;"/>
    <router-view name="footer" />
  </div>
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
  },
  methods: {
    meshEvent: function (data) {
      this.$emit('meshEvent', data)
      console.log('meshEvent', data)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
