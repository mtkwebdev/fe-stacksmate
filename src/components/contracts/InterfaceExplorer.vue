<template>
<div class="container">
  <div>
    <h4>Contract Interface Explorer</h4>
  </div>
  <h6><a href="#" @click.prevent="togglers.functions = !togglers.functions"><i class="far fa-heart"></i> Functions</a></h6>
  <interface-functions v-if="togglers.functions" :ifaceFunctions="iface.functions"/>
  <h6><a href="#" @click.prevent="togglers.maps = !togglers.maps"><i class="far fa-heart"></i> Maps</a></h6>
  <div v-if="togglers.maps">
    <div class="source-code pb-4" v-for="(item, index) in iface.maps" :key="index">
      {{item}}
    </div>
  </div>
  <h6><a href="#" @click.prevent="togglers.variables = !togglers.variables"><i class="far fa-heart"></i> Variables</a></h6>
  <div v-if="togglers.variables">
    <div class="source-code pb-4" v-for="(item, index) in iface.variables" :key="index">
      {{item}}
    </div>
  </div>
  <h6><a href="#" @click.prevent="togglers.fungibles = !togglers.fungibles"><i class="far fa-heart"></i> Fungible Tokens</a></h6>
  <div v-if="togglers.fungibles">
    <div class="source-code pb-4" v-for="(item, index) in iface.fungibles" :key="index">
      {{item}}
    </div>
  </div>
  <h6><a href="#" @click.prevent="togglers.nonFungibles = !togglers.nonFungibles"><i class="far fa-heart"></i> Non Fungible Tokens</a></h6>
  <div v-if="togglers.nonFungibles">
    <div class="source-code pb-4" v-for="(item, index) in iface.nonFungibles" :key="index">
      {{item}}
    </div>
  </div>
</div>
</template>

<script>
import InterfaceFunctions from './InterfaceFunctions'

export default {
  name: 'InterfaceExplorer',
  components: {
    InterfaceFunctions
  },
  props: ['iface'],
  data () {
    return {
      togglers: {
        functions: false,
        maps: false,
        variables: false,
        fungibles: false,
        nonFungibles: false
      }
    }
  },
  methods: {
  },
  computed: {
    publicFunctions () {
      return this.iface.functions.filter(item => item.access === 'public').sort(function (a, b) {
        const nameA = a.name.toUpperCase() // ignore upper and lowercase
        const nameB = b.name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        // names must be equal
        return 0
      })
    },
    privateFunctions () {
      return this.iface.functions.filter(item => item.access === 'private')
    }
  }
}
</script>
<style lang="scss" scoped>
h6 {
  margin-top: 20px;
  font-weight: 900;
  font-size: 24px;
}
.source-code {
  background: #e7eda3;
  border: 2pt solid #342343;
  color: #342343;
  padding: 25px;
}
.danger-code {
  background: #fca089;
  border: 2pt solid #342343;
  color: #342343;
  padding: 25px;
}
</style>
