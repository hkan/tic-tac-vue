<template>
    <div :class="['confirm-dialog']">
        <h1>{{ title }}</h1>

        <p>{{ subtitle }}</p>

        <div class="control is-grouped">
            <p class="control">
                <button class="button is-danger" @click="deny">
                    {{ denyText }}
                </button>
            </p>

            <p class="control">
                <button class="button is-success" @click="accept">
                    {{ acceptText }}
                </button>
            </p>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default Vue.extend({

        props: ['title', 'subtitle', 'denyText', 'acceptText'],

        methods: {
            deny() {
                this.$emit('deny')
            },

            accept() {
                this.$emit('accept')
            }
        },
    })
</script>

<style lang="scss" scoped>
    .confirm-dialog {
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
