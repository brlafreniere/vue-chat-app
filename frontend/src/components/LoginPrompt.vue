<template>
    <div v-show="show_login_prompt" id="prompt-component">
        <div id="prompt-overlay" @click="close_prompt()">
        </div>
        <div id="prompt-box">
            <div>
                Username:
            </div>
            <input v-model="username" type="text" name="username" />
            <div>
                Password:
            </div>
            <input v-model="password" type="password" name="password" />
            <div>
                <button @click="login()">Login</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            username: '',
            password: ''
        }
    },
    computed: {
        show_login_prompt () { return this.$store.state.show_login_prompt }
    },
    methods: {
        close_prompt () {
            this.$store.commit('close_login_prompt')
        },
        login () {
            this.$emit('login', this.username, this.password)
        }
    }
}
</script>

<style lang="scss" scoped>
#prompt-component {
}

#prompt-overlay {
    background-color: black;
    opacity: 0.8;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}

#prompt-box {
    padding: 25px;
    top: 25%;
    left: 25%;
    width: 50%;
    height: 50%;
    background-color: white;
    position: absolute;
}
</style>
