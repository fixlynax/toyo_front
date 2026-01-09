<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Report Back Order</div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <!-- Customer Account -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <Dropdown v-model="filters.custAccountNo" :options="customerOptions" optionLabel="label" optionValue="value" placeholder="Select Customer Account" class="w-full" />
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

                        <!-- Status -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Status</label>
                            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full" />
                        </div>

                        <!-- Material -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Material</label>
                            <Dropdown v-model="filters.material" :options="materialOptions" optionLabel="label" optionValue="value" placeholder="Select Material" class="w-full" />
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
    startdate: null,
    enddate: null,
    status: null,
    material: null
});

// ✅ Loading states
const exportLoading = ref(false);
const loadingCustomers = ref(false);

// ✅ Data
const customerOptions = ref([]);
const materialOptions = ref([]);

// ✅ Status Options based on API data
const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 0 },
    { label: 'Completed', value: 1 },
    { label: 'Cancelled', value: 9 }
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

// ✅ Generate material options from back order data
const generateMaterialOptions = async () => {
    try {
        const response = await api.get('order/list-back-order-report');
        if (response.data.status === 1) {
            const backOrderData = response.data.admin_data;
            const materials = new Map();

            backOrderData.forEach((item) => {
                if (item.backorderitem && Array.isArray(item.backorderitem)) {
                    item.backorderitem.forEach((backorderItem) => {
                        const materialID = backorderItem.materialID;
                        const materialName = backorderItem.material || 'Unknown Material';

                        if (materialID && !materials.has(materialID)) {
                            materials.set(materialID, {
                                label: `${materialName} (${materialID})`,
                                value: materialID
                            });
                        }
                    });
                }
            });

            // Convert to array and sort by label
            materialOptions.value = Array.from(materials.values()).sort((a, b) => a.label.localeCompare(b.label));

            // Add "All Materials" option at the beginning
            materialOptions.value.unshift({ label: 'All Materials', value: null });
        }
    } catch (error) {
        console.error('Error fetching material options:', error);
        materialOptions.value = [{ label: 'All Materials', value: null }];
    }
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.startdate = null;
    filters.enddate = null;
    filters.status = null;
    filters.material = null;
};

// ✅ Export to Excel
const exportExcel = async () => {
    exportLoading.value = true;
    try {
        // Prepare filters for export - ensure dates are in correct format (yy-mm-dd)
        const exportFilters = {
            custAccountNo: filters.custAccountNo,
            status: filters.status,
            startdate: filters.startdate ? formatDateForAPI(filters.startdate) : null,
            enddate: filters.enddate ? formatDateForAPI(filters.enddate) : null,
            material: filters.material
        };

        console.log('Export filters:', exportFilters); // Debug log

        const response = await api.postExtra('report/excel-back-order', exportFilters, {
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
        const material = filters.material || 'ALL';
        const filename = `${custaccno}_${material}_OMS-Back_Order_Report.xlsx`;

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

// ✅ Helper function to format date for API (yy-mm-dd)
const formatDateForAPI = (date) => {
    if (!date) return null;

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

// ✅ Load initial data when component mounts
onMounted(() => {
    generateCustomerOptions();
    generateMaterialOptions();
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
