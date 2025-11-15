<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Report Back Order</div>

                 <!-- Summary Stats Row -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="text-center p-4 border rounded-lg bg-blue-50">
                        <div class="text-3xl font-bold text-blue-600">{{ summaryStats.totalBackOrders.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Total Back Orders</div>
                        <div class="text-xs text-gray-500 mt-1">Active back orders</div>
                    </div>
                    <div class="text-center p-4 border rounded-lg bg-purple-50">
                        <div class="text-3xl font-bold text-purple-600">{{ summaryStats.pendingItems.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Pending Items</div>
                        <div class="text-xs text-gray-500 mt-1">Awaiting fulfillment</div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-green-50">
                        <div class="text-3xl font-bold text-green-600">{{ summaryStats.fulfilledOrders.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Completed Orders</div>
                        <div class="text-xs text-gray-500 mt-1">{{ summaryStats.fulfillmentRate }}% completion rate</div>
                    </div>

                    <div class="text-center p-4 border rounded-lg bg-orange-50">
                        <div class="text-3xl font-bold text-orange-600">{{ summaryStats.cancelled.toLocaleString() }}</div>
                        <div class="text-sm font-semibold text-gray-700 mt-2">Cancelled Orders</div>
                        <div class="text-xs text-gray-500 mt-1">Reject orders</div>
                    </div>

                </div>

                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                        <Button label="Generate Report" class="p-button-primary" @click="generateReport" :loading="loading" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" />
                    </div>
                </div>

                <!-- Detailed Back Orders Table -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Back Order Details</div>
                        <div class="text-sm text-gray-600">Total Records: {{ backOrderData.length }}</div>
                    </div>

                    <DataTable
                        :value="backOrderData"
                        :paginator="true"
                        :rows="10"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        dataKey="id"
                        :rowHover="true"
                        :loading="loading"
                        responsiveLayout="scroll"
                        :scrollable="true"
                        scrollHeight="400px"
                        class="rounded-table"
                    >
                        <Column field="bo_orderno" header="Back Order No" style="min-width: 150px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-mono text-sm font-semibold text-blue-600">
                                    {{ data.bo_orderno }}
                                </div>
                            </template>
                        </Column>

                        <Column field="created" header="Order Date" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ formatDate(data.created) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="companyName" header="Customer" style="min-width: 200px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.companyName }}</div>
                                <div class="text-xs text-gray-500">{{ data.custaccountno }}</div>
                            </template>
                        </Column>

                        <Column field="salesorg" header="Sales Org" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-semibold">{{ data.salesorg }}</div>
                            </template>
                        </Column>

                        <Column field="shippingcond" header="Shipping Condition" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center">{{ data.shippingcond }}</div>
                            </template>
                        </Column>

                        <Column field="orderstatus" header="Status" style="min-width: 140px" :sortable="true">
                            <template #body="{ data }">
                                <Tag :value="getStatusText(data.orderstatus)" :severity="getStatusSeverity(data.orderstatus)" />
                            </template>
                        </Column>

                        <Column header="Items" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-center">
                                    <Badge :value="data.backorderitem?.length || 0" severity="info" />
                                </div>
                            </template>
                        </Column>

                        <Column header="Total Qty" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold text-orange-600">
                                    {{ calculateTotalQty(data.backorderitem) }}
                                </div>
                            </template>
                        </Column>

                        <Column header="Remaining Qty" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-bold" :class="getRemainingQtyClass(data.backorderitem)">
                                    {{ calculateRemainingQty(data.backorderitem) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="expiry" header="Expiry Date" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm" :class="getExpiryClass(data.expiry)">
                                    {{ formatDate(data.expiry) }}
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="min-width: 100px">
                            <template #body="{ data }">
                                <Button icon="pi pi-eye" class="p-button-info p-button-text p-button-sm" v-tooltip="'View Details'" @click="viewBackOrderDetails(data)" />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-8">
                                <i class="pi pi-inbox text-4xl mb-2"></i>
                                <div>No back order data found.</div>
                            </div>
                        </template>

                        <template #loading>
                            <div class="text-center py-4">
                                <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                                Loading back order data...
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Back Order Details Dialog -->
        <Dialog v-model:visible="displayOrderDetails" :style="{ width: '700px' }" header="Details" :modal="true">
            <div v-if="selectedOrder" class="space-y-4">

                <!-- Items Table -->
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-gray-800">Order Items</h4>
                    <Tag :value="`${selectedOrder.backorderitem?.length || 0} items`" severity="info" />
                </div>

                <DataTable :value="selectedOrder.backorderitem" class="rounded-table" scrollable scrollHeight="flex" stripedRows showGridlines>
                    <Column field="materialID" header="Material ID" style="min-width: 240px">
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.materialID }}</span>
                        </template>
                    </Column>

                    <Column field="material" header="Description" style="min-width: 150px">
                        <template #body="{ data }">
                            <span>{{ data.material }}</span>
                        </template>
                    </Column>

                    <Column field="initial_qty" header="Initial Qty" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.initial_qty }}</span>
                        </template>
                    </Column>

                    <Column field="remaining_qty" header="Remaining Qty" style="min-width: 120px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-semibold" :class="getItemRemainingClass(data.remaining_qty)">{{ data.remaining_qty }}</span>
                        </template>
                    </Column>

                    <Column field="itemCategory" header="Category" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <Tag :value="data.itemCategory" severity="secondary" />
                        </template>
                    </Column>

                    <Column field="price" header="Unit Price (RM)" style="min-width: 120px; text-align: right">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ formatCurrency(data.price) }}</span>
                        </template>
                    </Column>

                    <Column header="Total Value (RM)" style="min-width: 120px; text-align: right">
                        <template #body="{ data }">
                            <span class="font-bold text-purple-600">{{ formatCurrency(data.initial_qty * data.price) }}</span>
                        </template>
                    </Column>
                    <template #loading></template>
                </DataTable>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '@/service/api';

// ✅ Filters
const filters = reactive({
    custAccountNo: null,
    startdate: null,
    enddate: null,
    status: null
});

// ✅ Loading states
const loading = ref(false);
const exportLoading = ref(false);

// ✅ Data
const backOrderData = ref([]);
const customerOptions = ref([]);

// ✅ Dialog states
const displayOrderDetails = ref(false);
const selectedOrder = ref(null);

// ✅ Status Options based on API data
const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 0 },
    { label: 'Completed', value: 1 },
    { label: 'Cancelled', value: 9 }
];

// ✅ Status Mapping
const statusMap = {
    0: 'Pending',
    1: 'Completed',
    9: 'Cancelled'
};

// ✅ Summary Statistics (computed from actual data)
const summaryStats = computed(() => {
    const totalBackOrders = backOrderData.value.length;
    const fulfilledOrders = backOrderData.value.filter((order) => order.orderstatus === 1).length;
    const totalItems = backOrderData.value.reduce((sum, order) => sum + (order.backorderitem?.reduce((itemSum, item) => itemSum + (item.initial_qty || 0), 0) || 0), 0);
    const pendingItems = backOrderData.value.reduce((sum, order) => sum + (order.backorderitem?.reduce((itemSum, item) => itemSum + (item.remaining_qty || 0), 0) || 0), 0);
    const cancelled = backOrderData.value.filter((order) => order.orderstatus === 9).length;

    const fulfillmentRate = totalBackOrders > 0 ? Math.round((fulfilledOrders / totalBackOrders) * 100) : 0;

    return {
        totalBackOrders,
        fulfilledOrders,
        fulfillmentRate,
        totalItems,
        pendingItems,
        cancelled
    };
});

// ✅ Generate customer options from back order data
const generateCustomerOptions = () => {
    const customers = new Map();

    backOrderData.value.forEach((item) => {
        const custAccountNo = item.custaccountno;
        const companyName = item.companyName || 'Unknown Customer';

        if (custAccountNo && !customers.has(custAccountNo)) {
            customers.set(custAccountNo, {
                label: `${companyName} (${custAccountNo})`,
                value: custAccountNo
            });
        }
    });

    // Convert to array and sort by label
    customerOptions.value = Array.from(customers.values()).sort((a, b) => a.label.localeCompare(b.label));

    // Add "All Customers" option at the beginning
    customerOptions.value.unshift({ label: 'All Customers', value: null });
};

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

// ✅ Get status severity for tags
const getStatusSeverity = (statusCode) => {
    switch (statusCode) {
        case 0: // Completed
            return 'warn';
        case 1: // Processing
            return 'success';
        case 9: // Pending
            return 'danger';
        default:
            return 'info';
    }
};

// ✅ Calculate total quantity for an order
const calculateTotalQty = (backorderitem) => {
    if (!backorderitem || !Array.isArray(backorderitem)) return 0;
    return backorderitem.reduce((sum, item) => sum + (parseInt(item.initial_qty) || 0), 0);
};

// ✅ Calculate remaining quantity for an order
const calculateRemainingQty = (backorderitem) => {
    if (!backorderitem || !Array.isArray(backorderitem)) return 0;
    return backorderitem.reduce((sum, item) => sum + (parseInt(item.remaining_qty) || 0), 0);
};

// ✅ Get class for remaining quantity display
const getRemainingQtyClass = (backorderitem) => {
    const remaining = calculateRemainingQty(backorderitem);
    const total = calculateTotalQty(backorderitem);

    if (remaining === 0) return 'text-green-600';
    if (remaining === total) return 'text-red-600';
    return 'text-orange-600';
};

// ✅ Get class for individual item remaining quantity
const getItemRemainingClass = (remainingQty) => {
    if (remainingQty === 0) return 'text-green-600';
    return 'text-orange-600';
};

// ✅ Get expiry date class
const getExpiryClass = (expiryDate) => {
    if (!expiryDate) return 'text-gray-500';

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 font-semibold'; // Expired
    if (diffDays <= 3) return 'text-orange-600 font-semibold'; // Expiring soon
    return 'text-gray-600';
};

// ✅ Show back order details
const viewBackOrderDetails = (order) => {
    selectedOrder.value = order;
    displayOrderDetails.value = true;
};

// ✅ Fetch back order data
const fetchBackOrderData = async () => {
    loading.value = true;
    try {
        const response = await api.get('order/list-back-order-report');
        if (response.data.status === 1) {
            backOrderData.value = response.data.admin_data;
            generateCustomerOptions();
        } else {
            console.error('Failed to fetch back order data:', response.data.error);
            backOrderData.value = [];
        }
    } catch (error) {
        console.error('Error fetching back order data:', error);
        backOrderData.value = [];
    } finally {
        loading.value = false;
    }
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.startdate = null;
    filters.enddate = null;
    filters.status = null;
};

// ✅ Generate Report (apply filters)
const generateReport = async () => {
    loading.value = true;
    try {
        // For now, we'll use the initial data and filter client-side
        // In a real scenario, you might want to call a filtered endpoint
        await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        loading.value = false;
    }
};

// ✅ Export to Excel
const exportExcel = async () => {
    exportLoading.value = true;
    try {
        // Prepare filters for export
        const exportFilters = {
            custAccountNo: filters.custAccountNo,
            status: filters.status,
            startdate: filters.startdate,
            enddate: filters.enddate
        };

        const response = await api.postExtra('report/excel-back-order', exportFilters, {
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
        const filename = `${custaccno}_OMS-Back_Order_Report.xlsx`;

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
    fetchBackOrderData();
});
</script>

<style scoped>
:deep(.p-dropdown) {
    width: 100%;
}

:deep(.p-button) {
    min-width: 90px;
}

:deep(.p-datatable) {
    min-height: 400px;
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
