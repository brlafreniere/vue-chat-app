import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        show_login_prompt: false
    },
    mutations: {
        close_login_prompt (state) {
            state.show_login_prompt = false
        },
        open_login_prompt (state) {
            state.show_login_prompt = true
        }
    },
    actions: {
    }
})
