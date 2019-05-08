<template>
    <div id="chat-app-container" class="container-fluid">
        <div id="info-window">
            <div id="user-panel">
                <div id="login-logout">
                    <button @click="show_login_prompt">Login</button>
                </div>
                <div id="current-nick">
                    <svg class="lnr lnr-user"><use xlink:href="#lnr-user"></use></svg>
                    {{ current_nickname }}
                    <!-- https://linearicons.com/free#cdn -->
                    <span class="lnr-button">
                        <svg class="lnr lnr-pencil" @click="prompt_nickname()"><use xlink:href="#lnr-pencil" /></svg>
                    </span>
                    <svg v-show="current_user.registered" class="lnr lnr-warning"><use xlink:href="#lnr-warning"></use></svg>
                </div>
            </div>
            <div id="room-panel">
                <div id="users-list">
                    <div>
                        <span class="heading">ONLINE</span>
                    </div>
                    <ul>
                        <li v-for="user in online_users" :key="user.nickname">
                            {{ user.nickname }}
                        </li>
                    </ul>
                    <div>
                        <span class="heading">OFFLINE</span>
                    </div>
                    <ul>
                        <li v-for="user in offline_users" :key="user.nickname">
                            {{ user.nickname }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="chat-window">
            <div id="messages-box">
                <div v-for="message in messages" :key="message.id" class="message">
                    {{ message.nickname }}: {{ message.text }} <span class="message-timestamp">{{ message.created_at | moment('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A (MMM D, YYYY)") }}</span>
                </div>
            </div>
            <div id="input-container">
                <input id="new-message-input" v-model="message_input" type="text" placeholder="type message here..." @keyup.enter="create_message()">
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
            users_list: [],
            message_input: '',
            current_nickname: '',
            current_room: {},
            client_string: '',
            user_id: 0,
            current_user: {}
        }
    },
    computed: {
        online_users: function () {
            return this.users_list.filter((user) => {
                return user.online_status
            })
        },
        offline_users: function () {
            return this.users_list.filter((user) => {
                return !user.online_status
            })
        }
    },
    mounted () {
        this.current_nickname = this.generate_nickname()
        if (this.check_client_string()) {
            this.get_nickname_from_server()
        }
    },
    updated: function () {
        this.$nextTick(function () {
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        })
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
            this.get_users_list()
        },
        load_users_list (users) {
            this.users_list = users
        },
        new_message (message) {
            console.log(message)
            this.messages.push(message)
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        },
        nickname_registered (user) {
            this.user = user
        }
    },
    methods: {
        show_login_prompt () {
            this.$store.commit('open_login_prompt')
        },
        logout () {
        },
        load_room_messages () {
            this.$socket.emit('load_room_messages', { room_id: this.current_room.id })
        },
        join_room (room_id) {
            this.$socket.emit('join_room', { room_id: room_id, client_string: this.client_string }, (success) => {
            })
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
                if (user) {
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
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

body {
    font-family: 'Open Sans', sans-serif;
}

$messages-window-color: #b5e5d4;
$messages-window-text-color: black;

$info-window-color: #333333;
$user-panel-color: #349b52;
$current-nick-color: #4f4f4f;
$input-container-color: $current-nick-color;
$message-timestamp-color: black;

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
    background-color: $info-window-color;
}

#user-panel {
    background-color: $user-panel-color;
}

#room-panel {

}

#login-logout {
    display: none;
    padding: 1em;
    margin-bottom: 10px;
}

#login-logout button {
    @include button-base
}

#current-nick {
    text-align: center;
    background-color: $current-nick-color;
    padding: 1em;
}

#chat-window {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

#messages-box {
    flex-grow: 1;
    background-color: $messages-window-color;
    padding: 25px;
    color: $messages-window-text-color;
    overflow-y: scroll;
}

#input-container {
    background-color: $input-container-color;
    padding: 25px;
}

#new-message-input {
    width: 100%;
    margin-top: auto;
    margin-bottom: auto;
}

.label {
    flex-grow: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-color: #253f68;
    padding: 5px;
    width: 50%;
}

.label-datum {
    flex-grow: 1;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #617ba3;
    padding: 5px;
}

#users-list ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-left: 1em;
}

#users-list > div {
    padding: 1em;
    text-align: center;
}

.heading {
    font-family: 'Open Sans', sans-serif;
}

.message-timestamp {
    visibility: hidden;
    font-size: 0.8em;
    color: $message-timestamp-color;
}

.message:hover > .message-timestamp {
    visibility: visible;
}
</style>
