<template>
<div id="app">
  <div>
    <router-view class="navbar" name="header"/>
    <router-view class="main" id="nav"/>
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
