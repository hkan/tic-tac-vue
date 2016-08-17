<template>
    <div class="tic-tac-toe-game">
        <game-table
            :game.sync="game"
            :state.sync="state"
            :my-turn.sync="myTurn"
        ></game-table>

        <div class="turn-indicator" v-if="game !== null">
            <span v-show="myTurn">It's your turn!</span>
            <span v-else>It's {{ $root.opponent.username }}'s turn.</span>
        </div>

        <game-over v-show="over"></game-over>
    </div>
</template>

<script>
    import GameTable from './Table.vue'
    import GameOver from './GameOver.vue'
    import _ from 'lodash'

    export default {
        data() {
            return {
                game: null,
                myTurn: false,

                over: false,
                won: null,

                state: [
                    ['empty', 'empty', 'empty'],
                    ['empty', 'empty', 'empty'],
                    ['empty', 'empty', 'empty']
                ]
            }
        },

        computed: {
            isAllCellsChecked() {
                var flat = _.flatten(this.state),
                    emptyCell;

                emptyCell = _.find(flat, el => {
                    return el == 'empty'
                })

                return emptyCell != 'empty'
            },

            horizontalTriple() {
                return this.checkForTriples(this.state)
            },

            verticalTriple() {
                return this.checkForTriples(_.zip.apply(_, this.state))
            },

            crossTriple() {
                if (this.state[0][0] == this.state[1][1]
                    && this.state[1][1] == this.state[2][2]
                    && (this.state[1][1] == 'home' || this.state[1][1] == 'away')
                ) {
                    return this.state[1][1]
                }

                if (this.state[2][0] == this.state[1][1]
                    && this.state[1][1] == this.state[0][2]
                    && (this.state[1][1] == 'home' || this.state[1][1] == 'away')
                ) {
                    return this.state[1][1]
                }

                return false
            }
        },

        components: {
            GameTable,
            GameOver,
        },

        methods: {
            sendPlayEvent(cell) {
                this.$dispatch('play', cell.row, cell.column)
            },

            checkForTriples(matrix) {
                return matrix.reduce((rowResult, row) => {
                    var curRes = row.reduce((result, cell) => {
                        if (result === null) {
                            return cell
                        }

                        if (result != cell) {
                            return false
                        }

                        if (cell != 'home' && cell != 'away') {
                            return false
                        }

                        return cell
                    }, null)

                    return rowResult || curRes
                }, false)
            },

            checkForEnd() {
                if (this.horizontalTriple !== false) {
                    return this[this.horizontalTriple + 'Wins']()
                }

                if (this.verticalTriple !== false) {
                    return this[this.verticalTriple + 'Wins']()
                }

                if (this.crossTriple !== false) {
                    return this[this.crossTriple + 'Wins']()
                }

                if (this.isAllCellsChecked) {
                    return this.tie()
                }
            },

            reset() {
                this.$set('state', [
                    ['empty', 'empty', 'empty'],
                    ['empty', 'empty', 'empty'],
                    ['empty', 'empty', 'empty']
                ])

                this.won = null
                this.over = false
                this.myTurn = false
            },

            homeWins() {
                this.won = 'home'
                this.over = true
                this.$dispatch('game-over', this.won, this.user)
            },

            awayWins() {
                this.won = 'away'
                this.over = true
                this.$dispatch('game-over', this.won, this.user)
            },

            tie() {
                this.won = null
                this.over = true
            }
        },

        events: {
            game(game) {
                this.game = game
            },

            start() {
                this.$set('myTurn', true)
            },

            restart() {
                this.reset()
                return true
            },

            'opponent-disconnected'() {
                this.$set('myTurn', false)
                this.game = null

                this.reset()
            },

            'home-played'(cell) {
                if (!this.myTurn) {
                    return
                }

                if (cell.state != 'empty') {
                    return
                }

                cell.check()

                this.myTurn = false

                this.sendPlayEvent(cell)
                this.checkForEnd()
            },

            'opponent-played'({row, column}) {
                if (this.state[row][column] != 'empty') {
                    return
                }

                this.$set('state[' + row + '][' + column + ']', 'away')
                this.myTurn = true
                this.checkForEnd()
            }
        },

        ready() {

        }
    }
</script>

<style lang="scss">
    .tic-tac-toe-game {
        position: relative;
    }

    .turn-indicator {
        font-size: 16px;
        color: #666;
        font-weight: bold;
        text-align: center
    }
</style>
