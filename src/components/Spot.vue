<script setup lang="ts">
defineProps<{
    spot: string;
}>();
</script>

<template>
    <div class="spot">
        {{ spot }}
    </div>
</template>

<style scoped>
.spot {
    width: 100px;
    height: 100px;
    border: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
}
</style>
