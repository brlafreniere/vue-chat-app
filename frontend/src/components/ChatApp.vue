<template>
    <div id="chat-app-container" class="container-fluid">
        <div id="chat-app-body">
            <div id="left-pane">
                <div id="user-panel">
                    <div id="login-logout">
                        <button @click="show_login_prompt">Login</button>
                    </div>
                </div>
            </div>
            <div id="chat-window">
                <div id="messages-container">
                    <div id="messages-box">
                        <div v-for="message in messages[current_room.name]" :key="message.id" class="message">
                            {{ message.nickname }}: {{ message.text }} <span class="message-timestamp">{{ message.created_at | moment('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A (MMM D, YYYY)") }}</span>
                        </div>
                    </div>
                </div>
                <div id="input-container">
                    <form autocomplete="off" v-on:submit.prevent>
                        <input
                            id="new-message-input" v-model="message_input"
                            name="new-message-input" type="text"
                            placeholder="type message here..."
                            autocomplete="off" @keyup.enter="send_message()"
                        >
                    </form>
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
    </div>
</template>

<script>
import UsersList from './UsersList'

export default {
    components: {
        UsersList
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
    async mounted () {
        this.setCurrentRoom(this.current_user.chat_rooms[0])
        this.subscribeToChatRoomChannels()
        this.loadRoomMessages()
    },
    methods: {
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
        show_login_prompt () {
            this.$store.commit('open_login_prompt')
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans');

    body {
        font-family: 'Open Sans', sans-serif;
    }

    $standard-padding-amount: 1em;

    $messages-window-color: #1f1f1f;
    $messages-window-text-color: white;

    $user-panel-color: #349b52;
    $current-nick-color: #4f4f4f;
    $input-container-color: $current-nick-color;
    $message-timestamp-color: black;
    $current-room-color: #4872b5;

    $active-selection-color: #c2c1e8;

    $btn-primary-color: #ad2651;
    $btn-border-color: #ad2651;

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
    #user-panel {
        padding: $standard-padding-amount;
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

    #messages-container {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
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
	background-color: $active-selection-color;
    }

    #room-options {
        text-align: center;
        padding: 10px;
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

    .btn-primary {
        background-color: $btn-primary-color;
        border-color: $btn-border-color;
    }
</style>
