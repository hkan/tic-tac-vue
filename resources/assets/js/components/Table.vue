<template>
    <div :class="['tic-tac-toe-table', {'active': game != null, 'turn': myTurn}]">
        <div class="row" v-for="row in 3">
            <cell
                :class="{'turn': myTurn}"
                v-for="column in 3"
                :row="row"
                :column="column"
                :state.sync="state[row][column]"
            ></cell>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
            }
        },
        computed: {},
        ready: function () {},
        attached: function () {},
        methods: {},
        components: {}
    }
</script>

<style lang="css">
</style>
