<template>
    <div id="chat-app-container" class="container-fluid">
        <div id="info-window">
            <div id="user-panel">
                <div id="login-logout">
                    <button @click="show_login_prompt">Login</button>
                </div>
                <div id="current-nick">
                    <svg v-show="current_user.registered" class="lnr lnr-warning" title="Your nickname is unregistered!"><use xlink:href="#lnr-warning"></use></svg>
                    <svg class="lnr lnr-user"><use xlink:href="#lnr-user"></use></svg>
                    {{ user.nickname }}

                    <!-- https://linearicons.com/free#cdn -->
                    <span class="lnr-button">
                        <svg class="lnr lnr-pencil" @click="prompt_nickname()"><use xlink:href="#lnr-pencil" /></svg>
                    </span>
                </div>
            </div>
            <div id="room-panel">
                <div id="current-room">
                    Room: {{ current_room.name }}
                </div>
                <ul id="rooms-list">
                    <li v-for="chat_room in user.chat_rooms" :key="chat_room.id">
                        {{ chat_room.name }}
                    </li>
                </ul>
                <UsersList :current-room="current_room" />
            </div>
        </div>
        <div id="chat-window">
            <div id="messages-box">
                <div v-for="message in messages" :key="message.id" class="message">
                    {{ message.nickname }}: {{ message.text }} <span class="message-timestamp">{{ message.created_at | moment('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A (MMM D, YYYY)") }}</span>
                </div>
            </div>
            <div id="input-container">
                <input
                    id="new-message-input" v-model="message_input" name="new-message-input" type="text" placeholder="type message here..."
                    autocomplete="off" @keyup.enter="send_message()"
                >
            </div>
        </div>
    </div>
</template>

<script>
import sha1 from 'sha1'

import UsersList from './UsersList'

export default {
    components: {
        UsersList
    },
    data () {
        return {
            user: {},
            rooms: {},
            client_string: '',
            current_room: {},
            current_user: {},
            message_input: '',
            messages: [],
            nickname: '',
            user_id: 0
        }
    },
    computed: {
    },
    async mounted () {
        // check for client token
        this.client_token = this.$cookies.get('client_token')

        if (!this.client_token) {
            this.client_token = this.generate_client_token()
            this.$cookies.set('client_token', this.client_token)
        }

        this.axios.get('/api/user/' + this.client_token + ".json").then( (response) => {
            this.user = response.data
            // the first room in the list will be the current room initially
            this.current_room = this.user.chat_rooms[0]

            // general user channel/chat related channel for setup, meta related stuff
            this.user.chat_rooms.forEach( (chat_room) => {
                this.$cable.subscribe({ channel: 'ChatRoomChannel', chat_room_id: chat_room.id })
            })
        })

    },
    updated: function () {
        this.$nextTick(function () {
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        })
    },
    channels: {
        ChatRoomChannel: {
            received(data) {
                this.messages.push(data)
            }
        },
        connect () {
        },
        load_messages (messages) {
            this.messages = messages
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
        show_login_prompt () {
            this.$store.commit('open_login_prompt')
        },
        load_room_messages () {
            this.$cable.perform({
                channel: 'ChatChannel',
                action: 'messages',
                data: { room: this.current_room }
            })
        },
        generate_client_token () {
            var clientStr = sha1(Math.floor(Date.now() / 1000))
            return clientStr
        },
        send_message () {
            this.$cable.perform({
                channel: "ChatRoomChannel",
                action: "new_message",
                data: {
                    message_text: this.message_input,
                    chat_room_id: this.current_room.id
                }
            });
        },
        prompt_nickname () {
            this.$dialog
                .prompt({
                    title: 'Choose a nickname',
                    body: 'Enter your desired nickname',
                    promptHelp: 'This doesn\'t work yet lol'
                })
                .then(dialog => {
                    var new_nickname = dialog.data;
                    this.nickname = new_nickname;
                    this.register_nickname_with_server(new_nickname, (err) => {
                        if (!err) {
                            this.$cookies.set('nickname', this.nickname)
                        }
                    });
                })
                .catch(() => {
                    console.log('Prompt dismissed')
                })
        },
        register_nickname_with_server(new_nickname, next) {
            this.$socket.emit('update_nickname', this.client_token, new_nickname, next)
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

$standard-padding-amount: 1em;

$messages-window-color: #b5e5d4;
$messages-window-text-color: black;

$info-window-color: #333333;
$user-panel-color: #349b52;
$current-nick-color: #4f4f4f;
$input-container-color: $current-nick-color;
$message-timestamp-color: black;
$current-room-color: #4872b5;

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
    padding: $standard-padding-amount;
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

.message-timestamp {
    visibility: hidden;
    font-size: 0.8em;
    color: $message-timestamp-color;
}

.message:hover > .message-timestamp {
    visibility: visible;
}

#current-room {
    text-align: center;
    background-color: $current-room-color;
    padding: $standard-padding-amount;
}

#rooms-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    text-align: center;
}

#rooms-list li {
    background-color: #97b046;
}
</style>
