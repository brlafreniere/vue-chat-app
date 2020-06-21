<template>
    <div id="app" class="container-fluid">
        <div id="left-pane">
            <NicknameDisplayAndOptions />
            <RoomList />
        </div>
        <div id="middle-pane" class="border-left border-right">
            <ChatMessages />
        </div>
        <div id="right-pane">
            <UsersList />
        </div>
        <LoginPrompt />
    </div>
</template>

<script>
    import sha1 from 'sha1'
    import LoginPrompt from './components/LoginPrompt.vue'
    import ChatMessages from './components/ChatMessages.vue'
    import NicknameDisplayAndOptions from './components/NicknameDisplayAndOptions.vue'
    import RoomList from './components/RoomList.vue'
    import OverlayMenu from '@/components/OverlayMenu.vue'
    import UsersList from "@/components/UsersList.vue"

    export default {
        name: 'App',
        components: {
            LoginPrompt,
            ChatMessages,
            NicknameDisplayAndOptions,
            RoomList,
            UsersList
        },
        async mounted() {
            this.load_client_token()
            await this.$store.dispatch('refresh_current_user')
        },
        methods: {
            load_client_token () {
                // check for client token
                let client_token = this.$cookies.get('client_token') || null;
                if (!client_token) { client_token = this.generate_client_token() }

                this.$cookies.set('client_token', client_token, Infinity, null, process.env.VUE_APP_COOKIE_DOMAIN)
                this.$store.commit('set_client_token', {client_token})
            },
            generate_client_token () {
                var clientStr = sha1(Math.floor(Date.now() / 1000))
                return clientStr
            },
            async join_room (roomName) {
                await this.axios.post(`${process.env.VUE_APP_API_URL}/chat_room/join`, {name: roomName, client_token: this.client_token})
                await this.loadUserObject()
                let chat_room = this.current_user.chat_rooms.find((el) => { return el.name == roomName })
                this.subscribeToChatRoomChannel(chat_room)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .full-width {
        width: 100%;
    }

    #right-pane {
        width: 300px;
        padding: 1em
    }

    #left-pane {
        width: 300px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .container-fluid {
        padding: 0;
    }

    #chat-app-container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #app {
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    #middle-pane {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }
</style>
