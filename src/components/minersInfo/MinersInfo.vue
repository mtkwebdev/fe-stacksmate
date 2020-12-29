<template>
<div v-if="loading">
  loading
</div>
<b-form v-else>
  <div class="mb-2">
    <h3>Please input a miner's STX address</h3>
    <b-input
      class="mt-3"
      ref="Miner's Address"
      v-model="minersaddress"
      placeholder="STX address"></b-input>
    <div class="mt-3">
      <b-button @click="getAddress()" variant="warning" class="text-white button1" style="width: 49%;">Check Miner's Info</b-button>
    </div>
  </div>
  {{minersaddress}}
  {{filteredMiner}}
    <div v-for="miner in filteredMiner" v-bind:key="miner.id">
      <p>{{miner.btc_address}}</p>
    </div>
</b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MinersInfo',
  components: {
  },
  data () {
    return {
      loading: true,
      minersaddress: null,
      miners: null
    }
  },
  created: function () {
    axios
      .get('http://monitor.stxmining.xyz/mining_info')
      .then(res => {
        this.miners = res.data
      })
      .catch(error => alert(error))
  },
  mounted () {
    this.loading = false
  },
  methods: {
    getAddress: function () {
      this.$emit('getAddress', this.minersaddress)
    }
  },
  computed: {
    // filteredMiners () {
    //   return this.miners.filter(miner => miner.stx_address === this.minersaddress)
    // }
    filteredMiners () {
      return this.miners.filter(miner => {
        return miner.stx_address.indexOf(this.minersaddress) > -1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
