import Vue from 'vue'
import FishUI from 'fish-ui'
import App from './App.vue'

Vue.use(FishUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: (h) => h(App),
})
