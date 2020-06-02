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
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>