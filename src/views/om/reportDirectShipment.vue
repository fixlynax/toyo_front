<template>
    <Fluid>
        <div class="flex flex-col">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Direct Shipment Summary</div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Customer Account -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <Dropdown v-model="filters.custAccountNo" :options="customerOptions" optionLabel="label" optionValue="value" placeholder="Select Customer Account" class="w-full" />
                        </div>

                        <!-- Quarter -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Quarter</label>
                            <Dropdown v-model="filters.period" :options="quarterOptions" optionLabel="label" optionValue="value" placeholder="Select Quarter" class="w-full" />
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Status</label>
                            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full" />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" :disabled="!filters.period" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/service/api';

// ✅ Filters
const filters = reactive({
    custAccountNo: null,
    period: null,
    status: null
});

// ✅ Loading states
const exportLoading = ref(false);

// ✅ Data
const customerOptions = ref([]);
const quarterOptions = ref([]);

// ✅ Corrected Status Options based on your API data (0=pending,66=processing,77=delivery,1=completed)
const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 0 },
    { label: 'Processing', value: 66 },
    { label: 'Delivery', value: 77 },
    { label: 'Completed', value: 1 }
];

// ✅ Generate customer options from shipment data
const generateCustomerOptions = async () => {
    try {
        const response = await api.get('order/list-ds-report');
        if (response.data.status === 1) {
            const shipmentData = response.data.admin_data;
            const customers = new Map();

            shipmentData.forEach((item) => {
                const custAccountNo = item.custaccountno;
                const dealerName = item.dealerName || 'Unknown Dealer';

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
        }
    } catch (error) {
        console.error('Error fetching customer options:', error);
        customerOptions.value = [{ label: 'All Customers', value: null }];
    }
};

// ✅ Generate quarter options based on current year
const generateQuarterOptions = () => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    quarterOptions.value = [
        { label: `Q1 ${currentYear}`, value: `Q1 ${currentYear}` },
        { label: `Q2 ${currentYear}`, value: `Q2 ${currentYear}` },
        { label: `Q3 ${currentYear}`, value: `Q3 ${currentYear}` },
        { label: `Q4 ${currentYear}`, value: `Q4 ${currentYear}` },
        { label: `Q1 ${previousYear}`, value: `Q1 ${previousYear}` },
        { label: `Q2 ${previousYear}`, value: `Q2 ${previousYear}` },
        { label: `Q3 ${previousYear}`, value: `Q3 ${previousYear}` },
        { label: `Q4 ${previousYear}`, value: `Q4 ${previousYear}` }
    ];
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.period = null;
    filters.status = null;
};

// ✅ Export to Excel
const exportExcel = async () => {
    if (!filters.period) {
        alert('Please select a quarter to export.');
        return;
    }

    exportLoading.value = true;
    try {
        // Prepare filters for export - match backend expected format
        const exportFilters = {
            custAccountNo: filters.custAccountNo,
            status: filters.status,
            period: filters.period
        };

        const response = await api.postExtra('report/excel-ds-order', exportFilters, {
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
        const period = filters.period.replace(' ', '_');
        const filename = `${custaccno}_${period}_OMS-Direct_Shipment_Summary.xlsx`;

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
    generateCustomerOptions();
    generateQuarterOptions();
});
</script>

<style scoped>
:deep(.p-dropdown) {
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
