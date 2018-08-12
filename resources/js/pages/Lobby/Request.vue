<template>
    <div class="request">
        <div class="modal is-active">
            <div class="modal-background"></div>

            <div class="modal-content">
                <div class="box">
                    <p>{{ username }} has invited you for a game.</p>

                    <div class="field is-grouped is-grouped-centered">
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
            </div>
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
            this.$router.push('/game')
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
.modal {
    &-background {
        background-color: rgba(0, 0, 0, .5);
    }
}
</style>
