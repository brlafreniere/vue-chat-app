import Vue from 'vue'

import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueMoment from 'vue-moment'
import VuejsDialog from 'vuejs-dialog'
import ActionCableVue from 'actioncable-vue'

import axios from 'axios'
import moment from 'moment-timezone'

import 'vuejs-dialog/dist/vuejs-dialog.min.css'

import App from './App.vue'
import store from './store'
import router from './router'

Vue.use(VueAxios, axios)
Vue.use(VuejsDialog)
Vue.use(VueCookies)
Vue.use(VueMoment, { moment })

const connectionUrl = process.env.VUE_APP_ACTION_CABLE_URL

Vue.use(ActionCableVue, {
    debug: true,
    debugLevel: 'all',
    connectionUrl: connectionUrl,
    connectImmediately: true
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
