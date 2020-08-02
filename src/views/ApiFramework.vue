<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <wallets />
    </div>
  </div>
  <div class="my-5 mr-3 w-25 d-flex justify-content-between">
    <div class="mr-3"><a href="#" @click.prevent="openSection(1)">Accounts</a></div>
    <div class="mr-3"><a href="#" @click.prevent="openSection(2)">Blocks</a></div>
    <div class="mr-3"><a href="#" @click.prevent="openSection(3)">Faucets</a></div>
    <div class="mr-3"><a href="#" @click.prevent="openSection(4)">Transactions</a></div>
    <div class="mr-3"><a href="#" @click.prevent="openSection(6)">Contracts</a></div>
  </div>
  <div class="row">
    <div class="mb-5 col-12">
      <accounts v-if="section === 1" @meshEvent="meshEvent"/>
      <blocks v-if="section === 2" @meshEvent="meshEvent"/>
      <faucets v-if="section === 3" @meshEvent="meshEvent"/>
      <transactions v-if="section === 4" @meshEvent="meshEvent"/>
      <smart-contracts v-if="section === 6" @meshEvent="meshEvent"/>
    </div>
    <div class="col-12">
      <pre>{{getResponse}}</pre>
    </div>
  </div>
</div>
</template>

<script>
import Wallets from '@/components/Wallets'
import Accounts from '@/components/rpcgroups/Accounts'
import Blocks from '@/components/rpcgroups/Blocks'
import Faucets from '@/components/rpcgroups/Faucets'
import Transactions from '@/components/rpcgroups/Transactions'
import SmartContracts from '@/components/rpcgroups/SmartContracts'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ApiFramework',
  components: {
    Wallets,
    Accounts,
    Blocks,
    Faucets,
    Transactions,
    SmartContracts
  },
  props: ['lookAndFeel'],
  data () {
    return {
      section: 1,
      loading: true,
      response: null
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    meshEvent: function (data) {
      this.response = null
      this.$store.dispatch('fireEvent', data).then(response => {
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    openSection: function (sectionId) {
      this.$store.commit('addResponse', null)
      this.section = sectionId
    }
  },
  computed: {
    getResponse () {
      const response = this.$store.getters[APP_CONSTANTS.KEY_API_RESPONSE]
      return response
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
