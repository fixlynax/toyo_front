<template>
    <Fluid>
        <div class="flex flex-col">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Direct Shipment Summary</div>

                <!-- Filters Section -->
                <div>
                    <!-- <div class="text-lg font-bold text-gray-800 mb-4">Report Filters</div> -->
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
                        <Button label="Generate Report" class="p-button-primary" @click="generateReport" :loading="loading" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" :disabled="!filters.period" />
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div class="card p-4 bg-white border rounded-lg">
                <div class="flex justify-between items-center mb-4">
                    <div class="text-lg font-bold text-gray-800">Shipment Data</div>
                    <div class="text-sm text-gray-600">Total Records: {{ filteredShipmentData.length }}</div>
                </div>
                <DataTable :value="filteredShipmentData" :paginator="true" :rows="20" responsiveLayout="scroll" :loading="loading" class="rounded-table">
                    <Column field="order_no" header="Order No" style="min-width: 140px" :sortable="true" />
                    <Column field="custaccountno" header="Customer Account" style="min-width: 140px" :sortable="true" />
                    <Column field="dealerName" header="Dealer Name" style="min-width: 200px" :sortable="true" />
                    <Column field="salesorg" header="Sales Org" style="min-width: 100px" :sortable="true" />
                    <Column field="shippingcond" header="Shipping Condition" style="min-width: 150px" :sortable="true" />
                    <Column field="orderstatus" header="Status" style="min-width: 120px" :sortable="true">
                        <template #body="slotProps">
                            <span :class="getStatusClass(slotProps.data.orderstatus)">
                                {{ getStatusText(slotProps.data.orderstatus) }}
                            </span>
                        </template>
                    </Column>
                    <Column field="total" header="Total Value (RM)" style="min-width: 130px" :sortable="true">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.total) }}
                        </template>
                    </Column>
                    <Column field="created" header="Order Date" style="min-width: 120px" :sortable="true">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.created) }}
                        </template>
                    </Column>
                    <Column field="deliveryDate" header="Delivery Date" style="min-width: 120px" :sortable="true">
                        <template #body="slotProps">
                            {{ formatDate(slotProps.data.deliveryDate) }}
                        </template>
                    </Column>
                    <Column header="Items" style="min-width: 100px">
                        <template #body="slotProps">
                            <Button icon="pi pi-list" class="p-button-text p-button-sm" @click="showOrderItems(slotProps.data)" v-tooltip.top="'View Order Items'" />
                        </template>
                    </Column>
                    <template #empty>
                        <div class="text-center text-gray-500 py-4">
                            {{ loading ? 'Loading data...' : 'No data available for selected filters.' }}
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Order Items Dialog -->
        <Dialog v-model:visible="displayOrderItems" :style="{ width: '650px' }" header="Order Items" :modal="true">
            <div v-if="selectedOrder" class="space-y-4">

                <!-- Table Title -->
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-gray-800">Order Items</h4>
                    <Tag :value="`${selectedOrder.order_array?.length || 0} items`" severity="info" />
                </div>

                <!-- Items Table -->
                <DataTable :value="selectedOrder.order_array" class="rounded-table" scrollable scrollHeight="flex" stripedRows showGridlines>
                    <Column field="materialid" header="Material ID" style="min-width: 120px">
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.materialid }}</span>
                        </template>
                    </Column>

                    <Column field="qty" header="Qty" style="min-width: 80px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.qty }}</span>
                        </template>
                    </Column>

                    <Column field="itemcategory" header="Category" style="min-width: 120px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.itemcategory }}</span>
                        </template>
                    </Column>

                    <Column field="plant" header="Plant" style="min-width: 80px; text-align: center">
                        <template #body="{ data }">
                            <span>{{ data.plant }}</span>
                        </template>
                    </Column>
                </DataTable>
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
    period: null,
    status: null
});

// ✅ Loading states
const loading = ref(false);
const exportLoading = ref(false);

// ✅ Data
const shipmentData = ref([]);
const customerOptions = ref([]);
const quarterOptions = ref([]);

// ✅ Dialog states
const displayOrderItems = ref(false);
const selectedOrder = ref(null);

// ✅ Corrected Status Options based on your API data (0=pending,66=processing,77=delivery,1=completed)
const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 0 },
    { label: 'Processing', value: 66 },
    { label: 'Delivery', value: 77 },
    { label: 'Completed', value: 1 }
];

// ✅ Corrected Status Mapping based on your API documentation
const statusMap = {
    0: 'Pending',
    66: 'Processing',
    77: 'Delivery',
    1: 'Completed'
};

// ✅ Generate customer options from shipment data
const generateCustomerOptions = () => {
    const customers = new Map();

    shipmentData.value.forEach((item) => {
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
};

// ✅ Generate quarter options based on available years in data
const generateQuarterOptions = () => {
    const years = new Set();

    // Extract years from created dates
    shipmentData.value.forEach((item) => {
        if (item.created) {
            const year = new Date(item.created).getFullYear();
            years.add(year);
        }
    });

    // Convert to array and sort descending
    const yearArray = Array.from(years).sort((a, b) => b - a);

    const quarters = [];
    yearArray.forEach((year) => {
        quarters.push({ label: `Q1 ${year}`, value: `Q1 ${year}` }, { label: `Q2 ${year}`, value: `Q2 ${year}` }, { label: `Q3 ${year}`, value: `Q3 ${year}` }, { label: `Q4 ${year}`, value: `Q4 ${year}` });
    });

    quarterOptions.value = quarters;
};

// ✅ Computed property for filtered data
const filteredShipmentData = computed(() => {
    let filtered = shipmentData.value;

    // Filter by customer account
    if (filters.custAccountNo) {
        filtered = filtered.filter((item) => item.custaccountno === filters.custAccountNo || item.shiptoCustAccNo === filters.custAccountNo);
    }

    // Filter by status (using numeric values from backend)
    if (filters.status !== null) {
        filtered = filtered.filter((item) => item.orderstatus === filters.status);
    }

    // Filter by period (quarter)
    if (filters.period) {
        const [quarter, year] = filters.period.split(' ');
        const quarterMonths = {
            Q1: [1, 2, 3],
            Q2: [4, 5, 6],
            Q3: [7, 8, 9],
            Q4: [10, 11, 12]
        };
        const months = quarterMonths[quarter] || [];

        filtered = filtered.filter((item) => {
            if (!item.created) return false;
            const orderDate = new Date(item.created);
            const orderMonth = orderDate.getMonth() + 1;
            const orderYear = orderDate.getFullYear();

            return months.includes(orderMonth) && orderYear === parseInt(year);
        });
    }

    return filtered;
});

// ✅ Format currency
const formatCurrency = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// ✅ Format date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY');
};

// ✅ Get status text
const getStatusText = (statusCode) => {
    return statusMap[statusCode] || `Status ${statusCode}`;
};

// ✅ Get status class for styling
const getStatusClass = (statusCode) => {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    switch (statusCode) {
        case 1: // Completed
            return `${baseClass} bg-green-100 text-green-800`;
        case 66: // Processing
            return `${baseClass} bg-blue-100 text-blue-800`;
        case 77: // Delivery
            return `${baseClass} bg-orange-100 text-orange-800`;
        case 0: // Pending
            return `${baseClass} bg-yellow-100 text-yellow-800`;
        default:
            return `${baseClass} bg-gray-100 text-gray-800`;
    }
};

// ✅ Show order items
const showOrderItems = (order) => {
    selectedOrder.value = order;
    displayOrderItems.value = true;
};

// ✅ Fetch initial data
const fetchInitialData = async () => {
    loading.value = true;
    try {
        const response = await api.get('order/list-ds-report');
        if (response.data.status === 1) {
            shipmentData.value = response.data.admin_data;

            // Generate dynamic options after data is loaded
            generateCustomerOptions();
            generateQuarterOptions();
        } else {
            console.error('Failed to fetch data:', response.data.error);
            shipmentData.value = [];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        shipmentData.value = [];
    } finally {
        loading.value = false;
    }
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.period = null;
    filters.status = null;
};

// ✅ Generate Report (apply filters)
const generateReport = async () => {
    loading.value = true;
    try {
        // For now, we'll use the initial data and filter client-side
        // The computed property filteredShipmentData will handle the filtering
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for UX
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        loading.value = false;
    }
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
    fetchInitialData();
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

:deep(.p-datatable-sm .p-datatable-thead > tr > th),
:deep(.p-datatable-sm .p-datatable-tbody > tr > td) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
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
</style>
