<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Sales Forecast Report</div>

                                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Total Forecast</div>
                                <div class="text-2xl font-bold text-blue-600 mt-1">{{ summaryStats.totalForecast.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-chart-line text-blue-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">Total forecasted units</div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Actual Orders</div>
                                <div class="text-2xl font-bold text-green-600 mt-1">{{ summaryStats.totalOrders.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-shopping-cart text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">Actual ordered units</div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Back Orders</div>
                                <div class="text-2xl font-bold text-orange-600 mt-1">{{ summaryStats.totalBackOrders.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-exclamation-triangle text-orange-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">Pending back orders</div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Achievement Rate</div>
                                <div class="text-2xl font-bold text-purple-600 mt-1">{{ summaryStats.achievementRate }}</div>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-percentage text-purple-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">Forecast vs Actual</div>
                    </div>
                </div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Customer Account -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <Dropdown v-model="filters.custAccountNo" :options="customerOptions" optionLabel="label" optionValue="value" placeholder="Select Customer Account" class="w-full" />
                        </div>

                        <!-- Month -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Month</label>
                            <Dropdown v-model="filters.month" :options="monthOptions" optionLabel="label" optionValue="value" placeholder="Select Month" class="w-full" />
                        </div>

                        <!-- Year -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Year</label>
                            <Dropdown v-model="filters.year" :options="yearOptions" optionLabel="label" optionValue="value" placeholder="Select Year" class="w-full" />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                        <Button label="Generate Report" class="p-button-primary" @click="generateReport" :loading="loading" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" />
                    </div>
                </div>

                <!-- Monthly Performance Chart -->
                <div class="bg-white border rounded-lg p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Monthly Performance Trend</div>
                        <div class="flex gap-2">
                            <Button label="Forecast" :class="chartView === 'forecast' ? 'p-button-primary' : 'p-button-outlined'" @click="chartView = 'forecast'" />
                            <Button label="Actual" :class="chartView === 'actual' ? 'p-button-primary' : 'p-button-outlined'" @click="chartView = 'actual'" />
                            <Button label="Comparison" :class="chartView === 'comparison' ? 'p-button-primary' : 'p-button-outlined'" @click="chartView = 'comparison'" />
                        </div>
                    </div>
                    <Chart type="bar" :data="chartData" :options="chartOptions" height="300px" />
                </div>

                <!-- Sales Forecast Data Table -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Sales Forecast Details</div>
                        <div class="text-sm text-gray-600">Total Records: {{ salesForecastData.length }}</div>
                    </div>

                    <DataTable
                        :value="salesForecastData"
                        :paginator="true"
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        dataKey="Material"
                        :rowHover="true"
                        :loading="loading"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="400px"
                        class="rounded-table"
                    >
                        <Column field="Sales Office" header="Sales Office" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-semibold">{{ data['Sales Office'] }}</div>
                            </template>
                        </Column>

                        <Column field="Sold-to Party" header="Customer Acc No." style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-medium">{{ data['Sold-to Party'] }}</div>
                            </template>
                        </Column>

                        <Column field="Dealer" header="Customer " style="min-width: 200px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.Dealer }}</div>
                            </template>
                        </Column>

                        <Column field="Material" header="Material" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-mono text-sm text-blue-600">{{ data.Material }}</div>
                            </template>
                        </Column>

                        <Column field="Description" header="Description" style="min-width: 150px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">{{ data.Description }}</div>
                            </template>
                        </Column>

                        <Column field="Pattern" header="Pattern" style="min-width: 80px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center">{{ data.Pattern }}</div>
                            </template>
                        </Column>

                        <Column field="Rim" header="Rim" style="min-width: 70px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center">{{ data.Rim }}</div>
                            </template>
                        </Column>

                        <!-- <Column field="Total Forecast" header="Total Forecast" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold text-blue-600">
                                    {{ data['Total Forecast'] }}
                                </div>
                            </template>
                        </Column>

                        <Column field="Total Order" header="Actual Orders" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold text-green-600">
                                    {{ data['Total Order'] }}
                                </div>
                            </template>
                        </Column>

                        <Column field="Total BackOrder" header="Back Orders" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold text-orange-600">
                                    {{ data['Total BackOrder'] }}
                                </div>
                            </template>
                        </Column>

                        <Column field="%" header="Achievement %" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center">
                                    <Tag :value="data['%']" :severity="getAchievementSeverity(data['%'])" />
                                </div>
                            </template>
                        </Column> -->

                        <Column header="Monthly View" style="min-width: 100px">
                            <template #body="{ data }">
                                <Button icon="pi pi-calendar" class="p-button-info p-button-text p-button-sm" v-tooltip="'View Monthly Details'" @click="viewMonthlyDetails(data)" />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-8">
                                <i class="pi pi-chart-line text-4xl mb-2"></i>
                                <div>No sales forecast data found.</div>
                                <div class="text-sm mt-1">Adjust your filters or generate a new report.</div>
                            </div>
                        </template>

                        <template #loading>
                            <div class="text-center py-4">
                                <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                                Loading sales forecast data...
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Monthly Details Dialog -->
        <Dialog v-model:visible="displayMonthlyDetails" :style="{ width: '900px' }" header="Monthly Forecast Details" :modal="true">
            <div v-if="selectedMaterial" class="space-y-4">
                <!-- Monthly Data Table -->
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-gray-800">Monthly Breakdown</h4>
                    <Tag :value="`Total: ${getTotalMonths(selectedMaterial.Months)} months`" severity="info" />
                </div>

                <DataTable :value="getMonthlyTableData(selectedMaterial.Months)" class="rounded-table" scrollable scrollHeight="300px" stripedRows showGridlines>
                    <Column field="month" header="Month" style="min-width: 100px">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.month }}</span>
                        </template>
                    </Column>

                    <Column field="forecast" header="Forecast" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-bold text-blue-600">{{ data.forecast }}</span>
                        </template>
                    </Column>

                    <Column field="order" header="Actual Orders" style="min-width: 120px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-bold text-green-600">{{ data.order }}</span>
                        </template>
                    </Column>

                    <Column field="backorder" header="Back Orders" style="min-width: 120px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-bold text-orange-600">{{ data.backorder }}</span>
                        </template>
                    </Column>

                    <Column field="achievement" header="Achievement %" style="min-width: 120px; text-align: center">
                        <template #body="{ data }">
                            <Tag :value="data.achievement" :severity="getMonthlyAchievementSeverity(data.achievement)" />
                        </template>
                    </Column>

                    <Column field="variance" header="Variance" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <span :class="getVarianceClass(data.variance)">
                                {{ data.variance }}
                            </span>
                        </template>
                    </Column>
                </DataTable>

                <!-- Performance Summary -->
                <Divider />
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div class="text-center p-3 bg-blue-50 rounded-lg">
                        <div class="font-bold text-blue-600 text-lg">{{ getTotalForecast(selectedMaterial.Months) }}</div>
                        <div class="text-gray-600">Total Forecast</div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded-lg">
                        <div class="font-bold text-green-600 text-lg">{{ getTotalOrders(selectedMaterial.Months) }}</div>
                        <div class="text-gray-600">Total Orders</div>
                    </div>
                    <div class="text-center p-3 bg-orange-50 rounded-lg">
                        <div class="font-bold text-orange-600 text-lg">{{ getTotalBackorders(selectedMaterial.Months) }}</div>
                        <div class="text-gray-600">Total Backorders</div>
                    </div>
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import api from '@/service/api';

// ✅ Filters
const filters = reactive({
    custAccountNo: null,
    month: null,
    year: new Date().getFullYear().toString()
});

// ✅ Loading states
const loading = ref(false);
const exportLoading = ref(false);

// ✅ Data
const salesForecastData = ref([]);
const customerOptions = ref([]);

// ✅ Dialog states
const displayMonthlyDetails = ref(false);
const selectedMaterial = ref(null);

// ✅ Chart view state
const chartView = ref('comparison');

// ✅ Month Options
const monthOptions = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
];

// ✅ Year Options
const yearOptions = [
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
    { label: '2026', value: '2026' }
];

// ✅ Summary Statistics (computed from actual data)
const summaryStats = computed(() => {
    const totalForecast = salesForecastData.value.reduce((sum, item) => sum + (parseInt(item['Total Forecast']) || 0), 0);
    const totalOrders = salesForecastData.value.reduce((sum, item) => sum + (parseInt(item['Total Order']) || 0), 0);
    const totalBackOrders = salesForecastData.value.reduce((sum, item) => sum + (parseInt(item['Total BackOrder']) || 0), 0);

    const achievementRate = totalForecast > 0 ? Math.round((totalOrders / totalForecast) * 100) + '%' : '0%';

    return {
        totalForecast,
        totalOrders,
        totalBackOrders,
        achievementRate
    };
});

// ✅ Chart Data
const chartData = computed(() => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    if (chartView.value === 'forecast') {
        return {
            labels: months,
            datasets: [
                {
                    label: 'Sales Forecast',
                    data: months.map((month) => getMonthlyTotal('forecast', month)),
                    backgroundColor: '#3B82F6',
                    borderColor: '#2563EB',
                    borderWidth: 2
                }
            ]
        };
    } else if (chartView.value === 'actual') {
        return {
            labels: months,
            datasets: [
                {
                    label: 'Actual Orders',
                    data: months.map((month) => getMonthlyTotal('order', month)),
                    backgroundColor: '#10B981',
                    borderColor: '#059669',
                    borderWidth: 2
                },
                {
                    label: 'Back Orders',
                    data: months.map((month) => getMonthlyTotal('backorder', month)),
                    backgroundColor: '#F59E0B',
                    borderColor: '#D97706',
                    borderWidth: 2
                }
            ]
        };
    } else {
        return {
            labels: months,
            datasets: [
                {
                    label: 'Sales Forecast',
                    data: months.map((month) => getMonthlyTotal('forecast', month)),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: '#3B82F6',
                    borderWidth: 2
                },
                {
                    label: 'Actual Orders',
                    data: months.map((month) => getMonthlyTotal('order', month)),
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                    borderColor: '#10B981',
                    borderWidth: 2
                }
            ]
        };
    }
});

// ✅ Chart Options
const chartOptions = ref({
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                boxWidth: 8
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Quantity'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Months'
            }
        }
    },
    maintainAspectRatio: false
});

// ✅ Generate customer options from sales forecast data
const generateCustomerOptions = () => {
    const customers = new Map();

    salesForecastData.value.forEach((item) => {
        const custAccountNo = item['Sold-to Party'];
        const dealerName = item.Dealer;

        if (custAccountNo && !customers.has(custAccountNo)) {
            customers.set(custAccountNo, {
                label: `${dealerName} (${custAccountNo})`,
                value: custAccountNo
            });
        }
    });

    // Convert to array and sort by label
    customerOptions.value = Array.from(customers.values()).sort((a, b) => a.label.localeCompare(b.label));

    // Add "All Customers" option at the beginning
    customerOptions.value.unshift({ label: 'All Customers', value: null });
};

// ✅ Get monthly total for chart
const getMonthlyTotal = (type, month) => {
    return salesForecastData.value.reduce((sum, item) => {
        const monthData = item.Months?.[month] || {};
        return sum + (parseInt(monthData[type]) || 0);
    }, 0);
};

// ✅ Get achievement severity
const getAchievementSeverity = (achievement) => {
    const percentage = parseInt(achievement);
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'info';
    return 'danger';
};

// ✅ Get monthly achievement severity
const getMonthlyAchievementSeverity = (achievement) => {
    const percentage = parseInt(achievement);
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'info';
    return 'danger';
};

// ✅ Get variance class
const getVarianceClass = (variance) => {
    if (variance > 0) return 'text-green-600 font-semibold';
    if (variance < 0) return 'text-red-600 font-semibold';
    return 'text-gray-600';
};

// ✅ View monthly details
const viewMonthlyDetails = (material) => {
    selectedMaterial.value = material;
    displayMonthlyDetails.value = true;
};

// ✅ Get monthly table data
const getMonthlyTableData = (months) => {
    if (!months) return [];

    return Object.entries(months).map(([month, data]) => {
        const forecast = data.forecast || 0;
        const order = data.order || 0;
        const backorder = data.backorder || 0;
        const achievement = forecast > 0 ? Math.round((order / forecast) * 100) + '%' : '0%';
        const variance = order - forecast;

        return {
            month,
            forecast,
            order,
            backorder,
            achievement,
            variance
        };
    });
};

// ✅ Helper functions for monthly totals
const getTotalMonths = (months) => {
    if (!months) return 0;
    return Object.keys(months).length;
};

const getTotalForecast = (months) => {
    if (!months) return 0;
    return Object.values(months).reduce((sum, data) => sum + (data.forecast || 0), 0);
};

const getTotalOrders = (months) => {
    if (!months) return 0;
    return Object.values(months).reduce((sum, data) => sum + (data.order || 0), 0);
};

const getTotalBackorders = (months) => {
    if (!months) return 0;
    return Object.values(months).reduce((sum, data) => sum + (data.backorder || 0), 0);
};

// ✅ Fetch sales forecast data
const fetchSalesForecastData = async () => {
    loading.value = true;
    try {
        const response = await api.get('sales-forecast-report/list');
        if (response.data.status === 1) {
            salesForecastData.value = response.data.admin_data;
            generateCustomerOptions();
        } else {
            console.error('Failed to fetch sales forecast data:', response.data.error);
            salesForecastData.value = [];
        }
    } catch (error) {
        console.error('Error fetching sales forecast data:', error);
        salesForecastData.value = [];
    } finally {
        loading.value = false;
    }
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.month = null;
    filters.year = new Date().getFullYear().toString();
};

// ✅ Generate Report (apply filters)
const generateReport = async () => {
    loading.value = true;
    try {
        // For now, we'll use the initial data and filter client-side
        // In a real scenario, you might want to call a filtered endpoint
        await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        loading.value = false;
    }
};

// ✅ Export to Excel
const exportExcel = async () => {
    exportLoading.value = true;
    try {
        // Prepare filters for export
        const exportFilters = {
            custAccountNo: filters.custAccountNo,
            month: filters.month
        };

        const response = await api.postExtra('report/excel-sales-forecast', exportFilters, {
            responseType: 'blob'
        });

        // Create blob and download
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Generate filename based on filters
        const custaccno = filters.custAccountNo || 'ALL';
        const month = filters.month ? monthOptions.find((m) => m.value === filters.month)?.label : 'ALL';
        const filename = `${custaccno}_${month}_Sales_Forecast_Report.xlsx`;

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting Excel:', error);
        alert('Failed to export Excel file. Please try again.');
    } finally {
        exportLoading.value = false;
    }
};

// ✅ Load initial data when component mounts
onMounted(() => {
    fetchSalesForecastData();
});
</script>

<style scoped>
:deep(.p-dropdown) {
    width: 100%;
}

:deep(.p-button) {
    min-width: 120px;
}

:deep(.p-datatable) {
    min-height: 400px;
}

.status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
}

:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

@media print {
    .no-print {
        display: none !important;
    }
}
</style>
