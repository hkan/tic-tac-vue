<template>
    <div
        :class="['column', 'state-' + state]"
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

                this.$dispatch('play', this)
            },

            check(away) {
                this.state = away ? 'away' : 'home'
            }
        }
    }
</script>

<style lang="scss" scoped>
    div.column {
        position: relative;

        &.state-empty.my-turn {
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }

        &.state-home {
            background: green;
            color: #fff;

            &:before {
                content: "✓";
                font-size: 80px;
                line-height: 1;
                position: absolute;
                left: 50%;
                top: 10px;
                margin: 0;
                transform: translate(-50%);
            }
        }

        &.state-away {
            background: red;
            color: #fff;

            &:before {
                content: "✖︎";
                font-size: 80px;
                line-height: 1;
                position: absolute;
                left: 50%;
                top: 10px;
                margin: 0;
                transform: translate(-50%);
            }
        }
    }
</style>
