<template>
    <div id="chat-app-container" class="container-fluid">
        <div id="info-window">
            <div id="login-logout">
                <button @click="show_login_prompt = !show_login_prompt">Login</button>
            </div>
            <div id="current-nick">
                <!-- https://linearicons.com/free#cdn -->
                <span class="lnr-button">
                    <svg class="lnr lnr-pencil" @click="prompt_nickname()"><use xlink:href="#lnr-pencil" /></svg>
                </span>
                {{ current_nickname }}
            </div>
            <div>
                Current Room: {{ current_room.name }}
            </div>
            <div id="users-list">
                <ul>
                    <li v-for="user in users_list" :key="user">
                        {{ user }}
                    </li>
                </ul>
            </div>
        </div>
        <div id="chat-window">
            <div id="messages-box">
                <div v-for="message in messages" :key="message.id">
                    [{{ message.created_at | moment('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A") }}] {{ message.nickname }}: {{ message.text }}
                </div>
            </div>
            <div id="input-container">
                <input id="new-message-input" v-model="message_input" type="text" placeholder="type message here..." @keyup.enter="create_message()">
            </div>
        </div>
        <Prompt show="show_login_prompt" />
    </div>
</template>

<script>
import sha1 from 'sha1'

import Prompt from './Prompt.vue'

export default {
    components: {
        Prompt
    },
    data () {
        return {
            messages: [],
            users_list: [],
            message_input: '',
            current_nickname: '',
            current_room: {},
            client_string: '',
            user_id: 0,
            show_login_prompt: false
        }
    },
    mounted () {
        this.current_nickname = this.generate_nickname()
        if (this.check_client_string()) {
            this.get_nickname_from_server()
        }
        this.get_users_list()
    },
    sockets: {
        connect () {
        },
        load_messages (messages, test) {
            this.messages = messages
        },
        initial_room (room) {
            this.current_room = room
            this.join_room(this.current_room.id)
            this.load_room_messages()
        },
        load_users_list (users) {
            this.users_list = users
        },
        new_message (message) {
            this.messages.push(message)
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        },
        nickname_registered (user) {
            this.user = user
        }
    },
    methods: {
        login () {
            this.show_login_prompt = true
        },
        logout () {
        },
        load_room_messages () {
            this.$socket.emit('load_room_messages', { room_id: this.current_room.id })
        },
        join_room (room_id) {
            this.$socket.emit('join_room', { room_id: room_id, client_string: this.client_string })
        },
        get_users_list () {
            this.$socket.emit('get_users_list', { room_id: this.current_room.id }, (users_list) => {
                this.users_list = users_list
            })
        },
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
            this.$socket.emit('get_nickname', this.client_string, (user) => {
                if (user.length === 1) {
                    user = user[0]
                    this.current_nickname = user.nickname
                    this.user = user
                } else {
                    this.register_nickname_with_server(this.current_nickname)
                }
            })
        },
        register_nickname_with_server (nickname) {
            var payload = {
                nickname: nickname,
                client_string: this.client_string
            }
            this.$socket.emit('nickname_register', payload)
        },
        create_message () {
            var payload = {
                nickname: this.current_nickname,
                room_id: this.current_room.id,
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
                    this.current_nickname = dialog.data
                    this.register_nickname_with_server(this.current_nickname)
                })
                .catch(() => {
                    console.log('Prompt dismissed')
                })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@mixin button-base() {
    background-color: #306ed3;
    border: 0;
    border-radius: 3px;
    color: white;
    padding: 10px;
}

.lnr-button {
    @include button-base;
    padding: 4px 5px 2px 6px;
}

.lnr {
    display: inline-block;
    fill: currentColor;
    width: 1em;
    height: 1em;
    vertical-align: -0.05em;
    // margin-right: 10px;
}

.lnr-pencil {
    cursor: pointer;
    color: white;
}

.container-fluid {
    padding: 0;
}

#chat-app-container {
    height: 100%;
    display: flex;
    flex-direction: row;
}

#info-window {
    color: white;
    width: 300px;
    background-color: #082038;
    padding: 25px;
}

#login-logout {
    padding: 1em;
    margin-bottom: 10px;
}

#login-logout button {
    @include button-base
}

#current-nick {
    background-color: #405372;
    border-radius: 3px;
    padding: 1em;
    margin-bottom: 10px;
}

#chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

#messages-box {
    flex-grow: 1;
    background-color: #185B9E;
    padding: 25px;
    color: white;
    overflow-y: scroll;
}

#input-container {
    background-color: #0C2F52;
    padding: 25px;
}

#new-message-input {
    width: 100%;
    margin-top: auto;
    margin-bottom: auto;
}
</style>
