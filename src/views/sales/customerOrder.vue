<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Order</div>

        <div>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />
            <LoadingPage v-if="loading" :message="'Loading Orders...'" :sub-message="'Fetching your order list'" />

            <DataTable
                v-if="!loading"
                :value="filteredOrders"
                :paginator="true"
                :rows="10"
                dataKey="id"
                :rowHover="true"
                :filters="filters1"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                filterDisplay="menu"
                :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipToAccountNo', 'created', 'orderType', 'deliveryType', 'invoiceNo', 'doNo', 'soNo']"
                class="rounded-table"
                removableSort
                sortField="created"
                :sortOrder="-1"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex flex-col gap-4 w-full">
                        <!-- Top Row: Search and Create Button -->
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon><i class="pi pi-search" /></InputIcon>
                                    <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>
                            <div>
                                <RouterLink to="/om/createOrder">
                                    <Button label="Create" icon="pi pi-plus" class="p-button-primary" />
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Filter Row: Customer Name Filter -->
                        <div class="flex items-center gap-4 mb-1 flex-wrap">
                            <!-- Customer Name Filter -->
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Customer:</span>
                                <Dropdown
                                    v-model="selectedCustomer"
                                    :options="customerOptions"
                                    optionLabel="name"
                                    placeholder="Select Customer"
                                    class="w-100"
                                    :loading="loadingCustomers"
                                    :disabled="loadingCustomers || loading"
                                    :filter="true"
                                    filterPlaceholder="Search customers..."
                                >
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="flex items-center">
                                            <span>{{ slotProps.value.name }}</span>
                                            <span v-if="isLoadingData" class="ml-2">
                                                <i class="pi pi-spin pi-spinner text-sm text-primary-500"></i>
                                            </span>
                                        </div>
                                        <span v-else>
                                            {{ slotProps.placeholder }}
                                        </span>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex flex-col">
                                            <span class="font-medium">{{ slotProps.option.name }}</span>
                                            <span class="text-xs text-gray-500">{{ slotProps.option.accountNo }}</span>
                                        </div>
                                    </template>
                                </Dropdown>
                                <Button v-if="selectedCustomer" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearCustomerFilter" title="Clear customer filter" :disabled="isLoadingData" />
                            </div>

                            <!-- Date Range Filter (Only for Completed Orders) -->
                            <div v-if="activeTabIndex === 2" class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Date Range:</span>
                                <div class="flex items-center gap-2">
                                    <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                    <span class="text-gray-500">to</span>
                                    <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                </div>
                                <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                            </div>

                            <!-- Status message -->
                            <div v-if="!hasCustomerSelected && activeTabIndex !== 2" class="text-sm text-blue-600 italic">Select a customer to view orders</div>
                            <div v-else-if="activeTabIndex === 2 && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view completed orders</div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">
                        <template v-if="!hasCustomerSelected && activeTabIndex !== 2">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-building text-3xl text-blue-400"></i>
                                <span class="text-lg">Select a customer to view orders</span>
                                <span class="text-sm text-gray-400">Choose a customer name from the dropdown above</span>
                            </div>
                        </template>
                        <template v-else-if="activeTabIndex === 2 && !hasDateFilterApplied">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-calendar text-3xl text-blue-400"></i>
                                <span class="text-lg">Select a date range to view completed orders</span>
                                <span class="text-sm text-gray-400">Choose both start and end dates to filter results</span>
                            </div>
                        </template>
                        <template v-else-if="activeTabIndex === 2 && hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                                <span class="text-lg">Please select both start and end dates</span>
                            </div>
                        </template>
                        <template v-else-if="isLoadingData">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                                <span class="text-lg">Loading orders for {{ selectedCustomer?.name }}</span>
                                <span class="text-sm text-gray-400">Please wait...</span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-file-excel text-3xl text-yellow-400"></i>
                                <span class="text-lg" v-if="selectedCustomer">No orders found for {{ selectedCustomer.name }}</span>
                                <span class="text-lg" v-else>No orders found</span>
                                <span class="text-sm text-gray-400">Try selecting a different customer or date range</span>
                                <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearCustomerFilter" />
                            </div>
                        </template>
                    </div>
                </template>

                <!-- ... Rest of the columns remain the same ... -->
                <Column field="created" header="Created Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">{{ formatDate(data.created) }}</template>
                </Column>

                <Column header="Order No" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailOrder/${data.orderNo}`" class="hover:underline font-bold text-primary-400">
                            {{ data.orderNo || '-' }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="companyName" header="Customer Name" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold">{{ data.companyName || '-' }}</span
                        ><br />{{ data.custAccountNo || '-' }}
                    </template>
                </Column>

                <Column field="orderType" header="Order Type" style="min-width: 7rem" sortable>
                    <template #body="{ data }">
                        <span v-if="data.orderType === 'NORMAL'">Normal</span>
                        <span v-else-if="data.orderType === 'DS'">DS</span>
                        <span v-else-if="data.orderType === 'OWN-USE'">Own-use</span>
                        <span v-else>{{ data.orderType || data.sapOrderType || '-' }}</span>
                    </template>
                </Column>

                <Column field="deliveryType" header="Delivery" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        <span v-if="data.deliveryType === 'DELIVER'">Deliver</span>
                        <span v-else-if="data.deliveryType === 'PICKUP'">Pickup</span>
                        <span v-else-if="data.deliveryType === 'SELFCOLLECT'">Self Collect</span>
                        <span v-else-if="data.deliveryType === 'LALAMOVE'">Lalamove</span>
                        <span v-else>{{ data.deliveryType || '-' }}</span>
                    </template>
                </Column>

                <Column field="shipToAccountNo" header="Ship To Acc No" style="min-width: 7rem" sortable>
                    <template #body="{ data }">{{ data.shipToAccountNo || data.custAccountNo || '-' }}</template>
                </Column>

                <!-- Modified Delivery Info Column - Vertical Layout -->
                <Column header="Delivery Info" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <!-- ETA -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">ETA:</span>
                                <span class="font-medium">{{ formatDeliveryDate(data.deliveryDate) || '-' }}</span>
                            </div>

                            <!-- Planned -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Planned:</span>
                                <span class="font-medium">{{ data.scmDeliverInfo ? formatDeliveryDate(data.scmDeliverInfo.scheduled_delivery_time) : '-' }}</span>
                            </div>

                            <!-- Delivered -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Delivered:</span>
                                <span class="font-medium">
                                    <template v-if="data.scmDeliverInfo?.delivered_datetime">
                                        {{ formatDeliveryDate(data.scmDeliverInfo.delivered_datetime) }}
                                    </template>
                                    <template v-else-if="data.scmPickupInfo?.pickup_datetime">
                                        {{ formatDeliveryDate(data.scmPickupInfo.pickup_datetime) }}
                                    </template>
                                    <template v-else>-</template>
                                </span>
                            </div>

                            <!-- Show message if no delivery info data -->
                            <div v-if="!data.deliveryDate && !data.scmDeliverInfo && !data.scmPickupInfo" class="text-center text-gray-400 py-1">-</div>
                        </div>
                    </template>
                </Column>

                <Column header="SAP Ref" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <!-- SO -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">SO:</span>
                                <span class="font-medium">{{ data.soNo || '-' }}</span>
                            </div>

                            <!-- DO -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">DO:</span>
                                <span class="font-medium">{{ data.doNo || '-' }}</span>
                            </div>

                            <!-- Invoice (only show if exists) -->
                            <div v-if="data.invoiceNo" class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Inv No:</span>
                                <span class="font-medium">{{ data.invoiceNo }}</span>
                            </div>

                            <!-- Show message if no SAP ref data -->
                            <div v-if="!data.soNo && !data.doNo && !data.invoiceNo" class="text-center text-gray-400 py-1">-</div>
                        </div>
                    </template>
                </Column>

                <Column header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="statusMap[data.orderStatus]?.label || 'Unknown'" :severity="statusMap[data.orderStatus]?.severity || 'danger'" />
                    </template>
                </Column>

                <Column header="Total" style="min-width: 8rem">
                    <template #body="{ data }">
                        <span v-if="data.total">RM {{ parseFloat(data.total).toFixed(2) }}</span>
                        <span v-else>-</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';
import Dropdown from 'primevue/dropdown';

// 🟢 State
const filters1 = ref({});
const listData = ref([]);
const loading = ref(true);
const loadingCustomers = ref(false);
const isLoadingData = ref(false);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);
const selectedCustomer = ref(null);
const customerOptions = ref([]);
const debounceTimer = ref(null);

// 🟢 Tabs
const statusTabs = [
    { label: 'Processing', status: 66 },
    { label: 'Delivery', status: 77 },
    { label: 'Completed', status: 1 }
];
const activeTabIndex = ref(0);

// 🟢 Filters
function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Status Map
const statusMap = {
    66: { label: 'Processing', severity: 'warning' },
    77: { label: 'Delivery', severity: 'info' },
    1: { label: 'Completed', severity: 'success' }
};

// 🟢 Fetch Customers for Dropdown
const fetchCustomers = async () => {
    try {
        loadingCustomers.value = true;

        // Fetch customers from the list_dealer endpoint
        const response = await api.post('list_dealer');

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const customers = new Map();

            Object.keys(adminData).forEach((key) => {
                const customer = adminData[key];
                const shop = customer.shop;

                if (shop.companyName1 && shop.custAccountNo) {
                    customers.set(shop.custAccountNo, {
                        id: shop.id,
                        name: shop.companyName1,
                        accountNo: shop.custAccountNo,
                        city: shop.city,
                        state: shop.state
                    });
                }

                // Also add sub-branches if they have different names
                if (customer.subBranches) {
                    Object.keys(customer.subBranches).forEach((subKey) => {
                        const subBranch = customer.subBranches[subKey];
                        const subShop = subBranch.shop;

                        if (subShop.companyName1 && subShop.custAccountNo) {
                            customers.set(subShop.custAccountNo, {
                                id: subShop.id,
                                name: subShop.companyName1,
                                accountNo: subShop.custAccountNo,
                                city: subShop.city,
                                state: subShop.state
                            });
                        }
                    });
                }
            });

            // Convert Map to array and sort by name
            customerOptions.value = Array.from(customers.values()).sort((a, b) => a.name.localeCompare(b.name));
        }
    } catch (error) {
        console.error('Error fetching customer list for dropdown:', error);
    } finally {
        loadingCustomers.value = false;
    }
};

// 🟢 Fetch Orders
const fetchOrders = async (status = null, dateFilter = false) => {
    try {
        isLoadingData.value = true;
        const statusMapping = { 66: 'PROCESSING', 77: 'DELIVERY', 1: 'COMPLETE' };
        const tabs = statusMapping[status] || 'PROCESSING';

        // Prepare request data
        const requestData = { tabs };

        // Add customer account number if selected
        if (selectedCustomer.value) {
            requestData.custaccountno = selectedCustomer.value.accountNo;
        }

        // Add date range only for completed orders and when date filter is applied
        if (status === 1 && dateFilter) {
            if (dateRange.value[0] && dateRange.value[1]) {
                // Format dates for backend (assuming backend expects d/m/Y format)
                const formatDateForBackend = (date) => {
                    const d = new Date(date);
                    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                };

                requestData.date_range = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
            }
        }

        const response = await api.post('order/list-order', requestData);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((order) => ({
                id: order.id,
                orderNo: order.order_no,
                custAccountNo: order.custaccountno,
                companyName: order.dealerName,
                sapOrderType: order.sapordertype,
                orderType: order.orderDesc,
                deliveryType: order.deliveryType,
                shipToAccountNo: order.shiptoCustAccNo,
                deliveryDate: order.deliveryDate,
                soNo: order.so_no,
                doNo: order.do_no,
                invoiceNo: order.inv_no,
                created: order.created,
                orderStatus: order.orderstatus,
                subtotal: order.subtotal,
                total: order.total,
                orderArray: order.order_array,
                // Delivery information
                scmDeliverInfo: order.scm_deliver_information,
                scmPickupInfo: order.scm_pickup_information
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching order list:', error);
        listData.value = [];
    } finally {
        isLoadingData.value = false;
        loading.value = false;
    }
};

// 🟢 Watch for customer selection changes with debounce
watch(selectedCustomer, (newValue, oldValue) => {
    // Clear any existing timer
    if (debounceTimer.value) {
        clearTimeout(debounceTimer.value);
    }

    // If customer is cleared, clear data immediately
    if (!newValue) {
        listData.value = [];
        return;
    }

    // Load data after a short delay
    debounceTimer.value = setTimeout(() => {
        const selectedStatus = statusTabs[activeTabIndex.value]?.status;
        fetchOrders(selectedStatus, activeTabIndex.value === 2);
    }, 300);
});

// 🟢 Watch tab change
watch(activeTabIndex, (newIndex) => {
    const selectedStatus = statusTabs[newIndex]?.status;

    // For completed tab, reset date range
    if (selectedStatus === 1) {
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;
        listData.value = []; // Clear data when switching to completed tab
    }

    // Fetch data if customer is selected
    if (selectedCustomer.value) {
        fetchOrders(selectedStatus, selectedStatus === 1);
    } else {
        listData.value = [];
    }
});

// 🟢 Watch date range changes for completed tab
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedStatus = statusTabs[activeTabIndex.value]?.status;

        // Only trigger fetch for completed tab when both dates are set and customer is selected
        if (selectedStatus === 1 && selectedCustomer.value) {
            if (newRange[0] && newRange[1]) {
                hasDateFilterApplied.value = true;
                fetchOrders(selectedStatus, true);
            } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
                // Clear data if date range is cleared
                listData.value = [];
                hasDateFilterApplied.value = false;
            }
        }
    },
    { deep: true }
);

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters1();
    await fetchCustomers();
    loading.value = false;
});

// 🟢 Computed Properties
const hasCustomerSelected = computed(() => {
    return !!selectedCustomer.value;
});

const filteredOrders = computed(() => {
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;

    // For non-completed tabs, require customer selection
    if (selectedStatus !== 1 && !hasCustomerSelected.value) {
        return [];
    }

    // For completed tab, require customer selection and date filter
    if (selectedStatus === 1 && (!hasCustomerSelected.value || !hasDateFilterApplied.value)) {
        return [];
    }

    return listData.value.filter((order) => order.orderStatus === selectedStatus);
});

// 🟢 Format Date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
        return dateString;
    }
};

// 🟢 Format DateTime for delivery information (date only)
const formatDeliveryDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

// 🟢 Clear Customer Filter
const clearCustomerFilter = () => {
    selectedCustomer.value = null;
    listData.value = [];
    if (activeTabIndex.value === 2) {
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;
    }
};

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    if (selectedCustomer.value) {
        fetchOrders(statusTabs[activeTabIndex.value]?.status, false);
    } else {
        listData.value = [];
    }
};
</script>

<style scoped lang="scss">
:deep(.p-tabmenu .p-tabmenuitem.p-highlight .p-menuitem-link) {
    border-color: #3b82f6;
}
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
}
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

/* Style for dropdown customer options */
:deep(.p-dropdown) {
    min-width: 250px;

    .p-dropdown-label {
        padding: 0.5rem;
    }
}

:deep(.p-dropdown-panel) {
    .p-dropdown-items {
        .p-dropdown-item {
            padding: 0.75rem 1rem;

            &.p-highlight {
                background-color: var(--p-primary-100);
                color: var(--p-primary-700);
            }
        }
    }
}

/* Custom styling for the delivery info and SAP ref tables */
:deep(.p-datatable-tbody) {
    .delivery-info-cell,
    .sap-ref-cell {
        padding: 0.25rem !important;

        .delivery-header,
        .sap-ref-header {
            background-color: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
        }

        .delivery-data,
        .sap-ref-data {
            font-size: 0.75rem;
            line-height: 1.25;
        }
    }
}

/* Custom styling for SAP Ref vertical layout */
:deep(.p-datatable-tbody > tr > td) {
    .sap-ref-vertical {
        padding: 0.25rem 0;
    }
}

/* Loading spinner in dropdown value */
:deep(.p-dropdown .p-dropdown-label .pi-spinner) {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
