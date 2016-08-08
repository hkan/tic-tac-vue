<template>
    <div
        :class="['cell', 'state-' + state]"
        @click="click"
    ></div>
</template>

<script>
    export default {
        props: {
            state: {
                type: String,
                default: 'empty',
                required: true,
                twoWay: true
            },

            row: {
                type: Number
            },

            column: {
                type: Number
            }
        },

        methods: {
            click(e) {
                e.preventDefault()

                if (this.state != 'empty') {
                    return
                }

                this.$dispatch('home-played', this)
            },

            check(away) {
                this.state = away ? 'away' : 'home'
            }
        }
    }
</script>

<style lang="scss" scoped>
    div.cell {
        position: relative;
        background: #f5f5f5;

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
                border: solid green;
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
                border: 15px solid red;
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
