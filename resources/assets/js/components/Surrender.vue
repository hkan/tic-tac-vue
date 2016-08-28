<template>
    <div>
        <p class="control">
            <button
                @click="surrender"
                :class="['button surrender', 'is-primary']"
            >Surrender</button>
        </p>

        <confirm-dialog
            title="Surrender?"
            subtitle="Are you sure you wish to surrender?"
            deny-text="nah m8"
            accept-text="yes m8"
            v-on:deny="cancel"
            v-on:accept="accept"
            v-show="confirmSurrender"
        ></confirm-dialog>
    </div>
</template>

<script>
    import ConfirmDialog from './ConfirmDialog.vue'

    export default {

        data () {
            return {
                confirmSurrender: false
            }
        },

        components: {
            ConfirmDialog
        },

        methods: {
            surrender() {
                this.confirmSurrender = true
            },

            accept() {
                this.$dispatch('surrender')
                this.confirmSurrender = false
            },
            
            cancel() {
                this.confirmSurrender = false
            }

        },
    }
</script>

<style lang="scss" scoped>
    p.control {
        text-align: center;
        margin-top: 25px;
    }

    .surrender {
        width: 300px;
    }
</style>
