<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';

const listData = ref([]);
const filteredList = ref([]);
const loading = ref(true);
const activeTabIndex = ref(0);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);
const dealers = ref([]); // List of dealers (main accounts only)
const selectedDealer = ref(null); // Selected main dealer
const isDealerSelected = ref(false); // Flag to track if dealer is selected

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const statusTabs = [
    { label: 'Pending', status: 0, type: 'PENDING', requiresDateRange: false, initialLoad: true },
    { label: 'Completed', status: 1, type: 'COMPLETED', requiresDateRange: true, initialLoad: false },
    { label: 'Cancelled', status: 9, type: 'CANCELLED', requiresDateRange: true, initialLoad: false },
    { label: 'Expired', status: '', type: 'EXPIRED', requiresDateRange: true, initialLoad: false }
];

// 🧩 Fetch Dealers (Main accounts only)
const fetchDealers = async () => {
    try {
        const response = await api.post('list_dealer', {
            mainBranch: 0 // Get all dealers including sub-branches
        });

        if (response.data.status === 1 && response.data.admin_data) {
            const dealerData = response.data.admin_data;
            const mainDealerList = [];

            // Process dealer data - only include main dealers (accounts ending with "00")
            Object.entries(dealerData).forEach(([custAccountNo, data]) => {
                const mainShop = data.shop;

                // Only add main dealers (ending with "00")
                if (mainShop.custAccountNo && mainShop.custAccountNo.toString().endsWith('00')) {
                    mainDealerList.push({
                        custAccountNo: mainShop.custAccountNo,
                        companyName: trimCompanyName(mainShop.companyName1, mainShop.companyName2),
                        isMain: true,
                        hasSubBranches: Object.keys(data.subBranches || {}).length > 0
                    });
                }
            });

            // Sort alphabetically by company name
            dealers.value = mainDealerList.sort((a, b) => a.companyName.localeCompare(b.companyName));
        } else {
            dealers.value = [];
        }
    } catch (error) {
        console.error('Error fetching dealers:', error);
        dealers.value = [];
    }
};

// Helper function to trim company name
const trimCompanyName = (name1, name2) => {
    const fullName = `${name1 || ''} ${name2 || ''}`.trim();
    return fullName || 'Unknown';
};

// Computed properties
const currentTab = computed(() => statusTabs[activeTabIndex.value]);
const currentTabLabel = computed(() => currentTab.value?.label || '');
const showDateRangeFilter = computed(() => currentTab.value?.requiresDateRange || false);

// 🟢 Fetch back orders with account number pattern
const fetchBackOrders = async (mainAccountNo = null) => {
    try {
        const selectedTab = currentTab.value;
        if (!selectedTab) return;

        // For tabs requiring date range and initialLoad is false, don't fetch until date range is set
        if (selectedTab.requiresDateRange && !selectedTab.initialLoad && !hasDateFilterApplied.value) {
            listData.value = [];
            filteredList.value = [];
            loading.value = false;
            return;
        }

        const formData = new FormData();
        formData.append('type', selectedTab.type);

        // Add date range if applied
        if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            const dateRangeString = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
            formData.append('date_range', dateRangeString);
        }

        // Add dealer filter if selected
        if (mainAccountNo) {
            formData.append('custaccountno', mainAccountNo);
        }

        loading.value = true;
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
        loading.value = false;
    }
};

// 🟢 Handle dealer selection (only main accounts in dropdown)
const handleDealerChange = () => {
    const selectedTab = currentTab.value;

    if (selectedDealer.value) {
        isDealerSelected.value = true;

        // Reset date range when changing dealer
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;

        // Get selected dealer data
        const selectedDealerData = dealers.value.find((d) => d.custAccountNo === selectedDealer.value);

        if (selectedDealerData) {
            // Pass the main account number to fetchBackOrders
            // The API should handle filtering for main account + sub-accounts
            fetchBackOrders(selectedDealer.value);
        }
    } else {
        isDealerSelected.value = false;
        listData.value = [];
        filteredList.value = [];
        loading.value = false;
    }
};

onMounted(async () => {
    await fetchDealers(); // Load dealers first

    const firstTab = currentTab.value;

    // Don't fetch if first tab requires date range and doesn't have initial load
    if (firstTab?.requiresDateRange && !firstTab?.initialLoad) {
        loading.value = false;
        listData.value = [];
        filteredList.value = [];
        return;
    }

    // Don't fetch until customer is selected
    loading.value = false;
});

// Watch tab changes
watch(activeTabIndex, (newIndex, oldIndex) => {
    const selectedTab = statusTabs[newIndex];

    // Reset date range when changing tabs
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Clear data when switching to tabs that require date range and don't have initial load
    if (selectedTab?.requiresDateRange && !selectedTab?.initialLoad) {
        listData.value = [];
        filteredList.value = [];
        loading.value = false;
    } else if (selectedDealer.value && isDealerSelected.value) {
        // If dealer is selected, fetch for that dealer
        fetchBackOrders(selectedDealer.value);
    }
});

// Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch when both dates are set AND dealer is selected
        if (newRange[0] && newRange[1] && isDealerSelected.value && selectedDealer.value) {
            hasDateFilterApplied.value = true;
            fetchBackOrders(selectedDealer.value);
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            // Clear data if date range is cleared
            hasDateFilterApplied.value = false;

            // For tabs with initial load, reload dealer data
            if (selectedTab?.initialLoad && isDealerSelected.value && selectedDealer.value) {
                fetchBackOrders(selectedDealer.value);
            } else {
                // For tabs without initial load, clear data
                listData.value = [];
                filteredList.value = [];
            }
        }
    },
    { deep: true }
);

// 🟢 Watch dealer selection
watch(selectedDealer, () => {
    handleDealerChange();
});

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

    // Clear data for tabs that don't have initial load
    if (!currentTab.value?.initialLoad) {
        listData.value = [];
        filteredList.value = [];
    } else if (isDealerSelected.value && selectedDealer.value) {
        // Reload data for tabs that have initial load and dealer is selected
        fetchBackOrders(selectedDealer.value);
    }
};

// 🟢 Clear Dealer Filter
const clearDealerFilter = () => {
    selectedDealer.value = null;
    isDealerSelected.value = false;
    listData.value = [];
    filteredList.value = [];
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    loading.value = false;
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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
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

<template>
    <div class="card flex flex-col w-full">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">📦 List Back Order</div>
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

        <!-- Header with Search and Filters (Always shown) -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div class="flex flex-col gap-4 w-full">
                <!-- Search Row -->
                <div class="flex items-center gap-4 w-full">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon><i class="pi pi-search" /></InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" :disabled="!isDealerSelected" />
                        </IconField>
                    </div>
                </div>

                <!-- Filter Row: Customer and Date Range in one line -->
                <div class="flex items-center gap-6 flex-wrap">
                    <!-- Customer Dropdown (Main accounts only) -->
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Customer:</span>
                        <div class="relative">
                            <Dropdown v-model="selectedDealer" :options="dealers" optionLabel="companyName" optionValue="custAccountNo" placeholder="Select Customer" class="w-100" :filter="true" :disabled="loading">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <span class="text-blue-600 font-bold">🏢</span>
                                        <span>{{ slotProps.option.companyName }}</span>
                                        <span class="text-xs text-gray-400 ml-auto">{{ slotProps.option.custAccountNo }}</span>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                        <span class="text-blue-600 font-bold">🏢</span>
                                        <span>{{ dealers.find((d) => d.custAccountNo === slotProps.value)?.companyName }}</span>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                            </Dropdown>
                            <Button v-if="selectedDealer" icon="pi pi-times" class="p-button-text p-button-sm absolute right-8 top-1/2 transform -translate-y-1/2" @click="clearDealerFilter" title="Clear customer filter" />
                        </div>
                    </div>

                    <!-- Date Range Filter -->
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</span>
                        <div class="flex items-center gap-2">
                            <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading || !isDealerSelected" />
                            <span class="text-gray-500">to</span>
                            <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading || !isDealerSelected" />
                        </div>
                        <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" :disabled="!isDealerSelected" />
                    </div>

                    <!-- Show message only for Completed/Cancelled/Expired tabs without date filter -->
                    <div v-if="isDealerSelected && showDateRangeFilter && !currentTab?.initialLoad && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                </div>
            </div>
        </div>

        <LoadingPage v-if="loading" :sub-message="'Fetching your Back Order list'" />

        <!-- DataTable (Only shown when customer is selected) -->
        <DataTable
            v-if="!loading && isDealerSelected"
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
            <template #empty>
                <div class="text-center py-4 text-gray-500">
                    <template v-if="!isDealerSelected || !selectedDealer">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-users text-3xl text-blue-400"></i>
                            <span class="text-lg">Please select a customer first</span>
                            <span class="text-sm text-gray-400">Choose a customer from the dropdown above to view their back orders</span>
                        </div>
                    </template>
                    <template v-else-if="showDateRangeFilter && !currentTab?.initialLoad && !hasDateFilterApplied">
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
                    <template v-else-if="selectedDealer"> No back orders found for the selected customer. </template>
                    <template v-else> No back orders found. </template>
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

        <!-- Initial state when no customer is selected -->
        <div v-if="!loading && !isDealerSelected" class="text-center py-12 bg-gray-50 rounded-lg border">
            <div class="flex flex-col items-center gap-4">
                <i class="pi pi-users text-5xl text-blue-300"></i>
                <h3 class="text-xl font-semibold text-gray-700">No Customer Selected</h3>
                <p class="text-gray-500 max-w-md">Please select a customer from the dropdown above to view their back order history. The table will display back orders for the selected customer and all its branches.</p>
            </div>
        </div>
    </div>
</template>

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

/* Dealer dropdown styling */
:deep(.p-dropdown) {
    min-width: 200px;
}

:deep(.p-dropdown-item) {
    padding: 0.5rem 1rem;
}
</style>
