<template>
    <div id="app">
        <ChatApp />
        <LoginPrompt />
    </div>
</template>

<script>
import ChatApp from './components/ChatApp.vue'
import LoginPrompt from './components/LoginPrompt.vue'

export default {
    name: 'App',
    components: {
        ChatApp,
        LoginPrompt,
    }
}
</script>

<style>
.button-flex-row {
    display: flex;
    justify-content: center;
}

.full-width {
    width: 100%;
}
</style>
