<template>
    <div id="input-prompt" v-show="showPrompt">
        <div id="body">
            <input 
                v-model="promptInput"
                ref="input"
                @keyup.enter="submitInput()"
                id="prompt-input" type="text" :placeholder="placeholder" />
            <div class='button-flex-row'>
                <button
                    @click="submitInput"
                    class="btn btn-primary full-width"
                    id="submit">{{ confirmButtonText }}</button>
                <button
                    @click="$emit('closePrompt')"
                    class="btn btn-secondary full-width"
                    id="cancel">Cancel</button>
            </div>
        </div>
        <div id="dark-overlay">
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            promptInput: ""
        }
    },
    props: {
        showPrompt: Boolean,
        placeholder: String,
        confirmButtonText: String,
    },
    watch: {
        showPrompt: function (newValue, oldValue) {
            if (newValue) {
                this.$nextTick( () => this.$refs.input.focus() )
            }
        }
    },
    methods: {
        submitInput() {
            this.$emit('inputEntered', this.promptInput)
            this.$emit('closePrompt')
            this.promptInput = ""
        }
    }
}
</script>

<style lang="scss" scoped>
#dark-overlay {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: black;
    opacity: 0.5;
}

#body {
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

#prompt-input {
    width: 100%;
    margin-bottom: 25px;
    text-align: center;
}

#submit {
    margin-right: 25px;
}
</style>
