<template>
    <div class="card">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Sales Forecast Report</h1>

            <div class="flex gap-4 items-center">
                <!-- Report Type -->
                <div class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-700">Report Type:</label>
                    <Dropdown 
                        v-model="filters.reportType" 
                        :options="reportTypeOptions" 
                        optionLabel="label" 
                        optionValue="value" 
                        placeholder="Select Type" 
                        class="w-52" 
                    />
                </div>

                <!-- Customer Filter -->
                <div class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-700">Customer:</label>
                    <Dropdown 
                        v-model="filters.customer" 
                        :options="customerOptions" 
                        optionLabel="label" 
                        optionValue="value" 
                        placeholder="Select Customer" 
                        class="w-48" 
                        :loading="loadingCustomers"
                    />
                </div>

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
                    />
                </div>

                <!-- Search Button -->
                <Button 
                    label="Search" 
                    icon="pi pi-search" 
                    class="p-button-sm p-button-primary" 
                    @click="fetchReportData" 
                    :loading="loading"
                />

                <!-- Export Button -->
                <Button 
                    label="Export Excel" 
                    icon="pi pi-file-excel" 
                    class="p-button-sm p-button-success" 
                    @click="exportExcel" 
                    :disabled="!tableData.length"
                />

                <!-- Reset Button -->
                <Button 
                    label="Reset" 
                    icon="pi pi-refresh" 
                    class="p-button-outlined p-button-secondary p-button-sm" 
                    @click="resetFilters" 
                />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
            <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <!-- Data Table -->
        <div v-else class="mt-6">
            <!-- Forecast vs Actual Table -->
            <DataTable
                v-if="filters.reportType === 'forecast_vs_actual' && tableData.length"
                :value="tableData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                dataKey="id"
                responsiveLayout="scroll"
                class="p-datatable-sm"
            >
                <Column field="salesOffice" header="Sales Office" style="min-width: 120px" />
                <Column field="soldToParty" header="Sold-to Party" style="min-width: 120px" />
                <Column field="dealer" header="Dealer" style="min-width: 200px" />
                <Column field="material" header="Material" style="min-width: 100px" />
                <Column field="description" header="Description" style="min-width: 150px" />
                <Column field="pattern" header="Pattern" style="min-width: 100px" />
                <Column field="rim" header="Rim" style="min-width: 80px" />
                <Column field="totalForecast" header="Total Forecast" style="min-width: 120px">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data.totalForecast) }}
                    </template>
                </Column>
                <Column field="totalOrder" header="Total Order" style="min-width: 120px">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data.totalOrder) }}
                    </template>
                </Column>
                <Column field="totalBackOrder" header="Total BackOrder" style="min-width: 120px">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data.totalBackOrder) }}
                    </template>
                </Column>
                <Column field="percentage" header="%" style="min-width: 80px">
                    <template #body="slotProps">
                        <span :class="getPercentageClass(slotProps.data.percentage)">
                            {{ slotProps.data.percentage }}
                        </span>
                    </template>
                </Column>

                <template #empty>
                    <div class="text-center text-gray-500 py-4">No data available for selected filters.</div>
                </template>
            </DataTable>

            <!-- Submitted Forecast Table -->
            <DataTable
                v-else-if="filters.reportType === 'submitted_forecast' && tableData.length"
                :value="tableData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                dataKey="id"
                responsiveLayout="scroll"
                class="p-datatable-sm"
            >
                <Column field="salesOffice" header="Sales Office" style="min-width: 120px" />
                <Column field="accountNumber" header="Account Number" style="min-width: 120px" />
                <Column field="name" header="Name" style="min-width: 200px" />
                <Column field="material" header="Material" style="min-width: 100px" />
                <Column field="description" header="Description" style="min-width: 150px" />
                <Column v-for="month in months" :key="month" :field="month" :header="month" style="min-width: 80px">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data[month]) }}
                    </template>
                </Column>
                <Column field="year" header="Year" style="min-width: 80px" />

                <template #empty>
                    <div class="text-center text-gray-500 py-4">No data available for selected filters.</div>
                </template>
            </DataTable>

            <!-- Empty State -->
            <div v-else-if="!tableData.length && !loading" class="text-center text-gray-500 py-8">
                <i class="pi pi-inbox text-4xl mb-2"></i>
                <p>No data available. Please select filters and click Search.</p>
            </div>
        </div>

        <!-- Summary Cards -->
        <div v-if="tableData.length && filters.reportType === 'forecast_vs_actual'" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div class="card bg-blue-50 border-blue-200">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm font-medium text-blue-800">Total Forecast</p>
                        <p class="text-2xl font-bold text-blue-900">{{ formatNumber(summary.totalForecast) }}</p>
                    </div>
                    <i class="pi pi-chart-line text-blue-500 text-xl"></i>
                </div>
            </div>
            <div class="card bg-green-50 border-green-200">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm font-medium text-green-800">Total Orders</p>
                        <p class="text-2xl font-bold text-green-900">{{ formatNumber(summary.totalOrder) }}</p>
                    </div>
                    <i class="pi pi-shopping-cart text-green-500 text-xl"></i>
                </div>
            </div>
            <div class="card bg-orange-50 border-orange-200">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm font-medium text-orange-800">Total Backorders</p>
                        <p class="text-2xl font-bold text-orange-900">{{ formatNumber(summary.totalBackOrder) }}</p>
                    </div>
                    <i class="pi pi-exclamation-triangle text-orange-500 text-xl"></i>
                </div>
            </div>
            <div class="card bg-purple-50 border-purple-200">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-sm font-medium text-purple-800">Average %</p>
                        <p class="text-2xl font-bold text-purple-900">{{ summary.averagePercentage }}</p>
                    </div>
                    <i class="pi pi-percentage text-purple-500 text-xl"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Button } from 'primevue/button';
import { Dropdown } from 'primevue/dropdown';
import { DataTable } from 'primevue/datatable';
import { Column } from 'primevue/column';
import { ProgressSpinner } from 'primevue/progressspinner';
import { Toast } from 'primevue/toast';
import api from '@/service/api'; // Adjust the path as necessary

const toast = ref();
const loading = ref(false);
const loadingCustomers = ref(false);

const filters = ref({
    reportType: 'forecast_vs_actual',
    customer: null,
    year: new Date().getFullYear().toString()
});

const reportTypeOptions = ref([
    { label: 'Sales Forecast vs Actual', value: 'forecast_vs_actual' },
    { label: 'Submitted Sales Forecast', value: 'submitted_forecast' }
]);

const customerOptions = ref([]);
const yearOptions = ref([]);
const tableData = ref([]);
const summary = ref({
    totalForecast: 0,
    totalOrder: 0,
    totalBackOrder: 0,
    averagePercentage: '0%'
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate year options (current year and previous 2 years)
function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    yearOptions.value = [
        { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
        { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
        { label: currentYear.toString(), value: currentYear.toString() }
    ];
}

// Fetch customers from backend
async function fetchCustomers() {
    loadingCustomers.value = true;
    try {
        // This would be replaced with actual API call to get customers
        // For now, using mock data that matches your API structure
        const response = await axios.get('/api/customers'); // Replace with actual endpoint
        customerOptions.value = response.data.map(customer => ({
            label: customer.companyName1,
            value: customer.custAccountNo
        }));
    } catch (error) {
        console.error('Error fetching customers:', error);
        // Fallback to mock data
        customerOptions.value = [
            { label: 'Customer A', value: 'CUST001' },
            { label: 'Customer B', value: 'CUST002' },
            { label: 'Customer C', value: 'CUST003' }
        ];
    } finally {
        loadingCustomers.value = false;
    }
}

// Fetch report data based on selected filters
async function fetchReportData() {
    loading.value = true;
    tableData.value = [];

    try {
        if (filters.value.reportType === 'forecast_vs_actual') {
            await fetchForecastVsActual();
        } else {
            await fetchSubmittedForecast();
        }
    } catch (error) {
        console.error('Error fetching report data:', error);
        toast.value.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch report data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

// Fetch Forecast vs Actual data
async function fetchForecastVsActual() {
    try {
        const response = await api.get('sales-forecast-report/list');
        
        if (response.data.status === 1) {
            const data = response.data.admin_data;
            
            // Filter by customer if selected
            let filteredData = data;
            if (filters.value.customer) {
                filteredData = data.filter(item => 
                    item['Sold-to Party'] === filters.value.customer
                );
            }

            // Transform data for table
            tableData.value = filteredData.map((item, index) => ({
                id: index + 1,
                salesOffice: item['Sales Office'],
                soldToParty: item['Sold-to Party'],
                dealer: item['Dealer'],
                material: item['Material'],
                description: item['Description'],
                pattern: item['Pattern'],
                rim: item['Rim'],
                totalForecast: item['Total Forecast'],
                totalOrder: item['Total Order'],
                totalBackOrder: item['Total BackOrder'],
                percentage: item['%']
            }));

            calculateSummary();
        } else {
            throw new Error(response.data.error || 'Failed to fetch data');
        }
    } catch (error) {
        throw error;
    }
}

// Fetch Submitted Forecast data
async function fetchSubmittedForecast() {
    try {
        const params = {};
        if (filters.value.customer) {
            params.custAccountNo = filters.value.customer;
        }
        if (filters.value.year) {
            params.year = filters.value.year;
        }

        const response = await api.getDownload('submitted-sales-forecast-report/list', { params });
        
        // Since this endpoint returns an Excel file, we need to handle it differently
        // For now, we'll show a message and trigger download
        if (response.status === 200) {
            // Create a blob from the response data and trigger download
            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            const custaccno = filters.value.customer || '';
            const year = filters.value.year || '';
            const parts = [custaccno, year, 'OMS-Sales_Forecast'].filter(Boolean);
            link.download = `${parts.join('_')}.xlsx`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.value.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Excel file downloaded successfully',
                life: 3000
            });
        }
    } catch (error) {
        throw error;
    }
}

// Calculate summary for forecast vs actual
function calculateSummary() {
    if (tableData.value.length === 0) {
        summary.value = {
            totalForecast: 0,
            totalOrder: 0,
            totalBackOrder: 0,
            averagePercentage: '0%'
        };
        return;
    }

    const totals = tableData.value.reduce((acc, item) => ({
        forecast: acc.forecast + (item.totalForecast || 0),
        order: acc.order + (item.totalOrder || 0),
        backorder: acc.backorder + (item.totalBackOrder || 0)
    }), { forecast: 0, order: 0, backorder: 0 });

    const averagePercentage = totals.forecast > 0 
        ? Math.round((totals.order / totals.forecast) * 100) + '%'
        : '0%';

    summary.value = {
        totalForecast: totals.forecast,
        totalOrder: totals.order,
        totalBackOrder: totals.backorder,
        averagePercentage
    };
}

// Export to Excel
function exportExcel() {
    if (!tableData.value.length) {
        toast.value.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'No data to export',
            life: 3000
        });
        return;
    }

    // For forecast vs actual, we'll create a simple CSV export
    if (filters.value.reportType === 'forecast_vs_actual') {
        exportToCSV();
    } else {
        // For submitted forecast, the API already handles Excel export
        fetchSubmittedForecast();
    }
}

// Simple CSV export for forecast vs actual
function exportToCSV() {
    const headers = [
        'Sales Office', 'Sold-to Party', 'Dealer', 'Material', 'Description',
        'Pattern', 'Rim', 'Total Forecast', 'Total Order', 'Total BackOrder', '%'
    ];

    const csvContent = [
        headers.join(','),
        ...tableData.value.map(row => [
            `"${row.salesOffice || ''}"`,
            `"${row.soldToParty || ''}"`,
            `"${row.dealer || ''}"`,
            `"${row.material || ''}"`,
            `"${row.description || ''}"`,
            `"${row.pattern || ''}"`,
            `"${row.rim || ''}"`,
            row.totalForecast || 0,
            row.totalOrder || 0,
            row.totalBackOrder || 0,
            `"${row.percentage || '0%'}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_forecast_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.value.add({
        severity: 'success',
        summary: 'Success',
        detail: 'CSV file downloaded successfully',
        life: 3000
    });
}

// Reset filters
function resetFilters() {
    filters.value = {
        reportType: 'forecast_vs_actual',
        customer: null,
        year: new Date().getFullYear().toString()
    };
    tableData.value = [];
    summary.value = {
        totalForecast: 0,
        totalOrder: 0,
        totalBackOrder: 0,
        averagePercentage: '0%'
    };
}

// Format numbers with commas
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// Get CSS class for percentage based on value
function getPercentageClass(percentage) {
    const num = parseInt(percentage);
    if (num >= 100) return 'text-green-600 font-semibold';
    if (num >= 80) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
}

// Initialize on component mount
onMounted(() => {
    generateYearOptions();
    fetchCustomers();
});
</script>

<style scoped>
:deep(.p-dropdown) {
    min-width: 120px;
}

.card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
}

:deep(.p-datatable-sm .p-datatable-thead > tr > th) {
    @apply py-2 px-3 text-xs font-semibold;
}

:deep(.p-datatable-sm .p-datatable-tbody > tr > td) {
    @apply py-2 px-3 text-sm;
}
</style>