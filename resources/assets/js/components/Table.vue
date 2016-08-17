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
    import Cell from './Cell.vue'

    export default {
        props: [
            'state',
            'game',
            'myTurn'
        ],

        components: {
            Cell
        }
    }
</script>

<style lang="scss" scoped>
    .tic-tac-toe-table {
        width: 300px;
        margin: 50px auto 30px;

        .row {
            display: flex;
            justify-content: space-between;

            + .row {
                margin-top: 15px;
            }

            .cell {
                flex: 0 0 90px;
                border-radius: 10px;
                height: 90px;
            }
        }
    }
</style>
