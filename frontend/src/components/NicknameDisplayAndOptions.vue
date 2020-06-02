<template>
    <div id='user-settings'>
        <div class="d-flex flex-row justify-content-between">
            <div>
                <Octicon :icon="Octicons.person" /> {{current_user.nickname}}
            </div>
            <div>
                <a href="#" @click="show_user_options_menu = true">
                    <Octicon :icon="Octicons.gear"/>
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
        color: white;
        background-color: #3D3657;
        padding: 1em;
    }
    #user-settings a:link,
    #user-settings a:visited,
    #user-settings a:hover {
        color: #9CF4B9;
        text-decoration: none;
    }
    .octicon {
        margin-top: 2px;
    }
</style>