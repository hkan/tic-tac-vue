<template>
    <div>
        <div class="tic-tac-toe-table">
            <div class="row" v-for="row in 3">
                <cell
                    :class="{'my-turn': myTurn}"
                    v-for="column in 3"
                    :row="row"
                    :column="column"
                    :state.sync="state[row][column]"
                ></cell>
            </div>
        </div>
    </div>
</template>

<script>
    import Cell from './Cell.vue'

    export default {
        data() {
            return {
                myTurn: false,
                state: [
                    ['empty', 'empty', 'empty'],
                    ['empty', 'empty', 'empty'],
                    ['empty', 'empty', 'empty']
                ]
            }
        },

        components: {Cell},

        methods: {
            sendPlayEvent(cell) {
                this.$dispatch('play', cell.row, cell.column)
            }
        },

        events: {
            start() {
                this.$set('myTurn', true)
            },

            play(cell) {
                if (!this.myTurn) {
                    return
                }

                if (cell.state != 'empty') {
                    return
                }

                cell.check()

                this.myTurn = false

                this.sendPlayEvent(cell)
            },

            onPlay({row, column}) {
                if (this.state[row][column] != 'empty') {
                    return
                }

                this.$set('state[' + row + '][' + column + ']', 'away')
                this.myTurn = true
            }
        },

        ready() {

        }
    }
</script>

<style lang="scss">
    .tic-tac-toe-table {
        width: 330px;
        margin: 50px auto;

        .row {
            display: flex;
            justify-content: space-between;

            + .row {
                margin-top: 15px;
            }

            .column {
                flex: 0 0 100px;
                background: #f5f5f5;
                border-radius: 10px;
                height: 100px;
            }
        }
    }
</style>
