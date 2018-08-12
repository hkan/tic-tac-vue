<template>
    <div
        :class="['cell', 'state-' + state]"
        @click="click"
    ></div>
</template>

<script>
export default {
    props: {
        row: {
            type: Number,
            required: true,
        },

        column: {
            type: Number,
            required: true,
        },
    },

    computed: {
        state() {
            return this.$store.state.game.cells[this.row][this.column]
        },
    },

    methods: {
        click(e) {
            e.preventDefault()

            if (this.state !== 'empty') {
                return
            }

            this.$store.dispatch('game/markCell', {
                row: this.row,
                column: this.column,
                value: 'home',
            })
        },
    },
}
</script>

<style lang="scss" scoped>
div.cell {
    position: relative;
    background: hsl(0, 0%, 96%);

    &.state-empty.turn {
        cursor: pointer;

        &:hover {
            background: #eee;
        }
    }

    &.state-home {
        &:before {
            content: "";
            height: 60px;
            width: 35px;
            border: solid hsl(141, 71%, 48%);
            border-width: 0 15px 15px 0;
            position: absolute;
            left: 50%;
            top: 10px;
            margin: 0;
            transform: translate(-50%) rotate(45deg);
        }
    }

    &.state-away {
        &:before {
            content: "";
            height: 70px;
            width: 70px;
            border: 15px solid hsl(348, 100%, 61%);
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 10px;
            margin: 0;
            transform: translate(-50%);
        }
    }
}
</style>
