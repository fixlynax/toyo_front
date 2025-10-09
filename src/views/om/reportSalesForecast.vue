<template>
  <div class="card">
    <!-- Header with Title and Filters -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Sales Forecast Vs Actual</h1>
      <div class="flex gap-4 items-center">
        <!-- Year Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-gray-700">Year:</label>
          <Dropdown 
            v-model="filters.year" 
            :options="yearOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="Select Year"
            class="w-32"
            @change="updateChart"
          />
        </div>

        <!-- Product Category Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-gray-700">Category:</label>
          <Dropdown 
            v-model="filters.category" 
            :options="categoryOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="All Categories"
            class="w-40"
            @change="updateChart"
          />
        </div>

        <!-- Region Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold text-gray-700">Region:</label>
          <Dropdown 
            v-model="filters.region" 
            :options="regionOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="All Regions"
            class="w-40"
            @change="updateChart"
          />
        </div>

        <!-- Reset Filters Button -->
        <Button 
          label="Reset" 
          icon="pi pi-refresh" 
          class="p-button-outlined p-button-secondary p-button-sm"
          @click="resetFilters"
        />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="card p-4 bg-white border rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-gray-600">Total Forecast</div>
            <div class="text-2xl font-bold text-blue-600 mt-1">RM {{ summary.totalForecast.toLocaleString() }}</div>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="pi pi-chart-line text-blue-600"></i>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-2">Projected sales</div>
      </div>

      <div class="card p-4 bg-white border rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-gray-600">Total Actual</div>
            <div class="text-2xl font-bold text-green-600 mt-1">RM {{ summary.totalActual.toLocaleString() }}</div>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i class="pi pi-chart-bar text-green-600"></i>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-2">Achieved sales</div>
      </div>

      <div class="card p-4 bg-white border rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-gray-600">Variance</div>
            <div class="text-2xl font-bold mt-1" :class="summary.variance >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ summary.variance >= 0 ? '+' : '' }}{{ summary.variance.toLocaleString() }}%
            </div>
          </div>
          <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <i class="pi pi-percentage text-orange-600"></i>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-2">Forecast vs Actual</div>
      </div>

      <div class="card p-4 bg-white border rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold text-gray-600">Accuracy</div>
            <div class="text-2xl font-bold text-purple-600 mt-1">{{ summary.accuracy }}%</div>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="pi pi-bullseye text-purple-600"></i>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-2">Forecast precision</div>
      </div>
    </div>

    <!-- Main Chart -->
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80" />

    <!-- Detailed Data Table -->
    <div class="mt-8">
      <DataTable 
        :value="monthlyData" 
        :paginator="true" 
        :rows="6"
        :rowsPerPageOptions="[6, 12, 24]"
        dataKey="month" 
        :rowHover="true"
        responsiveLayout="scroll"
      >
        <Column field="month" header="Month" style="min-width: 100px" :sortable="true">
          <template #body="{ data }">
            <div class="font-semibold">{{ data.month }}</div>
          </template>
        </Column>

        <Column header="Forecast Sales" style="min-width: 120px" :sortable="true">
          <template #body="{ data }">
            <div class="text-blue-600 font-bold">RM {{ data.forecast.toLocaleString() }}</div>
          </template>
        </Column>

        <Column header="Actual Sales" style="min-width: 120px" :sortable="true">
          <template #body="{ data }">
            <div class="text-green-600 font-bold">RM {{ data.actual.toLocaleString() }}</div>
          </template>
        </Column>

        <Column header="Variance" style="min-width: 100px" :sortable="true">
          <template #body="{ data }">
            <Tag 
              :value="data.variance >= 0 ? `+${data.variance}%` : `${data.variance}%`" 
              :severity="data.variance >= 0 ? 'success' : 'danger'" 
            />
          </template>
        </Column>

        <Column header="Variance Amount" style="min-width: 120px" :sortable="true">
          <template #body="{ data }">
            <div class="font-bold" :class="data.varianceAmount >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ data.varianceAmount >= 0 ? '+' : '' }}RM {{ Math.abs(data.varianceAmount).toLocaleString() }}
            </div>
          </template>
        </Column>

        <Column header="Status" style="min-width: 100px" :sortable="true">
          <template #body="{ data }">
            <Tag 
              :value="getStatus(data.variance)" 
              :severity="getStatusSeverity(data.variance)" 
            />
          </template>
        </Column>

        <template #empty>
          <div class="text-center text-gray-500 py-4">
            No sales data available.
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onMounted, ref, watch, computed } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

// Filters
const filters = ref({
  year: 2024,
  category: 'all',
  region: 'all'
});

// Filter Options
const yearOptions = ref([
  { label: '2024', value: 2024 },
  { label: '2023', value: 2023 },
  { label: '2022', value: 2022 }
]);

const categoryOptions = ref([
  { label: 'All Categories', value: 'all' },
  { label: 'Passenger Tyres', value: 'passenger' },
  { label: 'Commercial Tyres', value: 'commercial' },
  { label: 'SUV Tyres', value: 'suv' },
  { label: 'Accessories', value: 'accessories' }
]);

const regionOptions = ref([
  { label: 'All Regions', value: 'all' },
  { label: 'Central Region', value: 'central' },
  { label: 'Northern Region', value: 'northern' },
  { label: 'Southern Region', value: 'southern' },
  { label: 'East Coast', value: 'east_coast' },
  { label: 'East Malaysia', value: 'east_malaysia' }
]);

// Summary Data
const summary = ref({
  totalForecast: 0,
  totalActual: 0,
  variance: 0,
  accuracy: 0
});

// Monthly Data
const monthlyData = ref([]);

// Sample data generator based on filters
function generateSalesData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseForecast = filters.value.year === 2024 ? 80000 : filters.value.year === 2023 ? 75000 : 70000;
  const regionMultiplier = getRegionMultiplier(filters.value.region);
  const categoryMultiplier = getCategoryMultiplier(filters.value.category);

  return months.map((month, index) => {
    const forecast = Math.round((baseForecast * (0.8 + Math.random() * 0.4)) * regionMultiplier * categoryMultiplier);
    const actual = Math.round(forecast * (0.85 + Math.random() * 0.3)); // Actual is 85-115% of forecast
    const variance = Math.round(((actual - forecast) / forecast) * 100);
    const varianceAmount = actual - forecast;

    return {
      month,
      forecast,
      actual,
      variance,
      varianceAmount
    };
  });
}

function getRegionMultiplier(region) {
  const multipliers = {
    'all': 1,
    'central': 0.4,
    'northern': 0.2,
    'southern': 0.15,
    'east_coast': 0.1,
    'east_malaysia': 0.15
  };
  return multipliers[region] || 1;
}

function getCategoryMultiplier(category) {
  const multipliers = {
    'all': 1,
    'passenger': 0.5,
    'commercial': 0.3,
    'suv': 0.15,
    'accessories': 0.05
  };
  return multipliers[category] || 1;
}

function updateSummary(data) {
  const totalForecast = data.reduce((sum, item) => sum + item.forecast, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
  const variance = Math.round(((totalActual - totalForecast) / totalForecast) * 100);
  const accuracy = Math.round((1 - Math.abs(totalActual - totalForecast) / totalForecast) * 100);

  summary.value = {
    totalForecast,
    totalActual,
    variance,
    accuracy: Math.max(0, Math.min(100, accuracy))
  };
}

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);
  const labels = monthlyData.value.map(item => item.month);
  const forecastData = monthlyData.value.map(item => item.forecast);
  const actualData = monthlyData.value.map(item => item.actual);

  return {
    labels: labels,
    datasets: [
      {
        type: 'line',
        label: 'Actual Sales',
        backgroundColor: 'transparent',
        borderColor: documentStyle.getPropertyValue('--p-primary-700'),
        pointBackgroundColor: documentStyle.getPropertyValue('--p-primary-700'),
        pointBorderColor: documentStyle.getPropertyValue('--p-primary-700'),
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        data: actualData
      },
      {
        type: 'line',
        label: 'Forecast Sales',
        borderColor: documentStyle.getPropertyValue('--p-primary-400'),
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointBackgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
        pointBorderColor: documentStyle.getPropertyValue('--p-primary-400'),
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        data: forecastData
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
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        ticks: {
          color: textMutedColor
        },
        grid: {
          color: borderColor,
          borderColor: 'transparent'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textMutedColor,
          callback: function(value) {
            return 'RM ' + (value / 1000).toFixed(0) + 'K';
          }
        },
        grid: {
          color: borderColor,
          borderColor: 'transparent',
          drawTicks: false
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += 'RM ' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      },
      legend: {
        labels: {
          color: textMutedColor,
          usePointStyle: true
        }
      }
    }
  };
}

function getStatus(variance) {
  if (variance >= 10) return 'Exceeded';
  if (variance >= -5) return 'On Target';
  if (variance >= -15) return 'Below Target';
  return 'Critical';
}

function getStatusSeverity(variance) {
  if (variance >= 10) return 'success';
  if (variance >= -5) return 'info';
  if (variance >= -15) return 'warning';
  return 'danger';
}

function updateChart() {
  monthlyData.value = generateSalesData();
  updateSummary(monthlyData.value);
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
}

function resetFilters() {
  filters.value = {
    year: 2024,
    category: 'all',
    region: 'all'
  };
  updateChart();
}

// Watch for theme changes
watch([getPrimary, getSurface, isDarkTheme], () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

// Watch for filter changes
watch(filters, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  updateChart();
});
</script>

<style scoped>
.report-sales-forecast {
  padding: 1.5rem;
}

:deep(.p-dropdown) {
  min-width: 120px;
}
</style>