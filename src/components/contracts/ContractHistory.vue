<template>
<b-form inline>
  <div class="mt-4">
    <div class="mb-3">
      <b-form-select @change="changeContract" v-model="contractName" :options="contractHistory" placeholder="Contract History"></b-form-select>
      <b-form-text>
        <span>Select contract to see deployment details and call functions.</span>
      </b-form-text>
    </div>
  </div>
</b-form>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'ContractHistory',
  props: {
  },
  components: {
  },
  data () {
    return {
      contractName: 'zero'
    }
  },
  methods: {
    changeContract (contractHash) {
      if (contractHash) {
        this.$store.commit(APP_CONSTANTS.COMMIT_CONTRACT_CURRENT, contractHash)
      } else {
        this.$notify({ type: 'warning', title: 'Contracts', text: 'Contracts not available!' })
      }
    }
  },
  computed: {
    currentContract () {
      const currentContract = this.$store.getters[APP_CONSTANTS.KEY_CONTRACT_CURRENT]
      return currentContract
    },
    contractHistory () {
      const contracts = this.$store.getters[APP_CONSTANTS.KEY_CONTRACT_HISTORY]
      const history = []
      history.push({ text: 'select contract', value: 'zero' })
      if (contracts) {
        contracts.forEach(function (contract) {
          history.push({ text: contract.name, value: contract.contractHash })
        })
      }
      return history
    }
  }
}
</script>

<style scoped>
li {
  list-style: none;
}
.nav-link {
  padding: 0 !important;
}
</style>
