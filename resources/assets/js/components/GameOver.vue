<template>
    <div :class="['game-over']">
        <div v-if="won == 'home'">You won!</div>
        <div v-if="won == 'away'">You lost!</div>
        <div v-if="won == null">It's over</div>

        <a class="button" @click="playAgain">
            Wanna go again? 😏

            <span class="opponent-wants" v-if="opponentWants">
                Your opponent does!
            </span>
        </a>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                opponentWants: false
            }
        },

        events: {
            'opponent-wants-again'() {
                this.$set('opponentWants', true)
            }
        },

        methods: {
            playAgain() {

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
        background: rgba(#fff, .7);
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
