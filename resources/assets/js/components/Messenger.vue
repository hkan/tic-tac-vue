<template>
    <div id="messenger">
        <h2>Messenger</h2>
        <ul>
            <li v-for="item in data"><strong>{{ item.username }}: </strong>{{ item.message }}</li>
        </ul>
        <form @submit.prevent="send" class="message-form">
            <p class="control">
                <input type="text" class="input" v-model="message" placeholder="Send a message...">
            </p>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: {},
                message: null
            }
        },


        methods: {
            send() {
                this.$root.socket.emit('messenger-send', { message: this.message, colour: this.$root.colour })
                this.message = ''
            },
        },

        events: {
            'messenger-data'(data) {
                this.$set('data', data)
            }
        },

        ready() {
            this.$root.socket.on('messenger-data', (data) => {
                this.$emit('messenger-data', data)
            })
        },
    }
</script>

<style lang="scss" scoped>
    #messenger {
        flex: 0 0 300px;
        background-color: #fbfbfb;
        text-align: center;
        padding: 40px 0 0;
        margin-left: -10px;
        box-shadow: inset 0 0 6px 0 rgba(#000, .2);
        display: none;

        @media (min-width: 992px) {
            display: block;
        }

        .control {
            margin-left: 18px;
        }

        h2 {
            color: #888;
            font-weight: 700;
        }

        ul {
            list-style: none;
            text-align: left;

            li {
                margin-top: 0.5em;

                strong {
                    color: #888;
                }
            }
        }

        input {
            position: fixed;
            width: 270px;
            bottom: 10px;
        }

        .message-form {
            margin: 0 auto;
            width: 100%;
        }
    }
</style>
