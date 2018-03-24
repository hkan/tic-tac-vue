<template>
    <div class="request">
        <p>{{ username }} has invited you for a game.</p>

        <div class="field is-grouped">
            <p class="control">
                <a class="button is-small is-primary">
                    Accept
                </a>
            </p>

            <p class="control">
                <a class="button is-small is-link">
                    Decline
                </a>
            </p>
        </div>
    </div>
</template>

<script>
import socket from '../../socket'

export default {
    props: {
        request: {
            type: Object,
            required: true,
        },
    },

    computed: {
        username() {
            return this.request.by
        }
    },

    methods: {
    },
}
</script>

<style lang="scss" scoped>

</style>
