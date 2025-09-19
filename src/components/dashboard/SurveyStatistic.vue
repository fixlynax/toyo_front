<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
        datasets: [
            {
                type: 'line',
                label: 'Answers 1',
                borderColor: documentStyle.getPropertyValue('--p-primary-600'),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-600'),
                tension: 0.3, // smooth curve
                fill: false,
                data: [5, 3, 7, 10, 1, 7]
            },
            {
                type: 'line',
                label: 'Answers 2',
                borderColor: documentStyle.getPropertyValue('--p-primary-400'),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                tension: 0.3,
                fill: false,
                data: [2, 5, 1, 2, 0, 2]
            },
            {
                type: 'line',
                label: 'Answers 3',
                borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                tension: 0.3,
                fill: false,
                data: [6, 6, 5, 8, 7, 5]
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div class="card">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
    </div>
</template>
