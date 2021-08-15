<template>
<b-row class="text-small py-3">
  <b-col cols="12">
    <div v-for="(transaction, index) in transactions" :key="index" class="mb-3">
      <UserTransaction :transaction="transaction"/>
    </div>
  </b-col>
</b-row>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import UserTransaction from './UserTransaction'

export default {
  name: 'StacksMateWallet',
  components: {
    UserTransaction
  },
  data () {
    return {
    }
  },
  props: ['recipient'],
  mounted () {
  },
  methods: {
  },
  computed: {
    transactions () {
      const transactions = this.$store.getters[APP_CONSTANTS.KEY_USER_TRANSACTIONS](this.profile.stxAddress)
      return transactions
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
