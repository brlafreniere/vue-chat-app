<template>
    <div class="overlay-menu" v-show="show_overlay">
        <div class="overlay-menu-body">
            <slot></slot>
        </div>

        <div class="overlay-menu-black-bg" @click="$emit('close_overlay')">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        props: {
            show_overlay: Boolean
        }
    }
</script>

<style lang="scss" scoped>
    .overlay-menu-black-bg {
        position: absolute;
        z-index: 9;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-color: black;
        opacity: 0.5;
    }

    .overlay-menu-body {
        z-index: 10;
        width: 500px;
        position: absolute;
        background-color: white;
        top: 50%;
        left: 50%;
        padding: 25px;
        border-radius: 0.25em;
        transform: translate(-50%, -50%);
    }
</style>