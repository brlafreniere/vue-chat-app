<template>
    <div
        id="chat-app-container"
        class="container-fluid"
    >
        <div id="info-window">
            Current Nickname: {{ current_nickname }}
            <button @click="prompt_nickname()">
                Set Nickname
            </button>
        </div>
        <div id="chat-window">
            <div id="messages-box">
                <div
                    v-for="message in messages"
                    :key="message.id"
                >
                    {{ message.nickname }}: {{ message.text }}
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
    </div>
</template>

<script>
import sha1 from 'sha1'

export default {
    data () {
        return {
            messages: [],
            message_input: '',
            current_nickname: '',
            client_string: ''
        }
    },
    mounted () {
        if (this.check_client_string()) {
            var result = this.get_nickname_from_server()
            if (result) {
                this.current_nickname = this.generate_nickname()
                this.register_nickname_with_server(this.current_nickname)
            }
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
        generate_nickname () {
            // 5 digit number
            var randomNumber = Math.floor(Math.random() * 100000)
            var nickname = 'rando_' + randomNumber
            return nickname
        },
        generate_client_str () {
            var clientStr = sha1(Math.floor(Date.now() / 1000))
            return clientStr
        },
        check_client_string () {
            if (!this.$cookies.isKey('client_string')) {
                this.client_string = this.generate_client_str()
                this.$cookies.set('client_string', this.client_string)
                return false
            } else {
                this.client_string = this.$cookies.get('client_string')
                return true
            }
        },
        get_nickname_from_server () {
            this.$socket.emit('get_nickname', this.client_string, (nickname) => {
                if (nickname) {
                    this.current_nickname = nickname
                    return true
                } else {
                    return false
                }
            })
        },
        register_nickname_with_server (nickname) {
            console.log(nickname)
            var payload = {
                nickname: nickname,
                client_string: this.client_string
            }
            this.$socket.emit('nickname_register', payload, (success) => {
                if (success) {
                    this.current_nickname = nickname
                } else {
                    // handle error
                }
            })
        },
        get_nickname_from_cookies () {
            //
        },
        create_message () {
            var payload = {
                nickname: this.current_nickname,
                message: this.message_input
            }
            this.$socket.emit('create_message', payload)
            this.message_input = ''
        },
        prompt_nickname () {
            this.$dialog
                .prompt({
                    title: 'Choose a nickname',
                    body: 'Enter your desired nickname',
                    promptHelp: 'This doesn\'t work yet lol'
                })
                .then(dialog => {
                    this.nickname = dialog.data
                })
                .catch(() => {
                    console.log('Prompt dismissed')
                })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-fluid {
    padding: 0; }

#chat-app-container {
    height: 100%;
    display: flex;
    flex-direction: row; }

    #info-window {
        color: white;
        background-color: #082038;
        padding: 50px; }

    #chat-window {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%; }

        #messages-box {
            flex-grow: 1;
            background-color: #185B9E;
            padding: 25px;
            color: white;
            overflow-y: scroll; }

        #input-container {
            background-color: #0C2F52;
            padding: 25px; }

        #new-message-input {
            width: 100%;
            margin-top: auto;
            margin-bottom: auto; }
</style>
