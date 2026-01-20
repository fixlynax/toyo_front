<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';

// 🟢 State variables
const filters = ref({});
const listData = ref([]);
const loading = ref(true);
const dateRange = ref([null, null]); // [startDate, endDate]
const hasDateFilterApplied = ref(false); // Track if date filter is applied
const dealers = ref([]); // List of dealers (main accounts only)
const selectedDealer = ref(null); // Selected dealer
const isDealerSelected = ref(false); // Flag to track if dealer is selected

// 🟢 Initialize filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Tab setup with date range requirement and initial load control
const statusTabs = [
    { label: 'Pending', status: 'PENDING', requiresDateRange: false, initialLoad: true },
    { label: 'Approved', status: 'APPROVED', requiresDateRange: false, initialLoad: true },
    { label: 'Rejected', status: 'REJECTED', requiresDateRange: true, initialLoad: false },
    { label: 'Pending Collection', status: 'PENDING_COLLECTION', requiresDateRange: false, initialLoad: true },
    { label: 'Return Received', status: 'CREDITNOTE', requiresDateRange: false, initialLoad: true },
    { label: 'Completed', status: 'COMPLETE', requiresDateRange: true, initialLoad: false }
];
const activeTabIndex = ref(0);

// 🧩 Status Map (frontend view)
const STATUS_MAP = {
    0: { label: 'Pending Approval', severity: 'warn' },
    1: { label: 'Approved', severity: 'success' },
    2: { label: 'Rejected', severity: 'danger' },
    77: { label: 'Pending Collection', severity: 'secondary' },
    9: { label: 'Completed', severity: 'primary' },
    88: { label: 'Return Received', severity: 'info' }
};

// 🧩 Computed properties
const currentTab = computed(() => statusTabs[activeTabIndex.value]);
const currentTabLabel = computed(() => currentTab.value?.label || '');
const showDateRangeFilter = computed(() => currentTab.value?.requiresDateRange || false);
const isCompletedTab = computed(() => currentTab.value?.status === 'COMPLETE');
const isPendingCTCTab = computed(() => currentTab.value?.status === 'PENDING_COLLECTION');
const isRejectedTab = computed(() => currentTab.value?.status === 'REJECTED');
const isPendingCNTab = computed(() => currentTab.value?.status === 'CREDITNOTE');

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

// 🧩 Helpers
const getOverallStatusSeverity = (orderStatus) => {
    // If current tab is Pending CN, use the Pending Credit Note severity
    if (isPendingCNTab.value && currentTab.value?.status === 'CREDITNOTE') {
        return STATUS_MAP[88].severity;
    }
    return STATUS_MAP[Number(orderStatus)]?.severity || 'warn';
};

const getOverallStatusLabel = (orderStatus) => {
    // If current tab is Pending CN, use the Pending Credit Note label
    if (isPendingCNTab.value && currentTab.value?.status === 'CREDITNOTE') {
        return STATUS_MAP[88].label;
    }
    return STATUS_MAP[Number(orderStatus)]?.label || 'Pending';
};

// 🧩 Date Formatter
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    let formatted = date.toLocaleString('en-MY', options);

    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};

// 🟢 Fetch return orders based on tab - Modified to handle all customers by default
const fetchReturnOrders = async (tabStatus = 'PENDING', mainAccountNo = null) => {
    loading.value = true;
    try {
        const selectedTab = currentTab.value;

        // For tabs requiring date range and without initial load, don't fetch until date range is set
        if (selectedTab?.requiresDateRange && !selectedTab?.initialLoad && !hasDateFilterApplied.value) {
            listData.value = [];
            loading.value = false;
            return;
        }

        // Prepare request parameters
        const params = { tabs: tabStatus };

        // Add date range if applied - by default show daily (today's) records
        if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };
            params.date_range = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
        } else {
            // Default to today's date if no date range is selected
            const today = new Date();
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };
            params.date_range = `${formatDateForBackend(today)} - ${formatDateForBackend(today)}`;
            dateRange.value = [today, today]; // Set default date range to today
            hasDateFilterApplied.value = true; // Mark that default date is applied
        }

        // Add dealer filter only if selected (not required by default)
        if (mainAccountNo) {
            params.custaccountno = mainAccountNo;
            params.mainBranch = 1; // Tell backend this is a main branch selection
        }

        const response = await api.post(`order/list-return-order`, params);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((returnOrder) => ({
                id: returnOrder.id,
                returnRequestNo: returnOrder.return_orderNo_ref || '-',
                custAccountNo: returnOrder.custAccountNo || '-',
                customerName: returnOrder.dealerName || '-',
                reasonCode: returnOrder.reason_code || '-',
                reasonMessage: returnOrder.reason_message || '-',
                createdDate: returnOrder.created || '-',
                orderStatus: returnOrder.orderstatus || '-',
                // Add delivery information if available
                ctcDate: returnOrder.delivery_information?.pickup_datetime || '-',
                recieve_date: returnOrder.delivery_information?.receive_datetime || '-',
                pickup: returnOrder.delivery_information?.pickup_datetime || '-'
            }));
        } else {
            console.warn('Unexpected API response:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching return order list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
};

// 🟢 Handle dealer selection - Modified to be optional
const handleDealerChange = () => {
    const selectedTab = currentTab.value;

    if (selectedDealer.value) {
        isDealerSelected.value = true;
        fetchReturnOrders(selectedTab.status, selectedDealer.value);
    } else {
        isDealerSelected.value = false;
        // When no dealer selected, show all customers with current date range
        fetchReturnOrders(selectedTab.status, null);
    }
};

// 🟢 Watch for tab change - Modified to handle all customers
watch(activeTabIndex, (newIndex, oldIndex) => {
    const selectedTab = statusTabs[newIndex];

    // Reset date range when changing tabs
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Always fetch data when changing tabs
    if (selectedTab?.requiresDateRange && !selectedTab?.initialLoad) {
        // For Rejected/Completed tabs, require date range
        if (!hasDateFilterApplied.value) {
            listData.value = [];
            loading.value = false;
        } else {
            fetchReturnOrders(selectedTab.status, selectedDealer.value);
        }
    } else {
        // For other tabs, fetch with current date range
        fetchReturnOrders(selectedTab.status, selectedDealer.value);
    }
});

// 🟢 Watch date range changes - Modified to handle all customers
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch when both dates are set
        if (newRange[0] && newRange[1]) {
            hasDateFilterApplied.value = true;
            fetchReturnOrders(selectedTab.status, selectedDealer.value);
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            // Handle clearing date range - reset to default (today)
            hasDateFilterApplied.value = false;
            const today = new Date();
            dateRange.value = [today, today];
            hasDateFilterApplied.value = true;
            fetchReturnOrders(selectedTab.status, selectedDealer.value);
        }
    },
    { deep: true }
);

// 🟢 Watch dealer selection - Modified to be optional
watch(selectedDealer, () => {
    handleDealerChange();
});

// 🟢 Clear date range - Modified to reset to default (today)
const clearDateRange = () => {
    const today = new Date();
    dateRange.value = [today, today];
    hasDateFilterApplied.value = true;
    fetchReturnOrders(currentTab.value.status, selectedDealer.value);
};

// 🟢 Clear Dealer Filter - Modified to show all customers
const clearDealerFilter = () => {
    selectedDealer.value = null;
    isDealerSelected.value = false;
    fetchReturnOrders(currentTab.value.status, null);
};

// 🟢 Initial data load - Modified to load data immediately
onBeforeMount(async () => {
    initFilters();
    await fetchDealers(); // Load dealers first

    // Set default date range to today
    const today = new Date();
    dateRange.value = [today, today];
    hasDateFilterApplied.value = true;

    // Fetch initial data for the first tab (Pending)
    fetchReturnOrders(statusTabs[0].status, null);
});
</script>

<template>
    <div class="card">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Customer Return Order</div>

        <div>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

            <!-- Header with Search and Filters (Always shown) -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div class="flex flex-col gap-4 w-full">
                    <!-- Search Row -->
                    <div class="flex items-center gap-4 w-full">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon><i class="pi pi-search" /></InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" :disabled="loading" />
                            </IconField>
                        </div>
                    </div>

                    <!-- Filter Row: Customer and Date Range in one line -->
                    <div class="flex items-center gap-6 flex-wrap">
                        <!-- Customer Dropdown (Main accounts only) -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Customer:</span>
                            <div class="relative">
                                <Dropdown v-model="selectedDealer" :options="dealers" optionLabel="companyName" optionValue="custAccountNo" placeholder="All Customers" class="w-100" :filter="true" :disabled="loading">
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
                                        <span v-else>All Customers</span>
                                    </template>
                                </Dropdown>
                                <Button v-if="selectedDealer" icon="pi pi-times" class="p-button-text p-button-sm ml-2" @click="clearDealerFilter" title="Clear customer filter" />
                            </div>
                        </div>

                        <!-- Date Range Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>

                        <!-- Show message only for Completed/Rejected tabs without date filter -->
                        <div v-if="showDateRangeFilter && !currentTab?.initialLoad && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                    </div>
                </div>
            </div>

            <!-- 🟢 Loading Page -->
            <LoadingPage v-if="loading" :message="'Loading Return Orders...'" :sub-message="'Fetching Return Order list...'" />

            <!-- 🟢 DataTable (Always shown, loads all customers by default) -->
            <DataTable
                v-if="!loading"
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                dataKey="id"
                :rowHover="true"
                :filters="filters"
                filterDisplay="menu"
                sortField="createdDate"
                :sortOrder="-1"
                removableSort
                :globalFilterFields="['returnRequestNo', 'custAccountNo', 'customerName', 'reasonCode', 'orderStatus']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        <template v-if="showDateRangeFilter && !currentTab?.initialLoad && !hasDateFilterApplied">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-calendar text-3xl text-blue-400"></i>
                                <span class="text-lg">Select a date range to view {{ currentTabLabel }} orders</span>
                                <span class="text-sm text-gray-400">Choose both start and end dates to filter results</span>
                            </div>
                        </template>
                        <template v-else-if="hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                                <span class="text-lg">Please select both start and end dates</span>
                            </div>
                        </template>
                        <template v-else> No return orders found for the selected criteria. </template>
                    </div>
                </template>

                <!-- Created Date Column -->
                <Column header="Created On" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDateTime(data.createdDate) }}
                    </template>
                </Column>

                <!-- Return Request No Column -->
                <Column header="Return Req No." style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/sales/detailCustomerReturnOrder/${data.returnRequestNo}`" class="hover:underline font-bold text-primary-400">
                            {{ data.returnRequestNo }}
                        </RouterLink>
                    </template>
                </Column>

                <!-- Account No Column -->
                <Column header="Customer Name" style="min-width: 10rem" sortable>
                    <template #body="{ data }"
                        ><span class="font-bold">{{ data.customerName || '-' }}</span
                        ><br />{{ data.custAccountNo || '-' }}</template
                    >
                </Column>

                <!-- Reason Code Column -->
                <Column header="Reason Code" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.reasonCode || '-' }}
                    </template>
                </Column>

                <!-- Reason Message Column -->
                <Column header="Reason Message" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.reasonMessage || '-' }}
                    </template>
                </Column>

                <!-- Received Date Column - Only show for completed orders -->
                <Column v-if="isPendingCTCTab" field="recieve_date" header="Pickup Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.pickup) || '-' }}
                    </template>
                </Column>

                <!-- Received Date Column - Only show for completed orders -->
                <Column v-if="isCompletedTab" field="recieve_date" header="Received Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.recieve_date) || '-' }}
                    </template>
                </Column>

                <!-- Collection Date Column - Only show for completed orders -->
                <Column v-if="isCompletedTab" field="ctcDate" header="Collection Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.pickup) || '-' }}
                    </template>
                </Column>

                <!-- Status Column -->
                <Column field="orderStatus" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Tag :value="getOverallStatusLabel(data.orderStatus)" :severity="getOverallStatusSeverity(data.orderStatus)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
    border-color: #3b82f6;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
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

/* Dealer dropdown styling */
:deep(.p-dropdown) {
    min-width: 200px;
}

:deep(.p-dropdown-item) {
    padding: 0.5rem 1rem;
}
</style>
