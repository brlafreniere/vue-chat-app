import Vue from 'vue'

import VueAuthenticate from 'vue-authenticate'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueMoment from 'vue-moment'
import VueSocketIO from 'vue-socket.io'
import VuejsDialog from 'vuejs-dialog'

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

const connectionUrl = process.env.VUE_APP_API_URL

Vue.use(new VueSocketIO({
    debug: true,
    connection: connectionUrl,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: { }
}))

Vue.use(VueAuthenticate, {
    baseUrl: process.env.VUE_APP_API_URL
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
