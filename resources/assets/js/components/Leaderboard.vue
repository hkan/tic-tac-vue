<template>
    <div class="leaderboard">
        <h1>Leaderboard</h1>

        <table class="table is-bordered">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Won</th>
                    <th>Lost</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>andreaselia</th>
                    <th>10</th>
                    <th>0</th>
                </tr>
                <tr>
                    <th>hkan</th>
                    <th>0</th>
                    <th>10</th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {

    }
</script>

<style lang="scss">
    .leaderboard {
        margin: 50px 0;
    }
</style>
