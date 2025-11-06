<template>
    <div class="card">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Sales Forecast vs Actual</h1>

            <div class="flex gap-4 items-center">
                <!-- Report Type -->
                <div class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-700">Report Type:</label>
                    <Dropdown v-model="filters.reportType" :options="reportTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Type" class="w-52" />
                </div>

                <!-- Customer Filter -->
                <div class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-700">Customer:</label>
                    <Dropdown v-model="filters.customer" :options="customerOptions" optionLabel="label" optionValue="value" placeholder="Select Customer" class="w-48" />
                </div>

                <!-- Month Filter (only for Forecast vs Actual) -->
                <div v-if="filters.reportType === 'forecast_vs_actual'" class="flex items-center gap-2">
                    <label class="text-sm font-semibold text-gray-700">Month:</label>
                    <Dropdown v-model="filters.month" :options="monthOptions" optionLabel="label" optionValue="value" placeholder="Select Month" class="w-40" />
                </div>

                <!-- Search Button -->
                <Button label="Search" icon="pi pi-search" class="p-button-sm p-button-primary" @click="fetchReportData" />

                <!-- Export Button -->
                <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-sm p-button-success" @click="exportExcel" />

                <!-- Reset Button -->
                <Button label="Reset" icon="pi pi-refresh" class="p-button-outlined p-button-secondary p-button-sm" @click="resetFilters" />
            </div>
        </div>

        <!-- Data Table -->
        <div class="mt-6">
            <DataTable
                v-if="tableData.length"
                :value="tableData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                dataKey="id"
                responsiveLayout="scroll"
            >
                <Column field="customer" header="Customer" style="min-width: 150px" />
                <Column field="month" header="Month" style="min-width: 100px" v-if="filters.reportType === 'forecast_vs_actual'" />
                <Column field="forecast" header="Forecast (RM)" style="min-width: 130px" />
                <Column field="actual" header="Actual (RM)" style="min-width: 130px" v-if="filters.reportType === 'forecast_vs_actual'" />
                <Column field="variance" header="Variance (%)" style="min-width: 120px" v-if="filters.reportType === 'forecast_vs_actual'" />
                <Column field="submittedBy" header="Submitted By" style="min-width: 150px" />
                <Column field="submittedDate" header="Submitted Date" style="min-width: 150px" />

                <template #empty>
                    <div class="text-center text-gray-500 py-4">No data available for selected filters.</div>
                </template>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Button } from 'primevue/button';
import { Dropdown } from 'primevue/dropdown';
import { DataTable } from 'primevue/datatable';
import { Column } from 'primevue/column';

const filters = ref({
    reportType: 'forecast_vs_actual',
    customer: null,
    month: null
});

const reportTypeOptions = ref([
    { label: 'Sales Forecast (by Customer)', value: 'forecast_by_customer' },
    { label: 'Sales Forecast vs Actual', value: 'forecast_vs_actual' }
]);

const customerOptions = ref([
    { label: 'Customer A', value: 'custA' },
    { label: 'Customer B', value: 'custB' },
    { label: 'Customer C', value: 'custC' }
]);

const monthOptions = ref([
    { label: 'January', value: 'Jan' },
    { label: 'February', value: 'Feb' },
    { label: 'March', value: 'Mar' },
    { label: 'April', value: 'Apr' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'Jun' },
    { label: 'July', value: 'Jul' },
    { label: 'August', value: 'Aug' },
    { label: 'September', value: 'Sep' },
    { label: 'October', value: 'Oct' },
    { label: 'November', value: 'Nov' },
    { label: 'December', value: 'Dec' }
]);

const tableData = ref([]);

// Fetch mock data (replace this with API later)
function fetchReportData() {
    if (!filters.value.customer) {
        tableData.value = [];
        return;
    }

    if (filters.value.reportType === 'forecast_by_customer') {
        tableData.value = [
            { id: 1, customer: 'Customer A', forecast: 120000, submittedBy: 'User1', submittedDate: '2025-10-01' },
            { id: 2, customer: 'Customer A', forecast: 130000, submittedBy: 'User2', submittedDate: '2025-11-01' }
        ];
    } else {
        tableData.value = [
            { id: 1, customer: 'Customer A', month: 'Jan', forecast: 100000, actual: 95000, variance: -5, submittedBy: 'User1', submittedDate: '2025-01-31' },
            { id: 2, customer: 'Customer A', month: 'Feb', forecast: 110000, actual: 115000, variance: +4.5, submittedBy: 'User1', submittedDate: '2025-02-28' }
        ];
    }
}

function exportExcel() {
    if (!tableData.value.length) return alert('No data to export.');
    alert('Excel exported (mock). Replace this with backend export API.');
}

function resetFilters() {
    filters.value = {
        reportType: 'forecast_vs_actual',
        customer: null,
        month: null
    };
    tableData.value = [];
}
</script>

<style scoped>
:deep(.p-dropdown) {
    min-width: 120px;
}
</style>
