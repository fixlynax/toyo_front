<script setup>
import RevenueStreamWidget from '@/components/dashboard/RevenueStreamWidget.vue';
import RevenueStreamWidget2 from '@/components/dashboard/RevenueStreamWidget2.vue';
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <StatsWidget />

        <div class="col-span-12 xl:col-span-auto">
            <RevenueStreamWidget />
            <RevenueStreamWidget2 />
        </div>
        <div class="col-span-12 xl:col-span-6">
        </div>
    </div>
</template>