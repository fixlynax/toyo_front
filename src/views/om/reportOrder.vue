<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Order Report</div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <!-- Customer Account (Input Text) -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <InputText v-model="filters.custAccountNo" placeholder="Enter Account Number" class="w-full" />
                        </div>

                        <!-- Order Type -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Order Type</label>
                            <Dropdown v-model="filters.orderType" :options="orderTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Order Type" class="w-full" />
                        </div>

                        <!-- Start Date -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Start Date</label>
                            <Calendar v-model="filters.startdate" dateFormat="yy-mm-dd" placeholder="Select Start Date" class="w-full" />
                        </div>

                        <!-- End Date -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">End Date</label>
                            <Calendar v-model="filters.enddate" dateFormat="yy-mm-dd" placeholder="Select End Date" class="w-full" />
                        </div>

                        <!-- Status (Single Select Dropdown) -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Status</label>
                            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full" />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive } from 'vue';
import api from '@/service/api';
import InputText from 'primevue/inputtext';

// ✅ Filters
const filters = reactive({
    custAccountNo: null,
    orderType: null,
    startdate: null,
    enddate: null,
    status: null // Single value for status
});

// ✅ Loading states
const exportLoading = ref(false);

// ✅ Order Type Options
const orderTypeOptions = [
    { label: 'All Order Types', value: null },
    { label: 'NORMAL', value: 'NORMAL' },
    { label: 'DIRECTSHIP', value: 'DIRECTSHIP' },
    { label: 'OWN', value: 'OWN' }
];

// ✅ Status Options - Single select dropdown
const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 0 },
    { label: 'Processing', value: 66 },
    { label: 'Delivery', value: 77 },
    { label: 'Completed', value: 1 }
];

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.orderType = null;
    filters.startdate = null;
    filters.enddate = null;
    filters.status = null;
};

// ✅ Export to Excel
const exportExcel = async () => {
    exportLoading.value = true;
    try {
        // Prepare filters for export
        const exportFilters = {
            custAccountNo: filters.custAccountNo?.trim() || null,
            orderType: filters.orderType,
            status: filters.status,
            startdate: filters.startdate,
            enddate: filters.enddate
        };

        const response = await api.postExtra('report/excel-order', exportFilters, {
            responseType: 'blob'
        });

        // Create blob and download
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Generate filename based on filters
        const custaccno = filters.custAccountNo?.trim() || 'ALL';
        const orderType = filters.orderType || 'ALL';
        const status = filters.status !== null ? getStatusLabel(filters.status) : 'ALL_STATUS';

        const filename = `${custaccno}_${orderType}_${status}_OMS-Order_Report.xlsx`;

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

// ✅ Helper function to get status label for filename
const getStatusLabel = (statusValue) => {
    const statusOption = statusOptions.find((option) => option.value === statusValue);
    return statusOption ? statusOption.label.toUpperCase().replace(/\s+/g, '_') : 'UNKNOWN';
};
</script>

<style scoped>
:deep(.p-dropdown),
:deep(.p-inputtext) {
    width: 100%;
}

:deep(.p-button) {
    min-width: 120px;
}

@media print {
    .no-print {
        display: none !important;
    }
}
</style>
