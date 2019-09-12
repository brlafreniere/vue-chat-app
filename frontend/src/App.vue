<template>
    <div id="app">
        <ChatApp />
        <LoginPrompt @login="login" />
    </div>
</template>

<script>
import ChatApp from './components/ChatApp.vue'
import LoginPrompt from './components/LoginPrompt.vue'

export default {
    name: 'App',
    components: {
        ChatApp,
        LoginPrompt
    },
    methods: {
        login (username, password) {
            this.$auth.login({ username: username, password: password })
                .then(() => {
                    this.$store.commit('close_login_prompt')
                }).catch(error => {
                    console.log(error)
                })
        },
        register (username, password) {
            this.$auth.register({ username: username, password: password }).then(() => {
                // Execute application logic after successful registration
            })
        }
    }
}
</script>

<style>
</style>
