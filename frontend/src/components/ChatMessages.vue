<template>
    <div class="d-flex flex-column" id="component-container">
        <div class="p-3" id="chat-messages-container">
            <ul v-if="current_room">
                <li v-for="message in messages[current_room.id]" :key="message.id">
                    {{ message.nickname }}: {{ message.text }}
                </li>
            </ul>
        </div>
        <div class='border-top bg-light p-3'>
            <input type="text" class="form-control" v-model="message_input" autocomplete="off" @keyup.enter="send_message()">
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
            this.$nextTick(function () {
                this.scroll_to_bottom()
            })
        },
        mounted() {
            EventBus.$on('current_user_set', () => {
                this.subscribe_to_chat_room_channels()
            })
            EventBus.$on('current_room_set', () => {
                this.getMessages();
            })
            this.$nextTick( () => {
                this.scroll_to_bottom();
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
            scroll_to_bottom() {
                const el = this.$el.querySelector('#chat-messages-container')
                el.scrollTop = el.scrollHeight
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
    #component-container {
        height: 100%;
        max-height: 100%;
    }
    #chat-messages-container {
        height: 100%;
        overflow-y: scroll;
    }
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
</style>