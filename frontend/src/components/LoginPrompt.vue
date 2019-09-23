<template>
    <div></div>
</template>

<script>
export default {
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
