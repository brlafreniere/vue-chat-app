import Vue from 'vue'
import store from './store'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'

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

// Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
