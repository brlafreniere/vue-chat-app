
<template>
    <div id="app">
        <ChatApp @login="login()" @logout="logout()" />
    </div>
</template>

<script>
import ChatApp from './components/ChatApp.vue'

export default {
    name: 'App',
    components: {
        ChatApp
    },
    methods: {
        login: (username, password) => {
            this.$auth.login({ username: username, password: password }).then(() => {
                // Execute application logic after successful login
            })
        },

        register: (username, password) => {
            this.$auth.register({ username: username, password: password }).then(() => {
                // Execute application logic after successful registration
            })
        }
    }
}
</script>

<style>
</style>
