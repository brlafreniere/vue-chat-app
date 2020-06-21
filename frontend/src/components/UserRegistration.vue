<template>
    <div v-show="!user_registered">
        <p>Your nickname is not registered! Register your nickname with an
        email and password if you would like to use this nickname again in
        the future.</p>
        <form>
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Email Address" />
            </div>
            <div class="form-group">
                <input type="password" class="form-control" placeholder="Password" />
            </div>
            <div class="form-group">
                <button type="submit" class="form-control btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        computed: {
            user_registered() {
                return Boolean(this.$store.state.current_user.email)
            },
            client_token() {
                return this.$store.state.current_user.client_token
            }
        },
        methods: {
            submit_registration() {
                let url = `${process.env.VUE_APP_API_URL}/user/register_account`
                let payload = {
                    client_token: this.client_token
                }
                this.axios.post(url, payload).then(response => {

                })
                this.$parent.$emit('close_overlay')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>