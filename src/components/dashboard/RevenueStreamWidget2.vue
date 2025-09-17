<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                type: 'line',
                label: 'Data 1',
                borderColor: documentStyle.getPropertyValue('--p-primary-600'),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                tension: 0.4, // smooth curve
                fill: false,
                data: [4000, 10000, 15000, 4000, 8200, 6000, 7200, 5000, 0, 0, 0, 0]
            },
            {
                type: 'line',
                label: 'Data 2',
                borderColor: documentStyle.getPropertyValue('--p-primary-400'),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                tension: 0.4,
                fill: false,
                data: [2100, 8400, 2400, 7500, 9200, 6800, 5400, 3000, 0, 0, 0, 0]
            },
            {
                type: 'line',
                label: 'Data 3',
                borderColor: documentStyle.getPropertyValue('--p-primary-200'),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                tension: 0.4,
                fill: false,
                data: [4100, 5200, 3400, 7400, 8800, 5600, 6300, 4700, 0, 0, 0, 0]
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
        <div class="font-semibold text-xl mb-4">Dummy Data 2</div>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />
    </div>
</template>
