<template>
<div>
  <footer class="text-white" style="height: 0px;">
  </footer>
</div>
</template>
<script>
export default {
  props: {
    backgroundColor: String,
    type: String
  },
  data () {
    return {
      logo: require('@/assets/img/logo/logoWhite.svg'),
      year: new Date().getFullYear()
    }
  },
  methods: {
    getContent (contentType) {
      const content = this.$store.getters['contentStore/getHomepage']
      if (content) {
        let sitecontent = ''
        content.footer[0][contentType].forEach(function (option) {
          sitecontent += option.text
        })
        return sitecontent
      }
      return ''
    }
  },
  computed: {
  }
}
</script>
<style scoped>
.h2 {
  font-size: 17px;
  font-weight: 200;
}
.para {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 0 0 0;
  margin: 0;
}
h2 {
  font-size: 17px;
  font-weight: 200;
}

p {
  font-size: 12px;font-weight: 700; padding: 5px 0 0 0; margin: 0;
}

.logoFooter {
  width: 255px;
  height: 100px;
}

@media only screen and (max-width: 900px) {
  .logoFooter {
    width: 138px;
    height: 55px;
  }
}

</style>
