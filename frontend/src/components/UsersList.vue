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
        currentRoom: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            users_list: []
        }
    },
    computed: {
        online_users: function () {
            return this.users_list.filter((user) => {
                return user.online_status
            })
        },
        offline_users: function () {
            return this.users_list.filter((user) => {
                return !user.online_status
            })
        }
    },
    sockets: {
        refresh_users_list (users_list) {
            this.users_list = users_list
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
