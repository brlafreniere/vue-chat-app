<template>
    <div
        id="chat-app-container"
        class="container"
    >
        <div id="messages-box">
            <div
                v-for="message in messages"
                :key="message.id"
            >
                {{ message.text }}
            </div>
        </div>
        <div id="input-container">
            <input
                id="new-message-input"
                v-model="message_input"
                type="text"
                placeholder="type message here..."
                @keyup.enter="create_message()"
            >
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            messages: [],
            message_input: ''
        }
    },
    sockets: {
        connect () {
        },
        load_messages (messages) {
            this.messages = messages
        },
        new_message (message) {
            this.messages.push(message)
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        }
    },
    methods: {
        create_message () {
            this.$socket.emit('create_message', this.message_input)
            this.message_input = ''
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main-box {
    padding: 25px;
}

#messages-box {
    background-color: #18A2B6;
    padding: 25px;
    color: white;
    height: 500px;
    overflow-y: scroll;
}

#input-container {
    background-color: black;
    padding: 25px;
}

#new-message-input {
    margin-top: auto;
    margin-bottom: auto;
}
</style>
