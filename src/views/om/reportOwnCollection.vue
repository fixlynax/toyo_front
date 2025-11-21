<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Report Own Collection
                </div>
                
                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Customer Account -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Customer Account</label>
                            <Dropdown 
                                v-model="filters.custAccountNo" 
                                :options="customerOptions" 
                                optionLabel="label" 
                                optionValue="value" 
                                placeholder="Select Customer Account" 
                                class="w-full" 
                            />
                        </div>

                        <!-- Start Date -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Start Date</label>
                            <Calendar 
                                v-model="filters.startdate" 
                                dateFormat="yy-mm-dd" 
                                placeholder="Select Start Date" 
                                class="w-full" 
                            />
                        </div>

                        <!-- End Date -->
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">End Date</label>
                            <Calendar 
                                v-model="filters.enddate" 
                                dateFormat="yy-mm-dd" 
                                placeholder="Select End Date" 
                                class="w-full" 
                            />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button 
                            label="Clear Filters" 
                            class="p-button-outlined p-button-secondary" 
                            @click="clearFilters" 
                        />
                        <Button 
                            label="Export Excel" 
                            icon="pi pi-file-excel" 
                            class="p-button-success" 
                            @click="exportExcel" 
                            :loading="exportLoading" 
                        />
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
    startdate: null,
    enddate: null
});

// ✅ Loading states
const exportLoading = ref(false);

// ✅ Data
const customerOptions = ref([]);

// ✅ Generate customer options from collection data
const generateCustomerOptions = async () => {
    try {
        const response = await api.get('order/list-own-report');
        if (response.data.status === 1) {
            const collectionData = response.data.admin_data;
            const customers = new Map();

            collectionData.forEach((item) => {
                const custAccountNo = item.custaccountno;
                const dealerName = item.dealerName || 'Unknown Customer';

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

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.startdate = null;
    filters.enddate = null;
};

// ✅ Export to Excel
const exportExcel = async () => {
    exportLoading.value = true;
    try {
        // Prepare filters for export
        const exportFilters = {
            custAccountNo: filters.custAccountNo,
            startdate: filters.startdate,
            enddate: filters.enddate
        };

        const response = await api.postExtra('report/excel-own-order', exportFilters, {
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
        const filename = `${custaccno}_OMS-Own_Collection_Report.xlsx`;

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