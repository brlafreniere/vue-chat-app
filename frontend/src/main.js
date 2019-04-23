import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

import App from './App.vue'
import store from './store'
import router from './router'

const connectionUrl = 'http://lizardgizzards.com:' + process.env.VUE_APP_PORT

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

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
