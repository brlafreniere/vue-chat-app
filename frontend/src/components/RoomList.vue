<template>
    <div class='border-bottom p-3 text-center'>
        <div id="room-options" class='mt-3 pb-1 border-bottom'>
            <a href="#" @click="show_join_room_prompt = true">Join Room</a>
        </div>
        <nav class="nav nav-pills flex-column mt-3" v-if="current_room">
            <a v-for="chat_room in current_user.chat_rooms" 
            :class="{ active: current_room.id == chat_room.id }"
            class="nav-link"
            :key="chat_room.id"
            href="#"
            :id="chat_room.id"
            @click="change_current_room"
            > {{ chat_room.name }} </a>
        </nav>
        <InputPrompt
            :show_prompt="show_join_room_prompt"
            confirm_button_text="Join"
            @close_prompt="show_join_room_prompt = false"
            @input_entered="join_room"
        />
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
            join_room(roomName) {
                let payload = {
                    client_token: this.current_user.client_token,
                    name: roomName
                }
                let url = `${process.env.VUE_APP_API_URL}/chat_room/join`
                this.axios.post(url, payload).then(response => {
                    this.$store.dispatch('refresh_current_user')
                })
            },
            change_current_room(event) {
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
        padding: 1em;
    }
    #rooms-list {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    #rooms-list .active {
    }
</style>