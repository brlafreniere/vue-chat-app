import Vue from 'vue'
import Vuex from 'vuex'

import {EventBus} from "./event-bus";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        current_user: {},
        current_room: {},
        client_token: null
    },
    mutations: {
        set_client_token: (state, payload) => {
            state.client_token = payload.client_token
        },
        set_current_user: (state, payload) => {
            state.current_user = payload.current_user
            EventBus.$emit('current_user_set')
        },
        set_current_room: (state, payload) => {
            state.current_room = payload.current_room
            EventBus.$emit('current_room_set')
        }
    },
    actions: {
        async refresh_current_user(context) {
            let url = `${process.env.VUE_APP_API_URL}/user/${context.state.client_token}`
            let response = await this._vm.axios.get(url)
            context.commit('set_current_user', {current_user: response.data})

            // if no current_room
            if (Object.keys(context.state.current_room).length === 0) {
                context.commit('set_current_room', {current_room: context.state.current_user.chat_rooms[0]})
            }
        },
        /* 
         * This method will fetch the JSON data from the API rather than simply
         * getting the data from $store.current_user. This is because of how
         * object assignment in JavaScript will create two references to an
         * object, rather than two copies of an object, and because copying
         * objects in JavaScript can have drawbacks. The solution then would
         * seem to be to simply hit the API every time you need some record,
         * rather than making object copies.
         */
        async set_room_by_id(context, payload) {
            let url = `${process.env.VUE_APP_API_URL}/chat_rooms/${payload.room_id}`
            let response = await this._vm.axios.get(url);
            context.commit('set_current_room', {current_room: response.data})
        }
    }
})