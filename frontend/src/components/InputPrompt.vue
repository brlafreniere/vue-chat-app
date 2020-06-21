<template>
    <div class="input-prompt" v-show="show_prompt">
        <div class="input-body">
            <input v-model="input_data" ref="input" @keyup.enter="submitInput()"
                class="form-control mb-3" type="text" :placeholder="placeholder" />
            <div class='button-flex-row'>
                <button @click="submitInput" class="btn btn-primary full-width submit">{{ confirm_button_text }}</button>
                <button @click="$emit('close_prompt')" class="btn btn-secondary full-width" id="cancel">Cancel</button>
            </div>
        </div>
        <div class="dark-overlay">
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                input_data: ""
            }
        },
        props: {
            show_prompt: Boolean,
            placeholder: String,
            confirm_button_text: String,
        },
        watch: {
            show_prompt: function (newValue, oldValue) {
                if (newValue) {
                    this.$nextTick( () => this.$refs.input.focus() )
                }
            }
        },
        methods: {
            submitInput() {
                this.$emit('input_entered', this.input_data)
                this.$emit('close_prompt')
                this.input_data = ""
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dark-overlay {
        position: absolute;
        z-index: 100;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-color: black;
        opacity: 0.5;
    }

    .input-body {
        z-index: 101;
        width: 500px;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 25px;
        border-radius: 0.25em;
    }

    .prompt-input {
        width: 100%;
        margin-bottom: 25px;
        text-align: center;
    }

    .submit {
        margin-right: 25px;
    }

    .button-flex-row {
        display: flex;
        justify-content: center;
    }

    .button-flex-row .btn {
        width: 100%;
    }
</style>
