<script setup>
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />

        <div class="col-span-12 xl:col-span-auto"></div>
        <div class="col-span-12 xl:col-span-6"></div>
    </div>
</template>
