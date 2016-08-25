<template>
    <div :class="['game-over']">
        <div v-if="outcome == 'home'">You won!</div>
        <div v-if="outcome == 'away'">You lost!</div>
        <div v-if="outcome == 'surrendered'">Opponent surrendered!</div>
        <div v-if="outcome == null">It's over</div>

        <button class="button" @click="playAgain" :disabled="checked">
            <span v-show="checked">Waiting for opponent...</span>
            <span v-else>Wanna go again? 😏</span>

            <span class="opponent-wants" v-if="opponentWants">
                Your opponent does!
            </span>
        </button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                checked: false,
                opponentWants: false
            }
        },

        computed: {
            outcome() {
                return this.$parent.outcome
            }
        },

        events: {
            'opponent-wants-again'() {
                this.$set('opponentWants', true)
            },

            restart() {
                this.checked = false
                this.$set('opponentWants', false)
                return true
            }
        },

        methods: {
            playAgain() {
                this.checked = true
                this.$dispatch('play-again')
            },
        }
    }
</script>

<style lang="scss" scoped>
    .game-over {
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
        font-size: 40px;
    }

    .button {
        span.opponent-wants {
            margin-left: 10px
        }
    }
</style>
