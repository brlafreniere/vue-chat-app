<template>
    <div id="chat-app-container" class="container-fluid">
        <NicknamePrompt
            @updateNickname="updateNickname"
            :showPrompt="prompts.nickname"
            @closeNicknamePrompt="prompts.nickname = false" />
        <InputPrompt
            :showPrompt="prompts.joinRoom"
            @closePrompt="prompts.joinRoom = false"
            placeholder="Room Name"
            confirm-button-text="Join"
            @inputEntered="joinRoom" />
        <div id="info-window">
            <div id="room-panel">
                <div id="room-options">
                    <button
                        @click='prompts.joinRoom = true'
                        class='btn btn-primary btn-sm'>Join Room</button>
                </div>
                <ul id="rooms-list">
                    <li
                        v-for="chat_room in current_user.chat_rooms"
                        class="room"
                        :class="{ active: current_room.id == chat_room.id }"
                        :key="chat_room.id">
                        <a
                            class='chat-room-link'
                            href="#"
                            :id="chat_room.id"
                            @click="newRoomSelected">{{ chat_room.name }}</a>
                    </li>
                </ul>
            </div>
            <div id="user-panel">
                <div id="login-logout">
                    <button @click="show_login_prompt">Login</button>
                </div>
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
                        {{ current_user.nickname }}
                    </span>
                </div>
            </div>
            <div id="messages-container">
                <div id="messages-box">
                    <div v-for="message in messages[current_room.name]" :key="message.id" class="message">
                        {{ message.nickname }}: {{ message.text }} <span class="message-timestamp">{{ message.created_at | moment('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A (MMM D, YYYY)") }}</span>
                    </div>
                </div>
                <div id="right-pane">
                    <div id="nickname-options">
                        <button 
                            class="btn btn-primary btn-sm"
                            @click="prompts.nickname = true">
                            Change Nickname
                        </button>
                    </div>
                    <UsersList 
                        v-if="users_list_ready"
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
import InputPrompt from './InputPrompt.vue'

export default {
    components: {
        UsersList,
        NicknamePrompt,
        InputPrompt
    },
    data () {
        return {
            client_string: '',
            current_room: {},
            current_user: {},
            message_input: '',
            messages: {},
            prompts: {
                nickname: false,
                joinRoom: false,
            },
            users_list_ready: false,
        }
    },
    updated: function () {
        this.$nextTick(function () {
            var container = this.$el.querySelector('#messages-box')
            container.scrollTop = container.scrollHeight
        })
    },
    async mounted () {
        this.loadClientToken()
        await this.loadUserObject()
        this.setCurrentRoom(this.current_user.chat_rooms[0])
        this.subscribeToChatRoomChannels()
        this.loadRoomMessages()
    },
    methods: {
        async loadRoomMessages () {
            let url = `${process.env.VUE_APP_API_URL}/chat_room/${this.current_room.id}/messages/`
            let response = await this.axios.get(url)
            if (this.messages[this.current_room.name] == undefined) { 
                this.$set(this.messages, this.current_room.name, [])
            }
            response.data.forEach((el) => this.messages[this.current_room.name].push(el))
        },
        async getUserObject() {
            let url = `${process.env.VUE_APP_API_URL}/user/${this.client_token}`
            let response = await this.axios.get(url)
            return response.data;
        },
        async loadUserObject() {
            this.current_user = await this.getUserObject()
        },
        loadClientToken () {
            // check for client token
            this.client_token = this.$cookies.get('client_token')

            if (!this.client_token) {
                this.client_token = this.generate_client_token()
                this.$cookies.set('client_token', this.client_token)
            }
        },
        newRoomSelected(event) {
            let chat_room_id = event.target.id
            this.changeRoom(chat_room_id)
        },
        changeRoom(chat_room_id) {
            let room = this.current_user.chat_rooms.find( (el) => {
                return el.id == chat_room_id
            })
            this.setCurrentRoom(room)
            if (this.messages[room.name] == undefined) {
                this.loadRoomMessages()
            }
        },
        setCurrentRoom(room) {
            this.current_room = room
        },
        subscribeToChatRoomChannels() {
            // general user channel/chat related channel for setup, meta related stuff
            this.current_user.chat_rooms.forEach( (chat_room) => {
                this.subscribeToChatRoomChannel(chat_room)
            })
        },
        subscribeToChatRoomChannel(chat_room) {
            this.$cable.subscribe({ channel: 'ChatRoomChannel', chat_room_id: chat_room.id })
        },
        async joinRoom (roomName) {
            await this.axios.post(`${process.env.VUE_APP_API_URL}/chat_room/join`, {name: roomName, client_token: this.client_token})
            await this.loadUserObject()
            let chat_room = this.current_user.chat_rooms.find((el) => {
                return el.name == roomName
            })
            this.subscribeToChatRoomChannel(chat_room)
        },
        updateNickname (new_nickname) {
            this.current_user.nickname = new_nickname
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
            connected() {
                this.users_list_ready = true
            },
            received(data) {
                let chat_room = this.current_user.chat_rooms.find((cr) => {
                    return cr.id == data.chat_room_id
                })
                if (this.messages[chat_room.name] == undefined) { 
                    this.$set(this.messages, chat_room.name, [])
                }
                this.messages[chat_room.name].push(data)
            }
        },
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
        overflow-y: scroll;
    }

    #messages-box {
        background-color: $messages-window-color;
        padding: 25px;
        color: $messages-window-text-color;
        flex-grow: 1;
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
        padding: 0;
        text-align: center;
    }

    #rooms-list li {
        padding: 5px 50px;
    }

    #rooms-list li.active {
        background-color: #662db5;
    }

    #room-options {
        text-align: center;
        padding: 10px;
    }

    #right-pane {
        background-color: $info-window-color;
        color: white;
        width: 300px;
        padding: 1em
    }

    #nickname-options {
        text-align: center;
        margin-bottom: 25px;
    }

    .chat-room-link:link {
        color: white;
    }

    .chat-room-link:visited {
        color: white;
    }

    .chat-room-link:hover {
        text-decoration: none;
    }
</style>
