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

// 🟢 Filters
function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Status Map
const statusMap = {
    0: { label: 'Pending', severity: 'warning' },
    66: { label: 'Processing', severity: 'info' },
    77: { label: 'Delivery', severity: 'secondary' },
    1: { label: 'Completed', severity: 'success' },
    99: { label: 'Return Order', severity: 'danger' }
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
                orderArray: order.order_array
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
    fetchOrders(selectedStatus);
});

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters1();
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;
    await fetchOrders(selectedStatus);
});

// 🟢 Computed
const filteredOrders = computed(() => {
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;
    return listData.value.filter((order) => order.orderStatus === selectedStatus);
});

// 🟢 Format Date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error formatting date:', dateString, error);
        return '-';
    }
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Order</div>

        <LoadingPage v-if="loading" :message="'Loading Orders...'" :sub-message="'Fetching your order list'" />

        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

            <DataTable
                :value="filteredOrders"
                :paginator="true"
                :rows="10"
                dataKey="id"
                :rowHover="true"
                :filters="filters1"
                filterDisplay="menu"
                :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipToAccountNo']"
                class="rounded-table"
                sortField="created"
                :sortOrder="-1"
            >
                <template #header>
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
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">No orders found.</div>
                </template>


                <Column field="created" header="Created Date" style="min-width: 4rem">
                    <template #body="{ data }">{{ formatDate(data.created) }}</template>
                </Column>

                <Column header="Order No" style="min-width: 6rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailOrder/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.orderNo || '-' }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 6rem">
                    <template #body="{ data }">{{ data.custAccountNo || '-' }}</template>
                </Column>

                <Column field="companyName" header="Dealer Name" style="min-width: 10rem">
                    <template #body="{ data }">{{ data.companyName || '-' }}</template>
                </Column>

                <Column field="orderType" header="Order Type" style="min-width: 7rem">
                    <template #body="{ data }">
                        <span v-if="data.orderType === 'NORMAL'">Normal</span>
                        <span v-else-if="data.orderType === 'DS'">DS</span>
                        <span v-else-if="data.orderType === 'OWN-USE'">Own-use</span>
                        <span v-else>{{ data.orderType || data.sapOrderType || '-' }}</span>
                    </template>
                </Column>

                <Column field="deliveryType" header="Delivery" style="min-width: 7rem">
                    <template #body="{ data }">
                        <span v-if="data.deliveryType === 'DELIVER'">Deliver</span>
                        <span v-else-if="data.deliveryType === 'PICKUP'">Pickup</span>
                        <span v-else>{{ data.deliveryType || '-' }}</span>
                    </template>
                </Column>

                <Column field="shipToAccountNo" header="Ship To Acc No" style="min-width: 8rem">
                    <template #body="{ data }">{{ data.shipToAccountNo || data.custAccountNo || '-' }}</template>
                </Column>

                <Column header="Delivery Date" style="min-width: 8rem">
                    <template #body="{ data }">{{ formatDate(data.deliveryDate) }}</template>
                </Column>

                <Column header="SAP Ref" style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex flex-col text-sm">
                            <span v-if="[66, 77, 0].includes(data.orderStatus)">
                                SO: <strong>{{ data.soNo || '-' }}</strong> | DO: <strong>{{ data.doNo || '-' }}</strong>
                            </span>
                            <span v-else-if="data.orderStatus === 1">
                                Invoice: <strong>{{ data.invoiceNo || '-' }}</strong>
                            </span>
                            <span v-else-if="data.orderStatus === 99"><strong>Return Order</strong></span>
                            <span v-else>-</span>
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
</style>
