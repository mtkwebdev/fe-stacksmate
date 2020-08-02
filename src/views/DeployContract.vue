<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <wallets />
    </div>
  </div>
  <div class="row">
    <div class="mb-5 col-12">
      <deploy-form/>
    </div>
    <div class="col-12">
      <pre>{{getResponse}}</pre>
    </div>
  </div>
  <b-modal scrollable id="modal-1" title="Result of Some Action">
  <div class="row">
    <div class="col-12 my-1">
      <div>some message</div>
    </div>
  </div>
  <template v-slot:modal-footer>
  </template>
</b-modal>

</div>
</template>

<script>
import Wallets from '@/components/Wallets'
import DeployForm from '@/components/DeployForm'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'DeployContract',
  components: {
    Wallets,
    DeployForm
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
