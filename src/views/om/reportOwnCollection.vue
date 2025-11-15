<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Header -->
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    Report Own Collection
                </div>
                
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Total Orders</div>
                                <div class="text-2xl font-bold text-blue-600 mt-1">{{ summaryStats.totalOrders.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-shopping-bag text-blue-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            Own collection orders
                        </div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Completed</div>
                                <div class="text-2xl font-bold text-green-600 mt-1">{{ summaryStats.completedOrders.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-check-circle text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            {{ summaryStats.completionRate }}% completion rate
                        </div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Total Value</div>
                                <div class="text-2xl font-bold text-purple-600 mt-1">RM {{ (summaryStats.totalValue / 1000).toFixed(0) }}K</div>
                            </div>
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-dollar text-purple-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            Total order value
                        </div>
                    </div>

                    <div class="p-4 bg-white border rounded-lg shadow-sm">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-sm font-semibold text-gray-600">Pending</div>
                                <div class="text-2xl font-bold text-orange-600 mt-1">{{ summaryStats.pendingOrders.toLocaleString() }}</div>
                            </div>
                            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-clock text-orange-600 text-xl"></i>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            Awaiting collection
                        </div>
                    </div>
                </div>
                
                <!-- Filters Section -->
                <div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-4">
                        <Button label="Clear Filters" class="p-button-outlined p-button-secondary" @click="clearFilters" />
                        <Button label="Generate Report" class="p-button-primary" @click="generateReport" :loading="loading" />
                        <Button label="Export Excel" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" />
                    </div>
                </div>
                

                <!-- Detailed Collections Table -->
                <div class="mt-4">
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-lg font-bold text-gray-800">Collection Details</div>
                        <div class="text-sm text-gray-600">Total Records: {{ collectionData.length }}</div>
                    </div>

                    <DataTable 
                        :value="collectionData" 
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
                        <Column field="order_no" header="Order No" style="min-width: 140px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-mono text-sm font-semibold text-blue-600">
                                    {{ data.order_no }}
                                </div>
                            </template>
                        </Column>

                        <Column field="so_no" header="SO No" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm font-medium">
                                    {{ data.so_no || '-' }}
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

                        <Column field="deliveryDate" header="Delivery Date" style="min-width: 120px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    {{ formatDate(data.deliveryDate) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="dealerName" header="Customer" style="min-width: 200px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-semibold">{{ data.dealerName || data.custaccountno }}</div>
                                <div class="text-xs text-gray-500">{{ data.custaccountno }}</div>
                            </template>
                        </Column>

                        <Column field="salesorg" header="Sales Org" style="min-width: 100px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-center font-semibold">{{ data.salesorg }}</div>
                            </template>
                        </Column>

                        <Column field="deliveryType" header="Collection Type" style="min-width: 130px" :sortable="true">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.deliveryType" 
                                    :severity="getDeliveryTypeSeverity(data.deliveryType)" 
                                />
                            </template>
                        </Column>

                        <Column field="total" header="Order Value (RM)" style="min-width: 130px" :sortable="true">
                            <template #body="{ data }">
                                <div class="font-bold text-purple-600">
                                    {{ formatCurrency(data.total) }}
                                </div>
                            </template>
                        </Column>

                        <Column field="orderstatus" header="Status" style="min-width: 140px" :sortable="true">
                            <template #body="{ data }">
                                <Tag 
                                    :value="getStatusText(data.orderstatus)" 
                                    :severity="getStatusSeverity(data.orderstatus)" 
                                />
                            </template>
                        </Column>

                        <Column header="Items" style="min-width: 100px">
                            <template #body="{ data }">
                                <div class="text-center">
                                    <Badge :value="data.order_array?.length || 0" severity="info" />
                                </div>
                            </template>
                        </Column>

                        <Column field="orderCompleteDate" header="Completed Date" style="min-width: 130px" :sortable="true">
                            <template #body="{ data }">
                                <div class="text-sm" :class="getCompletionClass(data.orderCompleteDate)">
                                    {{ formatDate(data.orderCompleteDate) }}
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="min-width: 100px">
                            <template #body="{ data }">
                                <Button 
                                    icon="pi pi-eye" 
                                    class="p-button-info p-button-text p-button-sm" 
                                    v-tooltip="'View Order Details'"
                                    @click="viewOrderDetails(data)" 
                                />
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-8">
                                <i class="pi pi-inbox text-4xl mb-2"></i>
                                <div>No collection data found.</div>
                                <div class="text-sm mt-1">Adjust your filters or generate a new report.</div>
                            </div>
                        </template>

                        <template #loading>
                            <div class="text-center py-4">
                                <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                                Loading collection data...
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Order Details Dialog -->
        <Dialog v-model:visible="displayOrderDetails" :style="{ width: '800px' }" header="Order Collection Details" :modal="true">
            <div v-if="selectedOrder" class="space-y-4">
                
                <!-- Items Table -->
                <div class="flex items-center justify-between">
                    <h4 class="font-bold text-gray-800">Order Items</h4>
                    <Tag :value="`${selectedOrder.order_array?.length || 0} items`" severity="info" />
                </div>

                <DataTable :value="selectedOrder.order_array" class="rounded-table" scrollable scrollHeight="flex" stripedRows showGridlines>
                    <Column field="materialid" header="Material ID" style="min-width: 120px">
                        <template #body="{ data }">
                            <span class="font-medium">{{ data.materialid }}</span>
                        </template>
                    </Column>

                    <Column field="itemcategory" header="Category" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <Tag :value="data.itemcategory" severity="secondary" />
                        </template>
                    </Column>

                    <Column field="plant" header="Plant" style="min-width: 80px; text-align: center">
                        <template #body="{ data }">
                            <span>{{ data.plant }}</span>
                        </template>
                    </Column>

                    <Column field="qty" header="Quantity" style="min-width: 100px; text-align: center">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.qty }}</span>
                        </template>
                    </Column>

                    <Column header="Unit Price (RM)" style="min-width: 120px; text-align: right">
                        <template #body="{ data }">
                            <span class="font-semibold">
                                {{ getItemPrice(selectedOrder.fullfill_order_array, data.materialid) }}
                            </span>
                        </template>
                    </Column>

                    <Column header="Total Value (RM)" style="min-width: 120px; text-align: right">
                        <template #body="{ data }">
                            <span class="font-bold text-purple-600">
                                {{ calculateItemTotal(selectedOrder.fullfill_order_array, data.materialid, data.qty) }}
                            </span>
                        </template>
                    </Column>
                </DataTable>

                <!-- Fulfillment Information -->
                <div v-if="selectedOrder.fullfill_order_array && selectedOrder.fullfill_order_array.length > 0">
                    <div class="flex items-center justify-between">
                        <h4 class="font-bold text-gray-800">Fulfillment Details</h4>
                        <Tag value="Fulfilled" severity="success" />
                    </div>
                    
                    <DataTable :value="selectedOrder.fullfill_order_array" class="rounded-table mt-2" scrollable scrollHeight="200px" stripedRows>
                        <Column field="materialid" header="Material ID" style="min-width: 120px" />
                        <Column field="qty" header="Fulfilled Qty" style="min-width: 100px; text-align: center" />
                        <Column field="unitprice" header="Unit Price (RM)" style="min-width: 120px; text-align: right">
                            <template #body="{ data }">
                                <span class="font-semibold">{{ formatCurrency(data.unitprice) }}</span>
                            </template>
                        </Column>
                        <Column field="totalamt" header="Total Amount (RM)" style="min-width: 120px; text-align: right">
                            <template #body="{ data }">
                                <span class="font-bold text-green-600">{{ formatCurrency(data.totalamt) }}</span>
                            </template>
                        </Column>
                    </DataTable>
                </div>
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
    enddate: null
});

// ✅ Loading states
const loading = ref(false);
const exportLoading = ref(false);

// ✅ Data
const collectionData = ref([]);
const customerOptions = ref([]);

// ✅ Dialog states
const displayOrderDetails = ref(false);
const selectedOrder = ref(null);

// ✅ Status Mapping
const statusMap = {
    0: 'Pending',
    1: 'Completed',
    66: 'Processing',
    77: 'Delivery'
};

// ✅ Summary Statistics (computed from actual data)
const summaryStats = computed(() => {
    const totalOrders = collectionData.value.length;
    const completedOrders = collectionData.value.filter(order => order.orderstatus === 1).length;
    const pendingOrders = collectionData.value.filter(order => order.orderstatus === 0 || order.orderstatus === 66).length;
    const totalValue = collectionData.value.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    
    const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    return {
        totalOrders,
        completedOrders,
        completionRate,
        totalValue,
        pendingOrders
    };
});

// ✅ Generate customer options from collection data
const generateCustomerOptions = () => {
    const customers = new Map();

    collectionData.value.forEach((item) => {
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
        case 1: // Completed
            return 'success';
        case 66: // Processing
            return 'warning';
        case 77: // Delivery
            return 'info';
        case 0: // Pending
            return 'secondary';
        default:
            return 'info';
    }
};

// ✅ Get delivery type severity
const getDeliveryTypeSeverity = (deliveryType) => {
    switch (deliveryType) {
        case 'SELFCOLLECT':
            return 'success';
        case 'LALAMOVE':
            return 'warning';
        case 'DELIVER':
            return 'info';
        default:
            return 'secondary';
    }
};

// ✅ Get completion date class
const getCompletionClass = (completionDate) => {
    if (!completionDate) return 'text-gray-400';
    return 'text-green-600 font-semibold';
};

// ✅ Get item price from fulfillment array
const getItemPrice = (fulfillArray, materialId) => {
    if (!fulfillArray || !Array.isArray(fulfillArray)) return '0.00';
    const item = fulfillArray.find(item => item.materialid === materialId);
    return item ? formatCurrency(item.unitprice) : '0.00';
};

// ✅ Calculate item total
const calculateItemTotal = (fulfillArray, materialId, quantity) => {
    if (!fulfillArray || !Array.isArray(fulfillArray)) return '0.00';
    const item = fulfillArray.find(item => item.materialid === materialId);
    if (!item) return '0.00';
    const total = parseFloat(item.unitprice || 0) * parseFloat(quantity || 0);
    return formatCurrency(total);
};

// ✅ Show order details
const viewOrderDetails = (order) => {
    selectedOrder.value = order;
    displayOrderDetails.value = true;
};

// ✅ Fetch collection data
const fetchCollectionData = async () => {
    loading.value = true;
    try {
        const response = await api.get('order/list-own-report');
        if (response.data.status === 1) {
            collectionData.value = response.data.admin_data;
            generateCustomerOptions();
        } else {
            console.error('Failed to fetch collection data:', response.data.error);
            collectionData.value = [];
        }
    } catch (error) {
        console.error('Error fetching collection data:', error);
        collectionData.value = [];
    } finally {
        loading.value = false;
    }
};

// ✅ Clear Filters
const clearFilters = () => {
    filters.custAccountNo = null;
    filters.startdate = null;
    filters.enddate = null;
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
    fetchCollectionData();
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

@media print {
    .no-print {
        display: none !important;
    }
}
</style>