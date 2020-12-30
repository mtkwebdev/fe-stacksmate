<template>
<div v-if="loading">
  loading
</div>
<b-form v-else>
  <div class="mb-2">
    <h3>Please input a miner's STX/BTC address</h3>
    <b-input
      class="mt-3"
      ref="Miner's Address"
      v-model="minersAddress"
      placeholder="STX or BTC address"></b-input>
    <div class="mt-3">
      <b-button @click="getMiner()" variant="warning" class="text-white button1" style="width: 49%;">Check Miner's Info</b-button>
    </div>
  </div>
  <!-- {{minersAddress}}
  {{miner}} -->
  <div v-if="miner">
    <!-- <div>BTC Address: </div><div>{{miner.btc_address}}</div> -->
    <b-table striped hover :items="getMiner()" :fields="fields()" ></b-table>
  </div>
</b-form>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MinersInfo',
  components: {
  },
  data () {
    return {
      loading: true,
      miner: null,
      minersAddress: null,
      miners: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    getMiner: function () {
      let miner = this.$store.getters[APP_CONSTANTS.KEY_GET_MINER](this.minersAddress)
      if (!miner) {
        miner = this.$store.getters[APP_CONSTANTS.KEY_GET_MINER_BY_BTC_ADDRESS](this.minersAddress)
        this.$notify({ type: 'warning', title: 'Miner Not Found', text: 'No miner found for address - ' + this.minersAddress })
      }
      this.miner = miner
      const mappedMiner = [{
        'STX Address': miner.stx_address,
        'BTC Address': miner.btc_address,
        'Actual Blocks Won': miner.actual_win,
        'Total Blocks Won': miner.total_win,
        'Total Blocks Mined': miner.total_mined,
        'Total Miner BTC Burned': miner.miner_burned
      }]
      return mappedMiner
    },
    fields () {
      return ['STX Address', 'BTC Address', 'Actual Blocks Won', 'Total Blocks Won', 'Total Blocks Mined', 'Total Miner BTC Burned']
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
