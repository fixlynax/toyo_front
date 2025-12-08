<template>
    <div class="card flex flex-col w-full">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">📦 List Back Order</div>
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

        <LoadingPage v-if="loading" :sub-message="'Fetching your Back Order list'" />

        <DataTable
            v-if="!loading"
            :value="filteredList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50, 100]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['custAccountNo', 'orderNo', 'customerName', 'deliveryDate', 'expiry', 'orderStatus']"
            responsiveLayout="scroll"
            removableSort
            sortField="created"
            :sortOrder="-1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            class="rounded-table"
        >
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Top Row: Search -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>
                    </div>

                    <!-- Filter Row: Customer Name Filter and Date Range -->
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

                        <!-- Date Range Filter (for Completed, Cancelled, Expired tabs) -->
                        <div v-if="showDateRangeFilter" class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading || !selectedCustomer" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading || !selectedCustomer" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" :disabled="isLoadingData" />
                        </div>

                        <!-- Status messages -->
                        <div v-if="!hasCustomerSelected" class="text-sm text-blue-600 italic">Select a customer to view back orders</div>
                        <div v-else-if="showDateRangeFilter && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <template v-if="!hasCustomerSelected">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-building text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a customer to view back orders</span>
                            <span class="text-sm text-gray-400">Choose a customer name from the dropdown above</span>
                        </div>
                    </template>
                    <template v-else-if="showDateRangeFilter && !hasDateFilterApplied">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-calendar text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a date range to view {{ currentTabLabel }} orders</span>
                            <span class="text-sm text-gray-400">Choose both start and end dates to filter results</span>
                        </div>
                    </template>
                    <template v-else-if="showDateRangeFilter && hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                            <span class="text-lg">Please select both start and end dates</span>
                        </div>
                    </template>
                    <template v-else-if="isLoadingData">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
                            <span class="text-lg">Loading back orders for {{ selectedCustomer?.name }}</span>
                            <span class="text-sm text-gray-400">Please wait...</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-file-excel text-3xl text-yellow-400"></i>
                            <span class="text-lg" v-if="selectedCustomer">No {{ currentTabLabel }} back orders found for {{ selectedCustomer.name }}</span>
                            <span class="text-lg" v-else>No back orders found</span>
                            <span class="text-sm text-gray-400">Try selecting a different customer or date range</span>
                            <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearCustomerFilter" />
                        </div>
                    </template>
                </div>
            </template>

            <Column field="createdDate" header="Created Date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.created) }}
                </template>
            </Column>

            <Column field="orderNo" header="Order No." style="min-width: 15rem" sortable>
                <template #body="{ data }">
                    <RouterLink :to="`/om/detailBackOrder/${data.orderNo}`" class="hover:underline font-bold text-primary-400">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="companyName" header="Customer Name" style="min-width: 10rem" sortable>
                <template #body="{ data }"
                    ><span class="font-bold">{{ data.customerName || '-' }}</span
                    ><br />{{ data.custAccountNo || '-' }}</template
                >
            </Column>
            <Column field="deliveryType" header="Delivery" style="min-width: 8rem" sortable />

            <Column field="orderDate" header="Order Date" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.orderDate) }}
                </template>
            </Column>

            <Column field="shipTo" header="Ship To Acc No." style="min-width: 8rem" sortable />

            <Column field="expiry" header="Back Order Expiry" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.expiry) }}
                </template>
            </Column>

            <Column field="orderStatus" header="Status" style="min-width: 8rem; text-align: left">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data)" :severity="getStatusSeverity(data)" />
                </template>
            </Column>

            <Column field="progress" header="Progress" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <ProgressBar :value="data.progress" class="w-full" :showValue="false" :class="getProgressBarClass(data.progress)" />
                        <span class="text-sm font-semibold">{{ data.progress }}%</span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';
import Dropdown from 'primevue/dropdown';

const listData = ref([]);
const filteredList = ref([]);
const loading = ref(true);
const loadingCustomers = ref(false);
const isLoadingData = ref(false);
const activeTabIndex = ref(0);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);
const selectedCustomer = ref(null);
const customerOptions = ref([]);
const debounceTimer = ref(null);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const statusTabs = [
    { label: 'Pending', status: 0, type: 'PENDING', requiresDateRange: false },
    { label: 'Completed', status: 1, type: 'COMPLETED', requiresDateRange: true },
    { label: 'Cancelled', status: 9, type: 'CANCELLED', requiresDateRange: true },
    { label: 'Expired', status: '', type: 'EXPIRED', requiresDateRange: true }
];

// Computed properties
const currentTab = computed(() => statusTabs[activeTabIndex.value]);
const currentTabLabel = computed(() => currentTab.value?.label || '');
const showDateRangeFilter = computed(() => currentTab.value?.requiresDateRange || false);
const hasCustomerSelected = computed(() => !!selectedCustomer.value);

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

const fetchBackOrders = async () => {
    try {
        const selectedTab = currentTab.value;
        if (!selectedTab) return;

        // Don't fetch if customer is not selected
        if (!hasCustomerSelected.value) {
            listData.value = [];
            filteredList.value = [];
            isLoadingData.value = false;
            return;
        }

        // For tabs requiring date range, don't fetch until date range is set
        if (selectedTab.requiresDateRange && !hasDateFilterApplied.value) {
            listData.value = [];
            filteredList.value = [];
            isLoadingData.value = false;
            return;
        }

        isLoadingData.value = true;

        const formData = new FormData();
        formData.append('type', selectedTab.type);
        formData.append('custaccountno', selectedCustomer.value.accountNo); // Add customer account number

        // Add date range if applied
        if (selectedTab.requiresDateRange && hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            const dateRangeString = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
            formData.append('date_range', dateRangeString);
        }

        const response = await api.post('order/list-back-order', formData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;

            listData.value = adminData.map((order) => ({
                id: order.id,
                orderNo: order.bo_orderno || '-',
                custAccountNo: order.custaccountno,
                customerName: order.dealerName,
                deliveryType: order.deliveryType || '-',
                orderDate: order.created,
                shipTo: order.shipto || order.custaccountno,
                expiry: order.expiry,
                created: order.created,
                orderStatus: order.orderstatus,
                progress: calculateProgress(order),
                status: order.status
            }));

            filterByTab();
        } else {
            listData.value = [];
            filteredList.value = [];
        }
    } catch (error) {
        listData.value = [];
        filteredList.value = [];
        console.error('Error fetching back orders:', error);
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
        filteredList.value = [];
        return;
    }

    // Load data after a short delay
    debounceTimer.value = setTimeout(() => {
        fetchBackOrders();
    }, 300);
});

onMounted(async () => {
    await fetchCustomers();

    // Don't fetch on initial mount if it requires date range or no customer selected
    if (currentTab.value?.requiresDateRange || !hasCustomerSelected.value) {
        loading.value = false;
        return;
    }

    await fetchBackOrders();
});

// Watch tab changes
watch(activeTabIndex, (newIndex, oldIndex) => {
    const selectedTab = statusTabs[newIndex];

    // Reset date range when changing tabs
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Clear data when switching to tabs requiring date range
    if (selectedTab?.requiresDateRange) {
        listData.value = [];
        filteredList.value = [];
        loading.value = false;
    } else if (selectedCustomer.value) {
        fetchBackOrders();
    } else {
        listData.value = [];
        filteredList.value = [];
    }
});

// Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch for tabs that require date range and customer is selected
        if (selectedTab?.requiresDateRange && selectedCustomer.value) {
            if (newRange[0] && newRange[1]) {
                hasDateFilterApplied.value = true;
                fetchBackOrders();
            } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
                // Clear data if date range is cleared
                listData.value = [];
                filteredList.value = [];
                hasDateFilterApplied.value = false;
            }
        }
    },
    { deep: true }
);

const filterByTab = () => {
    const selected = currentTab.value;
    if (!selected) {
        filteredList.value = listData.value;
        return;
    }

    // Expired tab logic
    if (selected.type === 'EXPIRED') {
        const now = new Date();

        filteredList.value = listData.value.filter((item) => {
            if (!item.expiry) return false;

            const isExpired = new Date(item.expiry) < now;
            const notCompleted = item.orderStatus != 1;
            const notCancelled = item.orderStatus != 9;

            return isExpired && notCompleted && notCancelled;
        });

        return;
    }

    // Normal tabs
    filteredList.value = listData.value.filter((item) => item.orderStatus == selected.status);
};

const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    if (selectedCustomer.value) {
        fetchBackOrders();
    } else {
        listData.value = [];
        filteredList.value = [];
    }
};

const clearCustomerFilter = () => {
    selectedCustomer.value = null;
    listData.value = [];
    filteredList.value = [];
    if (currentTab.value?.requiresDateRange) {
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;
    }
};

const calculateProgress = (order) => {
    try {
        if (order.fullfill_percentage !== null && order.fullfill_percentage !== undefined) {
            const progress = parseInt(order.fullfill_percentage);
            return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
        }

        if (order.backorder_array && order.remaining_array) {
            const backorderItems = Array.isArray(order.backorder_array) ? order.backorder_array : JSON.parse(order.backorder_array);
            const remainingItems = Array.isArray(order.remaining_array) ? order.remaining_array : JSON.parse(order.remaining_array);

            if (Array.isArray(backorderItems) && Array.isArray(remainingItems)) {
                const totalOrdered = backorderItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);
                const totalRemaining = remainingItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);

                if (totalOrdered > 0) {
                    const fulfilled = totalOrdered - totalRemaining;
                    const progress = Math.round((fulfilled / totalOrdered) * 100);
                    return Math.min(100, Math.max(0, progress));
                }
            }
        }

        return 0;
    } catch (error) {
        return 0;
    }
};

const getProgressBarClass = (progress) => {
    if (progress <= 40) return 'progress-low';
    if (progress <= 60) return 'progress-fair';
    if (progress < 100) return 'progress-good';
    return 'progress-excellent';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
};

const getStatusLabel = (data) => {
    // Check if order is expired (today >= Back Order Expiry) and not completed/cancelled
    if (data.expiry) {
        const now = new Date();
        const expiryDate = new Date(data.expiry);
        if (expiryDate < now && data.orderStatus !== 1 && data.orderStatus !== 9) {
            return 'Expired';
        }
    }

    switch (data.orderStatus) {
        case 0:
            return 'Pending';
        case 1:
            return 'Completed';
        default:
            return 'Cancelled';
    }
};

const getStatusSeverity = (data) => {
    // Check if order is expired (today >= Back Order Expiry) and not completed/cancelled
    if (data.expiry) {
        const now = new Date();
        const expiryDate = new Date(data.expiry);
        if (expiryDate < now && data.orderStatus !== 1 && data.orderStatus !== 9) {
            return 'secondary';
        }
    }

    switch (data.orderStatus) {
        case 0:
            return 'info';
        case 1:
            return 'success';
        default:
            return 'danger';
    }
};
</script>

<style scoped lang="scss">
:deep(.p-progressbar) {
    height: 0.8rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .p-progressbar-value {
        border-radius: 9999px;
        transition:
            width 0.4s ease,
            background 0.4s ease;
    }

    &.progress-low .p-progressbar-value {
        background: linear-gradient(90deg, #f87171);
        box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
    }

    &.progress-fair .p-progressbar-value {
        background: linear-gradient(90deg, #fb923c);
        box-shadow: 0 0 6px rgba(251, 146, 60, 0.3);
    }

    &.progress-good .p-progressbar-value {
        background: linear-gradient(90deg, #fde047);
        box-shadow: 0 0 6px rgba(250, 204, 21, 0.3);
    }

    &.progress-excellent .p-progressbar-value {
        background: linear-gradient(90deg, #34d399);
        box-shadow: 0 0 6px rgba(52, 211, 153, 0.4);
    }
}

:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
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

    .p-datatable-thead > tr > th:first-child {
        border-top-left-radius: 12px;
    }

    .p-datatable-thead > tr > th:last-child {
        border-top-right-radius: 12px;
    }

    .p-datatable-tbody > tr:last-child > td:first-child {
        border-bottom-left-radius: 0;
    }

    .p-datatable-tbody > tr:last-child > td:last-child {
        border-bottom-right-radius: 0;
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
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
