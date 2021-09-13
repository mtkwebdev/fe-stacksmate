<template>
<b-container class="text-white my-5 p-4" v-if="loaded">
  <h1 class="mb-5">Application Administration</h1>
  <b-tabs v-model="tabIndex" small card left content-class="mt-3 text-small">
    <b-tab title="Transactions">
      <Transactions />
    </b-tab>
  </b-tabs>
</b-container>
</template>

<script>
import Transactions from '@/components/admin/Transactions'

export default {
  name: 'ApplicationAdmin',
  components: {
    Transactions
  },
  data () {
    return {
      tabIndex: 0,
      loaded: false
    }
  },
  mounted () {
    this.$store.dispatch('paymentStore/fetchAllStacksMateTransactions')
    this.loaded = true
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
