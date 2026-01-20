<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Report Sales Forecast</div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end">
                        <div class="flex gap-4 mt-4">
                            <div style="width: 250px">
                                <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                            </div>
                            <Button label="Export" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" />
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
    month: null
});

// ✅ Loading states
const exportLoading = ref(false);
const loadingCustomers = ref(false);

// ✅ Data
const customerOptions = ref([]);

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

                    const companyName = companyNameParts.join(' ').trim() || 'Unknown Customer';

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

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.month = null;
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

        // Check if response is blob
        if (!response.data || !(response.data instanceof Blob)) {
            throw new Error('Invalid response from server');
        }

        // Create blob and download
        const blob = response.data;
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
        
        // Clean up
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
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