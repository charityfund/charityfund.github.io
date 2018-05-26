import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'

new Vue({
  el: '#app',
  render: h => h(App)
})

Vue.prototype.$http = Axios
