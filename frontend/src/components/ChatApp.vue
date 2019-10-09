<template>
    <div id="chat-app-container" class="container-fluid">
        <NicknamePrompt
            @updateNickname="updateNickname"
            :showPrompt="nicknamePromptEnabled"
            @closeNicknamePrompt="nicknamePromptEnabled = false" />
        <div id="info-window">
            <div id="room-panel">
                <div id="room-options">
                    <button
                        @click='joinRoom'
                        class='btn btn-primary btn-sm'>Join Room</button>
                </div>
                <ul id="rooms-list">
                    <li
                        v-for="chat_room in user.chat_rooms"
                        class="room"
                        :class="{ active: current_room.id == chat_room.id }"
                        :key="chat_room.id">
                        {{ chat_room.name }}
                    </li>
                </ul>
            </div>
            <div id="user-panel">
                <div id="login-logout">
                    <button @click="show_login_prompt">Login</button>
                </div>

                <!-- https://linearicons.com/free#cdn -->
                <!-- <span class="lnr-button">
                    <svg class="lnr lnr-pencil" @click="nicknamePromptEnabled = true"><use xlink:href="#lnr-pencil" /></svg>
                </span> -->
                <button 
                    class="btn btn-primary btn-sm"
                    @click="nicknamePromptEnabled = true">
                    Change Nickname
                </button>
            </div>
        </div>
        <div id="chat-window">
            <div id="top-bar">
                <div id='current-room'>
                    <svg class="lnr lnr-earth"><use xlink:href="#lnr-earth"></use></svg> <span id='current-room-text'> {{ current_room.name }}</span>
                </div>
                <div id="current-nick">
                    <svg v-show="current_user.registered" class="lnr lnr-warning" title="Your nickname is unregistered!"><use xlink:href="#lnr-warning"></use></svg>
                    <svg class="lnr lnr-user"><use xlink:href="#lnr-user"></use></svg>
                    <span id='current-nick-text'>
                        {{ user.nickname }}
                    </span>
                </div>
            </div>
            <div id="messages-container">
                <div id="messages-box">
                    <div v-for="message in messages" :key="message.id" class="message">
                        {{ message.nickname }}: {{ message.text }} <span class="message-timestamp">{{ message.created_at | moment('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A (MMM D, YYYY)") }}</span>
                    </div>
                </div>
                <div id="users-list">
                    <UsersList 
                        v-if="current_room_loaded"
                        :current-room="current_room" />
                </div>
            </div>
            <div id="input-container">
                <form autocomplete="off" v-on:submit.prevent>
                    <input
                        id="new-message-input" v-model="message_input" name="new-message-input" type="text" placeholder="type message here..."
                        autocomplete="off" @keyup.enter="send_message()"
                    >
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import sha1 from 'sha1'

import UsersList from './UsersList'
import NicknamePrompt from './NicknamePrompt.vue'

export default {
    components: {
        UsersList,
        NicknamePrompt
    },
    data () {
        return {
            user: {},
            client_string: '',
            current_room: {},
            current_room_loaded: false,
            current_room_id: null,
            current_user: {},
            messages: [],
            message_input: '',
            nicknamePromptEnabled: false,
            nickname: '',
            user_id: 0
        }
    },
    updated: function () {
        this.$nextTick(function () {
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        })
    },
    async mounted () {
        // check for client token
        this.client_token = this.$cookies.get('client_token')

        if (!this.client_token) {
            this.client_token = this.generate_client_token()
            this.$cookies.set('client_token', this.client_token)
        }

        // get user data, the rooms they are joined to, etc.
        let url = `${process.env.VUE_APP_API_URL}/user/${this.client_token}`
        let response = await this.axios.get(url)

        this.user = response.data

        // the first room in the list will be the current room initially
        this.change_room(this.user.chat_rooms[0])

        // general user channel/chat related channel for setup, meta related stuff
        this.user.chat_rooms.forEach( (chat_room) => {
            this.$cable.subscribe({ channel: 'ChatRoomChannel', chat_room_id: chat_room.id })
        })

        this.load_room_messages()
    },
    methods: {
        async load_room_messages () {
            let url = `${process.env.VUE_APP_API_URL}/chat_room/${this.current_room.id}/messages/`
            let response = await this.axios.get(url)
            response.data.forEach((el) => this.messages.push(el))
        },
        change_room(new_room) {
            this.current_room = Object.assign(this.current_room, new_room)
            if (this.current_room.messages == undefined) { this.current_room.messages = [] }
            this.messages = this.current_room.messages
            this.current_room_loaded = true
        },
        joinRoom (event) {
            console.log(event)
        },
        updateNickname (new_nickname) {
            this.user.nickname = new_nickname
        },
        show_login_prompt () {
            this.$store.commit('open_login_prompt')
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
            })
            this.message_input = ""
        },
        register_nickname_with_server(new_nickname, next) {
            this.$socket.emit('update_nickname', this.client_token, new_nickname, next)
        }
    },
    channels: {
        ChatRoomChannel: {
            received(data) {
                var chat_room_id = data.chat_room_id
                var chat_room = this.user.chat_rooms.find((element) => {
                    return element.id == chat_room_id
                })
                console.log(chat_room)
                if (!chat_room.messages) { chat_room.messages = [] }
                chat_room.messages.push(data)
            }
        },
        new_message (message) {
            this.messages.push(message)
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        },
        nickname_registered (user) {
            this.user = user
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

    $messages-window-color: #e8f9ff;
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
        cursor: pointer;
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
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 100%;
    }

    #user-panel {
        padding: $standard-padding-amount;
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

    #current-nick-text {
        font-size: 1.3em
    }

    #chat-window {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    #messages-container {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
    }

    #messages-box {
        background-color: $messages-window-color;
        padding: 25px;
        color: $messages-window-text-color;
        overflow-y: scroll;
        flex-grow: 1;
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

    #top-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: white;
        width: auto;
        background-color: #445d66;
        padding: $standard-padding-amount;
    }

    #current-room-text {
        font-size: 1.3em
    }

    #rooms-list {
        list-style-type: none;
        margin-top: 50px;
        padding: 0;
        text-align: center;
    }

    #rooms-list li {
        display: inline;
        padding: 5px 50px;
    }

    #rooms-list li.active {
        background-color: #662db5;
    }

    #room-options {
        text-align: center;
        padding: 10px;
    }

    #users-list {
        background-color: $info-window-color;
        color: white;
        width: 300px;
    }
</style>
