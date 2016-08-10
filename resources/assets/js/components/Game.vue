<template>
    <div class="game">
        <tic-tac-toe></tic-tac-toe>
    </div>
</template>

<script>
    import TicTacToe from './TicTacToe.vue'

    export default {
        components: {
            TicTacToe,
        },

        ready() {
            this.$dispatch('game-component-ready')
        }
    }
</script>

<style lang="scss" scoped>

</style>
