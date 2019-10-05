<template>
    <div id="input-prompt" v-show="showPrompt">
        <div id="body">
            <input v-model="promptInput" id="prompt-input" type="text" :placeholder="" />
            <div class='button-flex-row'>
                <button
                    @click="updateNickname()"
                    class="btn btn-primary full-width"
                    id="nickname_submit">{{ confirmButtonText }}</button>
                <button
                    @click="$emit('closeNicknamePrompt')"
                    class="btn btn-secondary full-width"
                    id="nickname_cancel">Cancel</button>
            </div>
        </div>
        <div id="nickname_prompt_dark_overlay">
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            promptData: ""
        }
    },
    props: {
        showPrompt: Boolean,
        placeholder: String,
        confirmButtonText: String,
    },
    methods: {
        updateNickname () {
            this.axios.post('/api/update_nickname', {
                nickname: this.nickname,
            }).then((response) => { })
            this.$emit('closeNicknamePrompt')
            this.$emit('updateNickname', this.nickname)
        }
    }
}
</script>

<style lang="scss" scoped>
#nickname_prompt_dark_overlay {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.5;
}

#nickname_prompt_body {
    z-index: 10;
    width: 500px;
    margin-left: -250px;
    margin-top: -150px;
    background-color: #433b47;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 25px;
}

#nickname_input {
    width: 100%;
    margin-bottom: 25px;
    text-align: center;
}

#nickname_submit {
    margin-right: 25px;
}
</style>
