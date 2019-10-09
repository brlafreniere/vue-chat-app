<!-- this component is mostly for rendering the users list -->

<template>
    <div id="users-list">
        <div>
            <span class="heading">ONLINE</span>
        </div>
        <ul>
            <li v-for="user in online_users" :key="user.nickname">
                {{ user.nickname }}
            </li>
        </ul>
        <div>
            <span class="heading">OFFLINE</span>
        </div>
        <ul>
            <li v-for="user in offline_users" :key="user.nickname">
                {{ user.nickname }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        currentRoom: Object
    },
    data () {
        return {
            users: []
        }
    },
    mounted () {
        this.$nextTick( async () => {
            let url = `${process.env.VUE_APP_API_URL}/chat_room/${this.currentRoom.id}/users`
            let response = await this.axios.get(url)
            this.users = response.data
        })
    },
    computed: {
        online_users: function () {
            return this.users.filter((user) => {
                return user.online_status
            })
        },
        offline_users: function () {
            return this.users.filter((user) => {
                return !user.online_status
            })
        }
    }
}
</script>

<style scoped>
#users-list ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-left: 1em;
}

#users-list > div {
    padding: 1em;
    text-align: center;
}
</style>
