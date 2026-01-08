<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Order Report</div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <!-- Customer Account (Dropdown) -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <Dropdown v-model="filters.custAccountNo" :options="customerOptions" optionLabel="label" optionValue="value" placeholder="Select Customer Account" class="w-full" filter showClear />
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
                    <div class="flex justify-end">
                        <div class="flex gap-4 mt-4">
                            <div style="width: 250px">
                                <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                            </div>
                            <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/service/api';
import InputText from 'primevue/inputtext';

// ✅ Filters
const filters = reactive({
    custAccountNo: null,
    orderType: null,
    startdate: null,
    enddate: null,
    status: null
});

// ✅ Loading states
const exportLoading = ref(false);
const loadingCustomers = ref(false);

// ✅ Data
const customerOptions = ref([]);

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

// ✅ Generate customer options from list_dealer API with ORDER tab (SHOP ONLY - NO SUB BRANCHES)
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

            // Add "All Customers" option at the beginning
            customers.set('all', {
                label: 'All Customers',
                value: null
            });

            // Process only MAIN SHOPS (no sub-branches)
            Object.keys(dealerData).forEach((custAccountNo) => {
                const dealer = dealerData[custAccountNo];
                const shop = dealer.shop;

                // Only include shops that are main branches (eten_userID should be 0 for main branches)
                if (shop && custAccountNo && shop.eten_userID === 0) {
                    // Build company name from companyName1-4 fields
                    const companyNameParts = [shop.companyName1, shop.companyName2, shop.companyName3, shop.companyName4].filter(Boolean);

                    const companyName = companyNameParts.join(' ').trim() || 'Unknown Customer';

                    if (!customers.has(custAccountNo)) {
                        customers.set(custAccountNo, {
                            label: `${companyName} (${custAccountNo})`,
                            value: custAccountNo
                        });
                    }
                }
            });

            // Convert to array and sort by label (keeping "All Customers" first)
            const customerArray = Array.from(customers.values());
            customerArray.sort((a, b) => {
                if (a.value === null) return -1; // Keep "All Customers" first
                if (b.value === null) return 1;
                return a.label.localeCompare(b.label);
            });

            customerOptions.value = customerArray;
        }
    } catch (error) {
        console.error('Error fetching customer options:', error);
        // Fallback options if API fails
        customerOptions.value = [
            { label: 'All Customers', value: null },
            { label: 'Error loading customers', value: 'error', disabled: true }
        ];
    } finally {
        loadingCustomers.value = false;
    }
};

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
            custAccountNo: filters.custAccountNo,
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
        const custaccno = filters.custAccountNo || 'ALL';
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

// ✅ Load initial data when component mounts
onMounted(() => {
    generateCustomerOptions();
});
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
