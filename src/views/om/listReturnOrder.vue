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

// 🟢 Helper function to get default date range for Completed tab (last 7 days)
const getDefaultDateRangeForCompleted = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago

    return {
        start: startDate,
        end: endDate
    };
};

// 🟢 Tab setup with date range requirement and initial load control
const statusTabs = [
    { label: 'Pending', status: 'PENDING', requiresDateRange: false, initialLoad: true },
    { label: 'Approved', status: 'APPROVED', requiresDateRange: false, initialLoad: true },
    { label: 'Rejected', status: 'REJECTED', requiresDateRange: true, initialLoad: true }, // Changed initialLoad to true
    { label: 'Pending Collection', status: 'PENDING_COLLECTION', requiresDateRange: false, initialLoad: true },
    { label: 'Return Received', status: 'CREDITNOTE', requiresDateRange: false, initialLoad: true },
    { label: 'Completed', status: 'COMPLETE', requiresDateRange: true, initialLoad: true }
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

// 🧩 Check if status is completed
const isCompletedStatus = (orderStatus) => {
    return Number(orderStatus) === 9;
};

// 🧩 Check if status is pending collection
const isPendingCTCStatus = (orderStatus) => {
    return Number(orderStatus) === 77;
};

// 🧩 Check if status is pending credit note
const isPendingCNStatus = (orderStatus) => {
    return Number(orderStatus) === 88;
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

// 🟢 Fetch return orders based on tab
const fetchReturnOrders = async (tabStatus = 'PENDING', useDefaultRange = false) => {
    loading.value = true;
    try {
        const selectedTab = currentTab.value;

        // Prepare request parameters
        const params = { tabs: tabStatus };

        // Add date range if applied or if it's Completed/Rejected tab with default range
        if (hasDateFilterApplied.value || (tabStatus === 'COMPLETE' && useDefaultRange) || (tabStatus === 'REJECTED' && useDefaultRange)) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            let startDate, endDate;

            if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
                // Use user-selected date range
                startDate = dateRange.value[0];
                endDate = dateRange.value[1];
            } else if ((tabStatus === 'COMPLETE' || tabStatus === 'REJECTED') && useDefaultRange) {
                // Use default 7-day range for Completed or Rejected tab
                const defaultRange = getDefaultDateRangeForCompleted();
                startDate = defaultRange.start;
                endDate = defaultRange.end;
            }

            if (startDate && endDate) {
                params.date_range = `${formatDateForBackend(startDate)} - ${formatDateForBackend(endDate)}`;
            }
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

    // Always fetch data when switching tabs
    if (selectedTab?.status === 'COMPLETE' || selectedTab?.status === 'REJECTED') {
        // For Completed and Rejected tabs, fetch last 7 days by default
        fetchReturnOrders(selectedTab.status, true);
    } else {
        // For other tabs, fetch all data
        fetchReturnOrders(selectedTab?.status);
    }
});

// 🟢 Watch date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        const selectedTab = currentTab.value;

        // Only trigger fetch when both dates are set
        if (newRange[0] && newRange[1]) {
            hasDateFilterApplied.value = true;
            fetchReturnOrders(selectedTab.status);
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            // Clear data if date range is cleared
            hasDateFilterApplied.value = false;

            // Reload data based on tab
            if (selectedTab?.status === 'COMPLETE' || selectedTab?.status === 'REJECTED') {
                // For Completed and Rejected tabs, reload last 7 days
                fetchReturnOrders(selectedTab.status, true);
            } else {
                // For other tabs, reload all data
                fetchReturnOrders(selectedTab.status);
            }
        }
    },
    { deep: true }
);

// 🟢 Clear date range
const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;

    // Reload data based on current tab
    if (currentTab.value?.status === 'COMPLETE' || currentTab.value?.status === 'REJECTED') {
        // For Completed and Rejected tabs, reload last 7 days
        fetchReturnOrders(currentTab.value.status, true);
    } else {
        // For other tabs, reload all data
        fetchReturnOrders(currentTab.value.status);
    }
};

// 🟢 Initial data load
onBeforeMount(() => {
    initFilters();
    const firstTab = statusTabs[activeTabIndex.value];

    // Handle initial load based on tab
    if (firstTab?.status === 'COMPLETE' || firstTab?.status === 'REJECTED') {
        // For Completed and Rejected tabs, fetch last 7 days by default
        fetchReturnOrders(firstTab.status, true);
    } else {
        // For other tabs, fetch all data
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
                :rowsPerPageOptions="[10, 20, 50, 100]"
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

                        <!-- Date Range Filter (for all tabs) -->
                        <div class="flex items-center gap-4 flex-wrap">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Date Range:</span>
                                <div class="flex items-center gap-2">
                                    <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                    <span class="text-gray-500">to</span>
                                    <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                </div>
                                <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                            </div>
                            <!-- Show message for Completed and Rejected tabs showing default range -->
                            <div v-if="(isCompletedTab || isRejectedTab) && !hasDateFilterApplied" class="text-sm text-blue-600 italic">Showing last 7 days of {{ currentTabLabel }} orders. Use date range to filter further.</div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        <template v-if="(isCompletedTab || isRejectedTab) && !hasDateFilterApplied">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-calendar text-3xl text-blue-400"></i>
                                <span class="text-lg">Showing last 7 days of {{ currentTabLabel }} orders</span>
                                <span class="text-sm text-gray-400">Use date range to filter different periods</span>
                            </div>
                        </template>
                        <template v-else-if="hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                            <div class="flex flex-col items-center gap-2">
                                <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                                <span class="text-lg">Please select both start and end dates</span>
                            </div>
                        </template>
                        <template v-else-if="hasDateFilterApplied"> No {{ currentTabLabel }} orders found in the selected date range. </template>
                        <template v-else> No return orders found for this status. </template>
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
                        <RouterLink :to="`/om/detailReturnOrder/${data.returnRequestNo}`" class="hover:underline font-bold text-primary-400">
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
</style>
