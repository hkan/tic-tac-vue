<template>
    <div :class="['tic-tac-toe-table', {'active': game != null}]">
        <div class="row" v-for="(_, row) in 3" :key="'row' + row">
            <cell
                :class="{'turn': myTurn}"
                v-for="(_, column) in 3"
                :key="'row' + row + '.column' + column"
                :row="row"
                :column="column"
            />
        </div>
    </div>
</template>

<script>
import Cell from './Cell.vue'

export default {
    components: {
        Cell,
    },
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
