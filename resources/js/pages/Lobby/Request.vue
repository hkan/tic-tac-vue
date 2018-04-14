<template>
    <div class="request">
        <p>{{ username }} has invited you for a game.</p>

        <div class="field is-grouped">
            <p class="control">
                <button
                    class="button is-small is-primary"
                    :disabled="isActionable"
                    @click="accept"
                >
                    Accept
                </button>
            </p>

            <p class="control">
                <button
                    class="button is-small is-link"
                    :disabled="isActionable"
                    @click="refuse"
                >
                    Refuse
                </button>
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
        accept() {
            this.$store.dispatch('lobby/acceptRequest', { username: this.username })
            this.dismiss()
        },

        refuse() {
            this.$store.dispatch('lobby/refuseRequest', { username: this.username })
            this.dismiss()
        },

        dismiss() {
            this.$emit('dismiss')
        }
    },
}
</script>

<style lang="scss" scoped>

</style>
