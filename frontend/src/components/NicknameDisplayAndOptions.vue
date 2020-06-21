<template>
    <div id='user-settings' class='border-bottom'>
        <div class="text-center">
            <div>
                <Octicon :icon="Octicons.person" /> 
                <a href="#" @click="show_user_options_menu = true">
                    {{current_user.nickname}}
                </a>
            </div>
        </div>
        <OverlayMenu :show_overlay="show_user_options_menu" @close_overlay="show_user_options_menu = false">
            <UpdateNicknameForm />
            <UserRegistration />
        </OverlayMenu>
    </div>
</template>

<script>
    const { Octicon, Octicons } = require('octicons-vue')
    import OverlayMenu from '@/components/OverlayMenu'
    import UserRegistration from '@/components/UserRegistration'
    import UpdateNicknameForm from '@/components/UpdateNicknameForm'

    export default {
        components: {
            OverlayMenu,
            UpdateNicknameForm,
            UserRegistration,
            Octicon
        },
        data() {
            return {
                show_user_options_menu: false,
                Octicons
            }
        },
        computed: {
            current_user() {
                return this.$store.state.current_user
            }
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
    #user-settings {
        padding: 1em;
        color: black;
    }
    #user-settings a:link,
    #user-settings a:visited,
    #user-settings a:hover {
        text-decoration: none;
    }
    .octicon {
        margin-top: 2px;
    }
</style>