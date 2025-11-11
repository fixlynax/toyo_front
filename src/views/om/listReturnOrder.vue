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

// 🟢 Initialize filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Tab setup (same concept as listOrder)
const statusTabs = [
    { label: 'Pending', status: 'PENDING' },
    { label: 'Approved', status: 'APPROVED' },
    { label: 'Rejected', status: 'REJECTED' },
    { label: 'Pending Collection', status: 'PENDING_COLLECTION' },
    { label: 'Completed', status: 'COMPLETE' }
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

// 🧩 Helpers
const getOverallStatusSeverity = (orderStatus) => {
    return STATUS_MAP[Number(orderStatus)]?.severity || 'warn';
};

const getOverallStatusLabel = (orderStatus) => {
    return STATUS_MAP[Number(orderStatus)]?.label || 'Pending';
};

// 🧩 Check if status is completed
const isCompletedStatus = (orderStatus) => {
    return Number(orderStatus) === 9; // 9 represents 'Completed' in your STATUS_MAP
};
// 🧩 Check if status is completed
const isPendingCTCStatus = (orderStatus) => {
    return Number(orderStatus) === 77; // 9 represents 'Completed' in your STATUS_MAP
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
        const response = await api.post(`order/list-return-order?tabs=${tabStatus}`);

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
                ctcDate: returnOrder.ctcDate || '-', // Add collection date from API
                // recieve_date: returnOrder.delivery_information.receive_datetime || '-', 
                // pickup: returnOrder.delivery_information.pickup_datetime || '-',
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
watch(activeTabIndex, (newIndex) => {
    const selectedStatus = statusTabs[newIndex]?.status;
    fetchReturnOrders(selectedStatus);
});

// 🟢 Computed property to check if current tab shows completed orders
const isCompletedTab = computed(() => {
    const currentTabStatus = statusTabs[activeTabIndex.value]?.status;
    return currentTabStatus === 'COMPLETE';
});
// 🟢 Computed property to check if current tab shows completed orders
const isPendingCTCTab = computed(() => {
    const currentTabStatus = statusTabs[activeTabIndex.value]?.status;
    return currentTabStatus === 'PENDING_COLLECTION';
});

// 🟢 Initial data load
onBeforeMount(() => {
    initFilters();
    const firstTab = statusTabs[activeTabIndex.value]?.status;
    fetchReturnOrders(firstTab);
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
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :filters="filters"
                filterDisplay="menu"
                :sortOrder="-1"
                :globalFilterFields="['returnRequestNo', 'custAccountNo', 'customerName', 'reasonCode', 'orderStatus']"
                class="rounded-table"
            >
                <!-- Header -->
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>

                        <!-- Right: Create Customer Button -->
                        <RouterLink to="/om/createReturnOrder">
                            <Button type="button" label="Create" />
                        </RouterLink>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">No return orders found for this status.</div>
                </template>

                <!-- Created Date Column -->
                <Column field="createdDate" header="Created Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.createdDate) }}
                    </template>
                </Column>

                <!-- Return Request No Column -->
                <Column field="returnRequestNo" header="Return Req No." style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailReturnOrder/${data.returnRequestNo}`" class="hover:underline font-bold text-primary-400">
                            {{ data.returnRequestNo }}
                        </RouterLink>
                    </template>
                </Column>

                <!-- Account No Column -->
                <Column field="custAccountNo" header="Acc No." style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.custAccountNo }}
                    </template>
                </Column>

                <!-- Customer Name Column -->
                <Column field="customerName" header="Requester Name" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.customerName }}
                    </template>
                </Column>

                <!-- Reason Code Column -->
                <Column field="reasonCode" header="Reason Code" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.reasonCode || 'N/A' }}
                    </template>
                </Column>

                <!-- Reason Message Column -->
                <Column field="reasonMessage" header="Reason Message" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.reasonMessage || 'N/A' }}
                    </template>
                </Column>

                <!-- Received Date Column - Only show for completed orders -->
                <Column v-if="isPendingCTCTab" field="recieve_date" header="Pickup ETA" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.pickup) }}
                    </template>
                </Column>

                <!-- Received Date Column - Only show for completed orders -->
                <Column v-if="isCompletedTab" field="recieve_date" header="Received Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.recieve_date) }}
                    </template>
                </Column>

                <!-- Collection Date Column - Only show for completed orders -->
                <Column v-if="isCompletedTab" field="ctcDate" header="Collection Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.ctcDate) }}
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
