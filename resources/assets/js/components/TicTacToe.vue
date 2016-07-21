<template>
    <div>
        <div class="table">
            <div class="row" v-for="row in 3">
                <div class="column" v-for="column in 3"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },

        methods: {},

        ready() {

        }
    }
</script>

<style lang="scss">
    .table {
        width: 330px;
        margin: 0 auto;

        .row {
            display: flex;
            justify-content: space-between;

            + .row {
                margin-top: 15px;
            }

            .column {
                flex: 0 0 100px;
                background: #f5f5f5;
                border-radius: 10px;
                height: 100px;
            }
        }
    }
</style>
