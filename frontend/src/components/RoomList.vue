<template>
    <div class="panel-section">
        <div class='panel-header'>
            Rooms
        </div>
        <div class='panel-body'>
            <ul id="rooms-list" v-if="current_room">
                <li v-for="chat_room in current_user.chat_rooms" class="room" :class="{ active: current_room.id == chat_room.id }" :key="chat_room.id">
                    <a 
                        class='chat-room-link'
                        href="#"
                        :id="chat_room.id"
                        @click="changecurrent_room"
                    >
                        {{ chat_room.name }}
                    </a>
                </li>
            </ul>
            <div id="room-options">
                <button @click="show_join_room_prompt = true" class='btn btn-primary btn-sm'>Join Room</button>
            </div>
            <InputPrompt
                :show_prompt="show_join_room_prompt"
                confirm_button_text="Join"
                @close_prompt="show_join_room_prompt = false"
                @input_entered="joinRoom"
            />
        </div>
    </div>
</template>

<script>
    import InputPrompt from "./InputPrompt";
    import {EventBus} from "../event-bus";
    export default {
        components: {
            InputPrompt
        },
        mounted () {
        },
        data() {
            return {
                show_join_room_prompt: false
            }
        },
        computed: {
            current_user() {
                return this.$store.state.current_user
            },
            current_room() {
                return this.$store.state.current_room
            }
        },
        methods: {
            joinRoom(roomName) {
                let payload = {
                    client_token: this.current_user.client_token,
                    name: roomName
                }
                let url = `${process.env.VUE_APP_API_URL}/chat_room/join`
                this.axios.post(url, payload).then(response => {
                    this.$store.dispatch('refresh_current_user')
                })
            },
            changecurrent_room(event) {
                let room_id = event.target.id
                let payload = { room_id }
                this.$store.dispatch('set_room_by_id', payload)
            }
        }
    }
</script>

<style lang="scss" scoped>
    #room-panel > div {
        padding: 1em;
    }
    .panel-header {
        background-color: black;
        padding: 1em;
    }
    #rooms-list {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    #rooms-list .active {
        background-color: orange;
    }
</style>