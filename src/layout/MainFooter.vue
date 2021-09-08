<template>
  <div class="mx-0 text-small bg-black" v-if="content">
    <div class="footer-break-line" :style="'background-image: url(' + getBreakLine + ')'"></div>
    <b-container align-h="center">
      <b-row align-h="start" class="footer-top">
        <b-col md="4" sm="12" class="">
          <h1><b-link class="text-warning" to="/home"><br/>Stacks Mate</b-link></h1>
        </b-col>
        <b-col md="2" sm="6" class="footer-top--content">
          <div class="column-header">Code</div>
          <div>
            Fork us or raise PRs / issues
          </div>
          <div>
            <a :href="'https://github.com/radicleart/fe-stacksmate/issues'" target="_blank">Issues</a>
          </div>
          <div>
            <a :href="'https://github.com/radicleart/fe-stacksmate/pulls'" target="_blank">Pull Requests</a>
          </div>
          <div>
            <a :href="'https://github.com/radicleart/fe-stacksmate'" target="_blank">StacksMate Client</a>
          </div>
          <div>
            <a :href="'https://github.com/radicleart/ms-stacksmate'" target="_blank">StacksMate Service</a>
          </div>
        </b-col>
        <b-col md="2" sm="6"  class="footer-top--content">
          <div class="column-header">Videos</div>
          <div>
            Help Wanted!
          </div>
          <div v-scroll-to="{ offset: -60, element: '#thisisone', duration: 1000 }">
            <a target="_blank" href="https://www.youtube.com/watch?v=oVEddTQ-95k">Why Stacks</a>
          </div>
          <div v-scroll-to="{ offset: -60, element: '#chemicalx', duration: 1000 }">
            <a target="_blank" href="https://www.youtube.com/watch?v=34KiisI0HHo&t=2s">#1 NFTs</a>
          </div>
          <div v-scroll-to="{ offset: -60, element: '#chemicalx', duration: 1000 }">
            <a target="_blank" href="https://www.youtube.com/watch?v=oJCys8ESqEc">Lightning Wallet</a>
          </div>
        </b-col>
        <b-col md="2" sm="6"  class="footer-top--content">
          <div class="column-header">Contact</div>
          <div>
            Social media coming soon!
          </div>
          <div>
            <a :href="'mailto:mike@thisisnumberone.com'" target="_blank">Enquiries</a>
          </div>
        </b-col>
        <b-col md="2" sm="6"  class="footer-top--content">
          <div class="column-header">Partners</div>
          <div>
            Projects we are indebted to..
          </div>
          <div v-for="(item,index) of content.partners_column" :key="index">
            <div v-if="item.title_of_the_link[0].type === 'paragraph'"><a :href="item.link.url" target="_blank">{{ item.title_of_the_link[0].text }}</a></div>
            <div v-else-if="item.title_of_the_link[0].type === 'image'">
              <a :href="item.link.url" target="_blank"><img width="50px" :src=item.title_of_the_link[0].url :alt=item.title_of_the_link[0].alt></a>
            </div>
          </div>
          <div><a href="https://lightning.engineering/" target="_blank">Lightning Labs</a></div>
          <div><a :href="webWalletLink" target="_blank">Hiro Wallet</a></div>
        </b-col>
      </b-row>
      <b-row class="py-4 justify-content-start footer-bottom">
        <div class="footer-bottom--left">
          For the <b-icon icon="heart-fill" class="text-danger"/> of crypto!
        </div>
      </b-row>
        <!--
      <div class="d-none d-sm-flex justify-content-between footer-bottom">
        <div class="footer-bottom--left">
          {{ content.left_bottom_corner[0].text }}
        </div>

        <div class="footer-bottom--right">
          <b-link to="/information/info-terms">Term of use</b-link>
          <b-link to="/information/info-privacy-policy">Privacy policy</b-link>
        </div>
      </div>

      <div class="d-block d-sm-none text-center footer-bottom">
        <div class="footer-bottom--left mb-1">
          <b-link to="/information/info-terms">Term of use</b-link>
          <b-link to="/information/info-privacy-policy">Privacy policy</b-link>
        </div>

        <div class="footer-bottom--right">
          {{ content.left_bottom_corner[0].text }}
        </div>
      </div>
        -->

    </b-container>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainFooter',
  data () {
    return {
      webWalletNeeded: false,
      stxIcon: require('@/assets/img/stacks-icon-white.svg'),
      logo: require('@/assets/img/navbar/logo-footer.svg')
    }
  },
  methods: {
    startLogout () {
      this.$store.dispatch('rpayAuthStore/startLogout').then(() => {
        // localStorage.clear()
        // sessionStorage.clear()
        if (this.$route.name !== 'splash') {
          this.$router.push('/')
        }
      })
    },
    startLogin () {
      this.$store.dispatch('rpayAuthStore/startLogin').then(() => {
        if (this.$route.name !== 'my-nfts') {
          this.$router.push('/my-nfts')
        }
      }).catch((err) => {
        console.log(err)
        // https://www.hiro.so/wallet/install-web
        this.webWalletNeeded = true
      })
    }
  },
  computed: {
    webWalletLink () {
      if (this.$browserDetect.isFirefox) {
        return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_FIREFOX]
      }
      return this.$store.getters[APP_CONSTANTS.KEY_WEB_WALLET_LINK_CHROME]
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    },
    getBreakLine () {
      return this.$store.getters[APP_CONSTANTS.KEY_BREAK_LINE]
    },
    content () {
      const content = this.$store.getters['contentStore/getMainFooter']
      return content
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/custom.scss";
.footer-break-line {
  height: 10px;
}

/* FOOTER GENERAL STYLE */
.footer-container {
  padding: 90px 24px 24px;
  color: #ffffff;
}
.footer-container a, .footer-container a:hover {
  color: #ffffff;
}

/* FOOTER TOP ROW STYLE */
.footer-top--content {
  text-align: top;
}
.footer-top--content a {
  color: $info;
}
.footer-top--content div:not(:last-child) {
  margin-bottom: 15px;
}
/* Column headers */
.column-header {
  font-weight: 700;
  margin-bottom: 25px;
  color: $warning;
}
/* Social icons */
.social-links {
  margin-top: 0px;
}
.social-links a:not(:last-child){
  margin-right: 30px;
}
/* Logo */
.footer-logo {
  text-align: left;
}
.footer-logo img {
  margin-left: 0;
  margin-bottom: 50px;
}

/* FOOTER BOTTOM ROW STYLE */
.footer-bottom {
  margin-top: 50px;
}
.footer-bottom a:first-child {
  margin-right: 27px;
}

/* MOBILE STYLE */
@media only screen and (min-width: 992px) {
  .footer-logo {
    text-align: left;
  }
  .footer-logo img {
    margin-left: 40px;
    margin-bottom: 0;
  }
  .footer-top--content {
    text-align: left;
  }
}

@media only screen and (max-width: 700px) {
  .social-links {
    display: flex;
    flex-flow: column;
    margin-top: 0;
  }
  .social-links a:not(:last-child){
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>
