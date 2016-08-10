<template>
    <div :class="['match-request']">
        <h1>You have a match request!</h1>

        <p>{{ username }} wants to play with you.</p>

        <div class="control is-grouped">
            <p class="control">
                <button class="button is-danger" @click="deny">
                    nah m8
                </button>
            </p>

            <p class="control">
                <button class="button is-success" @click="accept">
                    k m8, let's go
                </button>
            </p>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default Vue.extend({
        data() {
            return {
                username: ''
            }
        },

        methods: {
            deny() {
                this.$root.socket.emit('match-deny')
            },

            accept() {
                this.$root.socket.emit('match-confirm')
            }
        },
    })
</script>

<style lang="scss" scoped>
    .match-request {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(#f5f5f5, .85);
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
