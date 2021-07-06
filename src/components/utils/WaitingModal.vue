<template>
  <b-modal size="lg" id="waiting-modal">
    <b-card-group>
      <b-card>
        <template #header>
          <b-row>
            <b-col cols="1" offset="0">
              <img :src="passport" width="50px;"/>
            </b-col>
            <b-col cols="6" class="ml-4 text-small">
              <br/>Watch out for your Digital PROM Passport <br/>and invite to the launch party $10
            </b-col>
          </b-row>
        </template>
        <template #footer>
        </template>
        <b-card-text class="mt-3 text-center" style="height: 20vh;">
          <div v-html="modalMessage"></div>
        </b-card-text>
      </b-card>
    </b-card-group>
    <template #modal-header="{ close }">
      <div class="text-black text-warning w-100 d-flex justify-content-end">
        <b-button size="sm" variant="dark" @click="close()"  class="m-0 p-1 text-dark" style="max-width: 30px !important; max-height: 30px !important;">
          <img class="filter-black" :src="cross" alt="close" style="max-width: 20px !important; max-height: 20px !important;"/>
        </b-button>
      </div>
    </template>
    <template #modal-footer class="text-center"><div class="w-100"><p class="footer-text"></p></div></template>
  </b-modal>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'WaitingModal',
  components: {
  },
  data () {
    return {
      passport: require('@/assets/img/passport.png'),
      cross: require('@/assets/img/cross.svg')
    }
  },
  methods: {
  },
  computed: {
    modalMessage () {
      return this.$store.getters[APP_CONSTANTS.KEY_MODAL_MESSAGE]
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-content {
  border: none !important;
  border-radius: 0px !important;
  min-height: 200px;
  color: rgb(7, 0, 0);
  padding: 50px;
  background: transparent !important;
}

</style>
