import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import VueScrollTo  from 'vue-scrollto'

import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(VueScrollTo)
new Vue({
  el: '#app',
  store,
  router,
  icons,
  template: '<App/>',
  components: {
    App
  },
})
