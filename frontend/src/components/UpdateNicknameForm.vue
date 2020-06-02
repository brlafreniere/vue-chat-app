<template>
    <div class="mb-5">
        <div class="form-group">
            <input v-model="new_nickname" type="text" placeholder="New Nickname" class="form-control" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary form-control" @click="update_nickname_on_server">Update Nickname</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                new_nickname: ""
            }
        },
        methods: {
            update_nickname_on_server() {
                let url = `${process.env.VUE_APP_API_URL}/user/update_nickname`
                let payload = {
                    client_token: this.$store.state.client_token,
                    nickname: this.new_nickname
                }
                this.axios.post(url, payload).then(response => {
                    this.$store.dispatch("refresh_current_user")
                })
                this.$parent.$emit("close_overlay")
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>