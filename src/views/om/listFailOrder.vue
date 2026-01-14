<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';

// 🟢 State
const filters1 = ref({});
const listData = ref([]);
const loading = ref(true);
const selectedDateRange = ref(null);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);

// 🟢 Date Range Options
const dateRangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'This Month', value: 'thismonth' },
    { label: 'Last Month', value: 'lastmonth' },
    { label: 'This Year', value: 'thisyear' }
];

// 🟢 Initialize filters
function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Fetch Failed Orders
const fetchFailedOrders = async () => {
    try {
        loading.value = true;

        // Prepare request data
        const requestData = {};

        // Add date range if applied
        if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
            // Format dates for backend (d/m/Y format)
            const formatDateForBackend = (date) => {
                const d = new Date(date);
                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
            };

            requestData.date_range = `${formatDateForBackend(dateRange.value[0])} - ${formatDateForBackend(dateRange.value[1])}`;
        }

        const response = await api.post('order/failed-order', requestData);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((order) => ({
                id: order.orderID,
                orderNo: order.order_no,
                created: order.created,
                soNo: order.so_no,
                doNo: order.do_no,
                companyName: order.customer_name,
                custAccountNo: order.custAccountNo,
                shipToAccountNo: order.shipto,
                storageLocation: order.storagelocation,
                city: order.city,
                state: order.state,
                orderType: order.orderDesc,
                deliveryDate: order.deliveryDate,
                deliveryType: order.deliveryType,
                scheduledDeliveryTime: order.scheduled_delivery_time,
                deliveredDatetime: order.delivered_datetime,
                status: order.status,
                orderArray: order.order_array || []
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching failed orders:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
};

// 🟢 Calculate Date Range
const calculateDateRange = (option) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (option) {
        case 'today':
            return [today, now];

        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const endYesterday = new Date(yesterday);
            endYesterday.setHours(23, 59, 59, 999);
            return [yesterday, endYesterday];

        case 'last7days':
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 6);
            return [last7Days, now];

        case 'last30days':
            const last30Days = new Date(today);
            last30Days.setDate(last30Days.getDate() - 29);
            return [last30Days, now];

        case 'thismonth':
            const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return [firstDayThisMonth, now];

        case 'lastmonth':
            const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            lastDayLastMonth.setHours(23, 59, 59, 999);
            return [firstDayLastMonth, lastDayLastMonth];

        case 'thisyear':
            const firstDayThisYear = new Date(now.getFullYear(), 0, 1);
            return [firstDayThisYear, now];

        default:
            return [null, null];
    }
};

// 🟢 Watch date range dropdown change
watch(selectedDateRange, (newOption) => {
    if (newOption) {
        const [start, end] = calculateDateRange(newOption);
        dateRange.value = [start, end];
        hasDateFilterApplied.value = true;
        fetchFailedOrders();
    } else {
        dateRange.value = [null, null];
        hasDateFilterApplied.value = false;
        fetchFailedOrders();
    }
});

// 🟢 Filter orders
const filteredOrders = computed(() => {
    if (loading.value) return [];

    // Show all data - no tab filtering
    let filtered = listData.value;

    // Apply date range filter if active
    if (hasDateFilterApplied.value && dateRange.value[0] && dateRange.value[1]) {
        filtered = filtered.filter((order) => {
            if (!order.created) return false;

            const orderDate = new Date(order.created);
            orderDate.setHours(0, 0, 0, 0);

            const startDate = dateRange.value[0] ? new Date(dateRange.value[0]) : null;
            const endDate = dateRange.value[1] ? new Date(dateRange.value[1]) : null;

            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);

            const isAfterStart = !startDate || orderDate >= startDate;
            const isBeforeEnd = !endDate || orderDate <= endDate;

            return isAfterStart && isBeforeEnd;
        });
    }

    return filtered;
});

// 🟢 Format Date (Date only)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date
        .toLocaleString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
        .split(',')[0]; // Get only date part
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

// 🟢 Get Status Severity
const getStatusSeverity = (status) => {
    switch (status) {
        case 'FAILED':
            return 'danger';
        case 'TIMEOUT':
            return 'warning';
        default:
            return 'info';
    }
};

// 🟢 Get Order Type Label
const getOrderTypeLabel = (orderType) => {
    switch (orderType) {
        case 'NORMAL':
            return 'NORMAL';
        case 'Directship':
            return 'DS';
        case 'Own':
            return 'OWN USE';
        case 'Warranty':
            return 'WARRANTY';
        case 'Back Order':
            return 'BACK ORDER';
        default:
            return orderType || '-';
    }
};

// 🟢 Get Delivery Type Label
const getDeliveryTypeLabel = (deliveryType) => {
    switch (deliveryType) {
        case 'DELIVER':
            return 'DELIVER';
        case 'PICKUP':
            return 'PICKUP';
        case 'SELFCOLLECT':
            return 'OWNCOLLECT';
        case 'LALAMOVE':
            return 'LALAMOVE';
        default:
            return deliveryType || '-';
    }
};

// 🟢 Clear Date Range
const clearDateRange = () => {
    selectedDateRange.value = null;
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    fetchFailedOrders();
};

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters1();
    await fetchFailedOrders();
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Failed Order</div>

        <div>
            <LoadingPage v-if="loading" :message="'Loading Failed Orders...'" :sub-message="'Fetching failed order list'" />

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
                :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipToAccountNo', 'created', 'orderType', 'deliveryType', 'soNo', 'doNo']"
                class="rounded-table"
                removableSort
                sortField="created"
                :sortOrder="-1"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex flex-col gap-4 w-full">
                        <!-- Top Row: Search and Date Filter -->
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2">
                                <IconField class="w-64">
                                    <InputIcon><i class="pi pi-search" /></InputIcon>
                                    <InputText v-model="filters1['global'].value" placeholder="Search failed orders..." class="w-full" />
                                </IconField>
                            </div>

                            <div class="flex items-center gap-4">
                                <!-- Date Range Dropdown -->
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-medium text-gray-700">Date Range:</span>
                                    <Dropdown v-model="selectedDateRange" :options="dateRangeOptions" optionLabel="label" optionValue="value" placeholder="Select period" class="w-40" :disabled="loading" />
                                    <Button v-if="selectedDateRange" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-exclamation-triangle text-3xl text-gray-400"></i>
                            <span class="text-lg">No failed orders found</span>
                            <span v-if="hasDateFilterApplied" class="text-sm text-gray-400">Try adjusting your date range or search criteria</span>
                        </div>
                    </div>
                </template>

                <!-- Regular Columns -->
                <Column field="created" header="Created On" style="min-width: 7rem" sortable>
                    <template #body="{ data }">{{ formatDateTime(data.created) }}</template>
                </Column>

                <Column header="Order No" style="min-width: 9rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <RouterLink :to="`/om/detailFailOrder/${data.id}`" class="hover:underline font-bold text-primary-400">
                                {{ data.orderNo || '-' }}
                            </RouterLink>
                        </div>
                    </template>
                </Column>

                <Column header="Customer" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <span class="font-bold truncate">{{ data.companyName || '-' }}</span>
                            <span class="text-sm text-gray-600">{{ data.custAccountNo || '-' }}</span>
                        </div>
                    </template>
                </Column>

                <Column field="orderType" header="Order Type" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        <span>{{ getOrderTypeLabel(data.orderType) }}</span>
                    </template>
                </Column>

                <Column field="deliveryType" header="Delivery" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        <span>{{ getDeliveryTypeLabel(data.deliveryType) }}</span>
                    </template>
                </Column>

                <Column field="shipToAccountNo" header="Ship To Acc" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.shipToAccountNo || data.custAccountNo || '-' }}
                    </template>
                </Column>

                <Column header="Delivery Info" style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <!-- ETA -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">ETA:</span>
                                <span class="font-medium">{{ formatDate(data.deliveryDate) || '-' }}</span>
                            </div>

                            <!-- Planned -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Planned:</span>
                                <span class="font-medium">{{ data.scheduledDeliveryTime ? formatDate(data.scheduledDeliveryTime) : '-' }}</span>
                            </div>

                            <!-- Delivered -->
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">Delivery:</span>
                                <span class="font-medium">
                                    <template v-if="data.deliveredDatetime">
                                        {{ formatDate(data.deliveredDatetime) }}
                                    </template>
                                    <template v-else>-</template>
                                </span>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column header="SAP Ref Status" style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex flex-col space-y-1 text-sm">
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">SO:</span>
                                <span class="font-medium">{{ data.soNo || 'Pending' }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-600">DO:</span>
                                <span class="font-medium">{{ data.doNo || 'Pending' }}</span>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
}
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
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
</style>
