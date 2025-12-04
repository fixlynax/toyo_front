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

// 🟢 Initialize filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Tab setup with date range requirement
const statusTabs = [
    { label: 'Pending', status: 'PENDING', requiresDateRange: false },
    { label: 'Approved', status: 'APPROVED', requiresDateRange: false },
    { label: 'Rejected', status: 'REJECTED', requiresDateRange: true },
    { label: 'Pending Collection', status: 'PENDING_COLLECTION', requiresDateRange: false },
    { label: 'Completed', status: 'COMPLETE', requiresDateRange: true }
];
const activeTabIndex = ref(0);

// 🧩 Status Map (frontend view)
const STATUS_MAP = {
    0: { label: 'Pending Approval', severity: 'warn' },
    1: { label: 'Approved', severity: 'success' },
    2: { label: 'Rejected', severity: 'danger' },
    77: { label: 'Pending Collection', severity: 'secondary' },
    9: { label: 'Completed', severity: 'primary' }
};

// 🧩 Computed properties
const currentTab = computed(() => statusTabs[activeTabIndex.value]);
const currentTabLabel = computed(() => currentTab.value?.label || '');
const showDateRangeFilter = computed(() => currentTab.value?.requiresDateRange || false);
const isCompletedTab = computed(() => currentTab.value?.status === 'COMPLETE');
const isPendingCTCTab = computed(() => currentTab.value?.status === 'PENDING_COLLECTION');
const isRejectedTab = computed(() => currentTab.value?.status === 'REJECTED');

// 🧩 Helpers
const getOverallStatusSeverity = (orderStatus) => {
    return STATUS_MAP[Number(orderStatus)]?.severity || 'warn';
};

const getOverallStatusLabel = (orderStatus) => {
    return STATUS_MAP[Number(orderStatus)]?.label || 'Pending';
};

// 🧩 Check if status is completed
const isCompletedStatus = (orderStatus) => {
    return Number(orderStatus) === 9;
};

// 🧩 Check if status is pending collection
const isPendingCTCStatus = (orderStatus) => {
    return Number(orderStatus) === 77;
};

// 🧩 Date Formatter
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
        return dateString;
    }
};

// 🟢 Fetch return orders based on tab
const fetchReturnOrders = async (tabStatus = 'PENDING') => {
    loading.value = true;
    try {
        const selectedTab = currentTab.value;

        // For tabs requiring date range, don't fetch until date range is set
        if (selectedTab?.requiresDateRange && !hasDateFilterApplied.value) {
            listData.value = [];
            loading.value = false;
            return;
        }

        // Prepare request parameters
        const params = { tabs: tabStatus };

        // Add date range if applied
        if (selectedTab?.requiresDateRange && hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            params.date_range = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
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

// 🟢 Watch for tab change
watch(activeTabIndex, (newIndex, oldIndex) => {
    const selectedTab = statusTabs[newIndex];

    // Reset date range when changing tabs
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Clear data when switching to tabs requiring date range
    if (selectedTab?.requiresDateRange) {
        listData.value = [];
    } else {
        const selectedStatus = selectedTab?.status;
        fetchReturnOrders(selectedStatus);
    }
});

// 🟢 Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch for tabs that require date range
        if (selectedTab?.requiresDateRange) {
            if (newRange[0] && newRange[1]) {
                hasDateFilterApplied.value = true;
                fetchReturnOrders(selectedTab.status);
            } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
                // Clear data if date range is cleared
                listData.value = [];
                hasDateFilterApplied.value = false;
            }
        }
    },
    { deep: true }
);

// 🟢 Clear date range
const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    listData.value = [];
};

// 🟢 Initial data load
onBeforeMount(() => {
    initFilters();
    const firstTab = statusTabs[activeTabIndex.value];

    // Don't fetch if first tab requires date range
    if (firstTab?.requiresDateRange) {
        loading.value = false;
        listData.value = [];
    } else {
        fetchReturnOrders(firstTab?.status);
    }
});
</script>

<template>
    <div class="card">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Return Order</div>

        <!-- 🟢 Loading Page -->
        <LoadingPage v-if="loading" :message="'Loading Return Orders...'" :sub-message="'Fetching Return Order list...'" />

        <!-- 🟢 Tab Menu and Table -->
        <div v-else>
            <!-- 🟣 Status Tabs -->
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

            <!-- 🟢 DataTable -->
            <DataTable
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
                <!-- Header -->
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
                                <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                            </div>
                        </div>

                        <!-- Date Range Filter (for Completed and Rejected tabs) -->
                        <div v-if="showDateRangeFilter" class="flex items-center gap-4 flex-wrap">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Date Range:</span>
                                <div class="flex items-center gap-2">
                                    <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                    <span class="text-gray-500">to</span>
                                    <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                </div>
                                <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                            </div>
                            <div v-if="!hasDateFilterApplied" class="text-sm text-blue-600 italic">Please select a date range to view {{ currentTabLabel }} orders</div>
                            <!-- <div v-else-if="dateRange[0] && dateRange[1]" class="text-sm text-gray-600">Showing {{ listData.length }} orders from {{ formatDate(dateRange[0]) }} to {{ formatDate(dateRange[1]) }}</div> -->
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        <template v-if="showDateRangeFilter && !hasDateFilterApplied">
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
                        <template v-else-if="showDateRangeFilter && hasDateFilterApplied"> No {{ currentTabLabel }} orders found in the selected date range. </template>
                        <template v-else> No return orders found for this status. </template>
                    </div>
                </template>

                <!-- Created Date Column -->
                <Column header="Created Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.createdDate) }}
                    </template>
                </Column>

                <!-- Return Request No Column -->
                <Column header="Return Req No." style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailReturnOrder/${data.returnRequestNo}`" class="hover:underline font-bold text-primary-400">
                            {{ data.returnRequestNo }}
                        </RouterLink>
                    </template>
                </Column>

                <!-- Account No Column -->
                <Column header="Customer Name" style="min-width: 10rem" sortable>
                    <template #body="{ data }"><span class="font-bold">{{ data.customerName || '-' }}</span><br />{{ data.custAccountNo || '-' }}</template>
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
</style>