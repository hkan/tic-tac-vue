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
                <tr v-for="item in $root.leaderboard">
                    <td>{{ item.username }}</td>
                    <td class="has-text-right">{{ item.won }} / {{ item.lost }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        ready() {
        }
    }
</script>

<style lang="scss" scoped>
    #leaderboard {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        width: 300px;
        background-color: #eee;
        text-align: center;
        padding: 40px 10px 0;
        -webkit-box-shadow: -2px 0px 4px 0px #cecece;
        -moz-box-shadow: -2px 0px 4px 0px #cecece;
        box-shadow: -2px 0px 4px 0px #cecece;

        h2 {
            color: #545454;
        }

        .table {
            background: none;
            margin: 30px 0 0;
            border: none;
            color: #545454;

            td, th {
                border: none;
            }

            thead {
                td, th {
                    color: inherit;
                }
            }
        }

        @media (max-width: 991px) {
            display: none;
        }
    }
</style>
