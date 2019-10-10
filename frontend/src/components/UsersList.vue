<!-- this component is mostly for rendering the users list -->

<template>
    <div id="users-list">
        <section>
            <header>ONLINE USERS</header>
            <ul>
                <li v-for="user in online_users" :key="user.nickname">
                    {{ user.nickname }}
                </li>
            </ul>
        </section>
        <section>
            <header>OFFLINE USERS</header>
            <ul>
                <li v-for="user in offline_users" :key="user.nickname">
                    {{ user.nickname }}
                </li>
            </ul>
        </section>
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
        this.$nextTick( () => {
            this.loadUsers()
        })
        window.setInterval( () => {
            this.loadUsers()
        }, 30000) // every 30 seconds
    },
    methods: {
        async loadUsers() {
            let url = `${process.env.VUE_APP_API_URL}/chat_room/${this.currentRoom.id}/users`
            let response = await this.axios.get(url)
            this.users = response.data
        }
    },
    computed: {
        online_users: function () {
            return this.users.filter((user) => {
                return user.online
            })
        },
        offline_users: function () {
            return this.users.filter((user) => {
                return !user.online
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

#users-list {
    padding: 1em;
}

section {
    margin-bottom: 50px;
}

header {
    background-color: #5f367a;
    padding: 5px;
    text-align: center;
    border-radius: 5px;
}
</style>
