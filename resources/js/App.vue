<template>
    <router-view></router-view>
</template>

<script>
    import Vue from 'vue'

    export default Vue.extend({
        name: 'Root',
    })
</script>

<style lang="scss">
    html, body {
        background: #fff;
        height: 100%;
    }

    body {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    fieldset {
        border: 0;
    }
</style>
