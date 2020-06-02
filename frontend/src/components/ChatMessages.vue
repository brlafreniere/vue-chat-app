<template>
    <div id="messages-box">
        <ul v-if="current_room">
            <li v-for="message in messages[current_room.id]" :key="message.id">
                {{ message.nickname }}: {{ message.text }}
            </li>
        </ul>
        <div id='input-box'>
            <input type="text" v-model="message_input" autocomplete="off" @keyup.enter="send_message()">
        </div>
    </diV>
</template>

<script>
    import {EventBus} from "../event-bus";
    export default {
        data() {
            return {
                messages: {},
                message_input: ""
            }
        },
        updated: function () {
            /* this.$nextTick(function () {
                var container = this.$el.querySelector('#messages-box')
                container.scrollTop = container.scrollHeight
            })*/
        },
        mounted() {
            EventBus.$on('current_user_set', () => {
                this.subscribe_to_chat_room_channels()
            })
            EventBus.$on('current_room_set', () => {
                this.getMessages();
            })
        },
        methods: {
            async getMessages() {
                // if messages not previously loaded... load 'em up
                if (this.messages[this.current_room.id] === undefined) { 
                    let url = `${process.env.VUE_APP_API_URL}/chat_room/${this.current_room.id}/messages/`
                    let response = await this.axios.get(url)
                    this.$set(this.messages, this.current_room.id, [])
                    response.data.forEach((el) => this.messages[this.current_room.id].push(el))
                }
            },
            subscribe_to_chat_room_channels() {
                // general user channel/chat related channel for setup, meta related stuff
                this.current_user.chat_rooms.forEach( (chat_room) => {
                    this.$cable.subscribe({ channel: 'ChatRoomChannel', chat_room_id: chat_room.id })
                })
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
            }
        },
        channels: {
            ChatRoomChannel: {
                connected() {
                    this.users_list_ready = true
                },
                received(data) {
                    let chat_room = this.current_user.chat_rooms.find((chat_room) => {
                        return chat_room.id == data.chat_room_id
                    })
                    if (this.messages[chat_room.id] === undefined) { 
                        this.$set(this.messages, chat_room.name, [])
                    }
                    this.messages[chat_room.id].push(data)
                }
            },
        },
        computed: {
            current_room() {
                return this.$store.state.current_room
            },
            current_user() {
                return this.$store.state.current_user
            },
        }
    }
</script>

<style lang="scss" scoped>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    #messages-box {
        height: 100%;
        width: 100%;
        padding: 1em;
        position: relative;
    }

    #input-box {
        background-color: #253745;
        width: 100%;
        padding: 1em;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    #input-box input {
        width: 100%;
    }
</style>