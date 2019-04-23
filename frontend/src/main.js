import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

import App from './App.vue'
import store from './store'
import router from './router'

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://lizardgizzards.com:4001',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: { } //Optional options
}))

//const socket = io('http://lizardgizzards.com:4001');

new Vue({
	router,
	store,
    render: h => h(App)
}).$mount('#app')
