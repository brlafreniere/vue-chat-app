<template>
    <div v-show="show_prompt" id="prompt-component">
        <div id="prompt-overlay">
        </div>
        <div id="prompt-box">
            <div>
                Username:
            </div>
            <input v-model="username" type="text" name="username" />
            <div>
                Password:
            </div>
            <input v-model="password" type="text" name="password" />
            <div>
                <button>Login</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show_prompt: Boolean
    },
    data () {
        return {
            username: '',
            password: ''
        }
    }
}
</script>

<style lang="scss" scoped>
#prompt-component {
    display: none;
}

#prompt-overlay {
    background-color: black;
    opacity: 0.7;
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
