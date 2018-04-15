<template>
    <div class="has-text-centered">
        <Table />
    </div>
</template>

<script>
import socket from '../../socket'
import Table from './Table/Table.vue'
import TurnIndicator from './TurnIndicator.vue'

export default {
    components: {
        Table,
        TurnIndicator,
    },

    created() {
        socket.on('game:marked', ({ row, column }) => {
            this.$store.dispatch('game/markCellDirect', {
                row,
                column,
                value: 'away',
            })
        })
    }
}
</script>
