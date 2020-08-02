<template>
<div v-if="!loading">
  <div class="source-code pb-4" v-for="(item, index) in publicFunctions" :key="index">
    {{item.access}} : <b><a href="#" @click.prevent="toggleMethod(item.name)">{{item.name}}</a></b>
    (<span v-for="(arg, index1) in item.args" :key="index1">{{arg.name}}:{{arg.type}} </span>)
    <span v-if="item.outputs">: <span>{{item.outputs.type}}</span></span>
    <div :id="'togglers_' + index">halleo</div>
  </div>
  <div class="danger-code pb-4" v-for="(item, index3) in privateFunctions" :key="index3">
    {{item.access}} : <b>{{item.name}}</b>
    (<span v-for="(arg, index111) in item.args" :key="index111">{{arg.name}}:{{arg.type}} </span>)
    <span v-if="item.outputs">: <span>{{item.outputs.type}}</span></span>
  </div>
</div>
</template>

<script>

export default {
  name: 'InterfaceFunctions',
  components: {
  },
  props: ['ifaceFunctions'],
  data () {
    return {
      togglers: [],
      loading: true
    }
  },
  mounted () {
    for (let i = 0; i < this.ifaceFunctions.length; i++) {
      this.togglers[i] = true
    }
    this.loading = false
  },
  methods: {
    toggleMethod: function (itemName) {
      this.togglers[itemName] = itemName
    }
  },
  computed: {
    publicFunctions () {
      return this.ifaceFunctions.filter(item => item.access === 'public').sort(function (a, b) {
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
      return this.ifaceFunctions.filter(item => item.access === 'private')
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
