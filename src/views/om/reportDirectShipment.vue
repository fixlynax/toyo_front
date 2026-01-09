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
                    <div class="flex justify-end">
                        <div class="flex gap-4 mt-4">
                            <div style="width: 250px">
                                <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                            </div>
                            <Button label="Export" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" :disabled="!filters.period" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import api from '@/service/api';
import { onMounted, reactive, ref } from 'vue';

// ✅ Filters
const filters = reactive({
    custAccountNo: null,
    period: null,
    status: null
});

// ✅ Loading states
const exportLoading = ref(false);
const loadingCustomers = ref(false);

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

// ✅ Generate customer options from list_dealer API with ORDER tab (SHOP ONLY)
const generateCustomerOptions = async () => {
    loadingCustomers.value = true;
    try {
        // Use list_dealer API with tabs: ORDER parameter
        const response = await api.post('list_dealer', {
            tabs: 'ORDER'
        });

        if (response.data.status === 1) {
            const dealerData = response.data.admin_data;
            const customers = new Map();

            // Process only MAIN SHOPS (no sub-branches)
            Object.keys(dealerData).forEach((custAccountNo) => {
                const dealer = dealerData[custAccountNo];
                const shop = dealer.shop;

                // Only include shops that are main branches (eten_userID should be 0 for main branches)
                if (shop && custAccountNo && shop.eten_userID === 0) {
                    // Build company name from companyName1-4 fields
                    const companyNameParts = [shop.companyName1, shop.companyName2, shop.companyName3, shop.companyName4].filter(Boolean);

                    const companyName = companyNameParts.join(' ').trim() || 'Unknown Dealer';

                    if (!customers.has(custAccountNo)) {
                        customers.set(custAccountNo, {
                            label: `${companyName} (${custAccountNo})`,
                            value: custAccountNo
                        });
                    }
                }
            });

            // Convert to array and sort by label
            const customerArray = Array.from(customers.values()).sort((a, b) => a.label.localeCompare(b.label));

            // Add "All Customers" option at the beginning
            customerArray.unshift({ label: 'All Customers', value: null });

            customerOptions.value = customerArray;
        }
    } catch (error) {
        console.error('Error fetching customer options:', error);
        customerOptions.value = [{ label: 'All Customers', value: null }];
    } finally {
        loadingCustomers.value = false;
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
        alert('Failed to export file. Please try again.');
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
