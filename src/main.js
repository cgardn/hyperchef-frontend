import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import axios from 'axios';
import state from './state.js';
import api from './api.js';

Vue.config.productionTip = false
Vue.prototype.$state = state
Vue.prototype.$api = api
Vue.prototype.$axios = axios
Vue.prototype.$backend = process.env.VUE_APP_BACKEND_URL
Vue.prototype.$apiVersion = process.env.VUE_APP_API_VERSION

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
