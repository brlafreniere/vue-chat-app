<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Features</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Pricing</a>
            </li>
            <li class="nav-item">
                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                current_user: {},
                current_room: {}
            }
        }
    }
</script>

<style lang="scss" scoped>
    $top-bar-color: #32314f;
    $standard-padding-amount: 1em;

    #top-bar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: white;
        width: auto;
        background-color: $top-bar-color;
        padding: $standard-padding-amount 50px;
    }

    #menu {
        color:white;
    }

    #current-room .lnr {
        width: 50px;
        fill: currentColor;
    }
</style>