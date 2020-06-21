<template>
    <div>
        <section>
            <header class="border-bottom">Online</header>
            <ul v-if="current_room" class="mb-5">
                <li v-for="user in online_users" :key="user.nickname">
                    {{ user.nickname }}
                </li>
            </ul>
        </section>
        <section>
            <header class="border-bottom">Offline</header>
            <ul v-if="current_room">
                <li v-for="user in offline_users" :key="user.nickname">
                    {{ user.nickname }}
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    export default {
        mounted () {
            window.setInterval( () => {
                this.refresh_current_room()
            }, 3000) // every 30 seconds
        },
        methods: {
            async refresh_current_room() {
                let payload = {room_id: this.current_room.id}
                this.$store.dispatch('set_room_by_id', payload)
            }
        },
        computed: {
            current_room() {
                return this.$store.state.current_room
            },
            online_users: function () {
                if (this.current_room.users) {
                    return this.current_room.users.filter((user) => {
                        return user.online
                    })
                } else {
                    return null;
                }
            },
            offline_users: function () {
                if (this.current_room.users) {
                    return this.current_room.users.filter((user) => {
                        return !user.online
                    })
                } else {
                    return null;
                }
            }
        }
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
</style>
