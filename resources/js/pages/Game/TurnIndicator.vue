<template>
    <div class="turn-indicator">
        <span v-show="myTurn">It's your turn!</span>
        <span v-show="!myTurn">It's {{ opponent }}'s turn.</span>
    </div>
</template>

<script>
export default {
    computed: {
        myTurn() {
            return true
        },

        opponent() {
            return null
        },
    },
}
</script>
