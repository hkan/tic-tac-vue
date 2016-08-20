<template>
    <div id="leaderboard">
        <h2>Leaderboard</h2>
        <table class="table">
            <thead>
                <tr>
                    <td>Username</td>
                    <td class="has-text-right">W / L</td>
                </tr>
            </thead>
            <tbody>
                {{ data | json }}

                <tr v-for="item in data['leaderboard']">
                    <td>{{ item.username }}</td>
                    <td class="has-text-right">{{ item.won }} / {{ item.lost }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: {}
            }
        },

        events: {
            'leaderboard-data'(data) {
                this.$set('data', data)
            }
        },

        ready() {
            this.$root.socket.on('leaderboard-data', (data) => {
                console.log(data)
                this.$emit('leaderboard-data', data)
            })
        },
    }
</script>

<style lang="scss" scoped>
    #leaderboard {
        flex: 0 0 300px;
        background-color: #fbfbfb;
        text-align: center;
        padding: 40px 20px 0;
        margin-right: -10px;
        box-shadow: inset 0 0 6px 0 rgba(#000, .2);

        h2 {
            color: #888;
            font-weight: 700;
        }

        .table {
            background: none;
            margin: 30px 0 0;
            border: none;
            color: #888;

            td, th {
                border: none;
            }

            thead {
                tr {
                    &:hover {
                        background: none;
                    }

                    th {
                        font-weight: 700;
                        color: inherit;
                    }
                }
            }

            tbody {
                td {
                    cursor: default;
                }
            }
        }
    }
</style>
