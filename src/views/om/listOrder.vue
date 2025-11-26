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
const dateRange = ref([null, null]); // [startDate, endDate]

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

// 🟢 Tabs
const statusTabs = [
    { label: 'Processing', status: 66 },
    { label: 'Delivery', status: 77 },
    { label: 'Completed', status: 1 }
];
const activeTabIndex = ref(0);

// 🟢 Fetch Orders
const fetchOrders = async (status = null) => {
    try {
        loading.value = true;
        const statusMapping = { 66: 'PROCESSING', 77: 'DELIVERY', 1: 'COMPLETE' };
        const tabs = statusMapping[status] || 'PROCESSING';
        const response = await api.post('order/list-order', { tabs });

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
        loading.value = false;
    }
};

// 🟢 Watch tab change
watch(activeTabIndex, (newIndex) => {
    const selectedStatus = statusTabs[newIndex]?.status;
    dateRange.value = [null, null]; // Reset date range when tab changes
    fetchOrders(selectedStatus);
});

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters1();
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;
    await fetchOrders(selectedStatus);
});

// 🟢 Computed - Filter orders by status and date range
const filteredOrders = computed(() => {
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;
    let filtered = listData.value.filter((order) => order.orderStatus === selectedStatus);

    // Apply date range filter only for completed orders (status 1)
    if (selectedStatus === 1 && (dateRange.value[0] || dateRange.value[1])) {
        filtered = filtered.filter((order) => {
            if (!order.created) return false;

            const orderDate = new Date(order.created);
            orderDate.setHours(0, 0, 0, 0); // Normalize time to start of day

            const startDate = dateRange.value[0] ? new Date(dateRange.value[0]) : null;
            const endDate = dateRange.value[1] ? new Date(dateRange.value[1]) : null;

            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999); // End of day

            const isAfterStart = !startDate || orderDate >= startDate;
            const isBeforeEnd = !endDate || orderDate <= endDate;

            return isAfterStart && isBeforeEnd;
        });
    }

    return filtered;
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

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
};
</script>

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
                :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipToAccountNo', 'created', 'orderType', 'deliveryType']"
                class="rounded-table"
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
                                <Button type="button" icon="pi pi-cog" class="p-button" />
                            </div>
                            <div>
                                <RouterLink to="/om/createOrder">
                                    <Button label="Create" icon="pi pi-plus" class="p-button-primary" />
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Date Range Filter (Only for Completed Orders) -->
                        <div v-if="activeTabIndex === 2" class="flex items-center gap-4 flex-wrap">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Date Range:</span>
                                <div class="flex items-center gap-2">
                                    <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" />
                                    <span class="text-gray-500">to</span>
                                    <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" />
                                </div>
                                <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                            </div>
                            <div v-if="dateRange[0] || dateRange[1]" class="text-sm text-gray-600">Showing {{ filteredOrders.length }} orders</div>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">
                        <template v-if="activeTabIndex === 2 && (dateRange[0] || dateRange[1])"> No completed orders found in the selected date range. </template>
                        <template v-else> No orders found. </template>
                    </div>
                </template>

                <Column field="created" header="Created Date" style="min-width: 8rem">
                    <template #body="{ data }">{{ formatDate(data.created) }}</template>
                </Column>

                <Column header="Order No" style="min-width: 10rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailOrder/${data.orderNo}`" class="hover:underline font-bold text-primary-400">
                            {{ data.orderNo || '-' }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="companyName" header="Customer Name" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.companyName || '-' }}<br />{{ data.custAccountNo || '-' }}</template>
                </Column>

                <Column field="orderType" header="Order Type" style="min-width: 7rem">
                    <template #body="{ data }">
                        <span v-if="data.orderType === 'NORMAL'">Normal</span>
                        <span v-else-if="data.orderType === 'DS'">DS</span>
                        <span v-else-if="data.orderType === 'OWN-USE'">Own-use</span>
                        <span v-else>{{ data.orderType || data.sapOrderType || '-' }}</span>
                    </template>
                </Column>

                <Column field="deliveryType" header="Delivery" style="min-width: 6rem">
                    <template #body="{ data }">
                        <span v-if="data.deliveryType === 'DELIVER'">Deliver</span>
                        <span v-else-if="data.deliveryType === 'PICKUP'">Pickup</span>
                        <span v-else-if="data.deliveryType === 'SELFCOLLECT'">Self Collect</span>
                        <span v-else-if="data.deliveryType === 'LALAMOVE'">Lalamove</span>
                        <span v-else>{{ data.deliveryType || '-' }}</span>
                    </template>
                </Column>

                <Column field="shipToAccountNo" header="Ship To Acc No" style="min-width: 7rem">
                    <template #body="{ data }">{{ data.shipToAccountNo || data.custAccountNo || '-' }}</template>
                </Column>

                <!-- Modified Delivery Info Column - Horizontal Layout -->
                <Column style="min-width: 20rem">
                    <!-- Custom Header -->
                    <template #header>
                        <div class="flex flex-col w-full">
                            <!-- Title -->
                            <div class="text-center font-bold text-gray-800 mb-1">Delivery Info</div>

                            <!-- Sub-headers -->
                            <div class="flex text-xs text-black font-semibold">
                                <div class="w-1/3 py-1 text-center">ETA</div>
                                <div class="w-1/3 py-1 text-center border-l border-gray-200">Planned</div>
                                <div class="w-1/3 py-1 text-center border-l border-gray-200">Delivered</div>
                            </div>
                        </div>
                    </template>

                    <!-- Body -->
                    <template #body="{ data }">
                        <div class="flex">
                            <div class="w-1/3 py-2 text-center text-sm">
                                <strong>{{ formatDeliveryDate(data.deliveryDate) || '-' }}</strong>
                            </div>

                            <div class="w-1/3 py-2 text-center text-sm border-l border-gray-200">
                                <strong>{{ data.scmDeliverInfo ? formatDeliveryDate(data.scmDeliverInfo.scheduled_delivery_time) : '-' }}</strong>
                            </div>

                            <div class="w-1/3 py-2 text-center text-sm border-l border-gray-200">
                                <template v-if="data.scmDeliverInfo?.delivered_datetime">
                                    <strong>{{ formatDeliveryDate(data.scmDeliverInfo.delivered_datetime) }}</strong>
                                </template>
                                <template v-else-if="data.scmPickupInfo?.pickup_datetime">
                                    <strong>{{ formatDeliveryDate(data.scmPickupInfo.pickup_datetime) }}</strong>
                                </template>
                                <template v-else><strong>-</strong></template>
                            </div>
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
                            <div v-if="!data.soNo && !data.doNo && !data.invoiceNo" class="text-center text-gray-400 py-1">
                                -
                            </div>
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