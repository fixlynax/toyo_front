<script setup>
import { ListOrderService } from '@/service/listOrder';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed } from 'vue';

// 🟢 State variables
const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

// 🟢 Initialize filters
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
    99: { label: 'Return Order', severity: 'danger' } // Optional for return handling
};

// 🟢 Tab setup
const statusTabs = [
    { label: 'All', status: null },
    { label: 'Pending', status: 0 },
    { label: 'Processing', status: 66 },
    { label: 'Delivery', status: 77 },
    { label: 'Completed', status: 1 }
];
const activeTabIndex = ref(0);

// 🟢 Fetch data
onBeforeMount(async () => {
    initFilters1();
    listData.value = await ListOrderService.getListOrderData();
    loading.value = false;
});

// 🟢 Filtered Data (based on selected tab)
const filteredOrders = computed(() => {
    const selectedStatus = statusTabs[activeTabIndex.value].status;
    if (selectedStatus === null) return listData.value;
    return listData.value.filter((order) => order.orderStatus === selectedStatus);
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Order</div>

        <!-- 🟢 Status Tab Menu -->
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />

        <!-- 🟢 DataTable -->
        <DataTable :value="filteredOrders" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu">
            <!-- 🟢 Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                </div>
            </template>

            <template #empty> No orders found. </template>
            <template #loading> Loading orders data. Please wait. </template>

            <!-- 🟢 Order Info -->
            <Column header="Order No" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink to="/om/detailOrder" class="hover:underline font-bold">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Dealer Info -->
            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 6rem" />
            <Column field="companyName" header="Dealer Name" style="min-width: 10rem" />

            <!-- 🟢 Order Type -->
            <Column field="orderType" header="Order Type" style="min-width: 7rem">
                <template #body="{ data }">
                    {{ data.orderType === 0 ? 'Normal' : data.orderType === 1 ? 'DS' : data.orderType === 2 ? 'Own-use' : '-' }}
                </template>
            </Column>

            <!-- 🟢 Delivery Method -->
            <Column field="deliveryMethod" header="Delivery" style="min-width: 7rem">
                <template #body="{ data }">
                    {{ data.deliveryMethod === 0 ? 'Deliver' : data.deliveryMethod === 1 ? 'Pickup' : '-' }}
                </template>
            </Column>

            <!-- 🟢 Ship To Account -->
            <Column field="shipToAccountNo" header="Ship To Acc No" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.custAccountNo || '-' }}
                </template>
            </Column>

            <!-- 🟢 Delivery Date -->
            <Column header="Delivery Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.deliveryDate }}
                </template>
            </Column>

            <!-- 🟢 SO / DO / Invoice -->
            <Column header="SAP Ref" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span v-if="data.orderStatus === 66 || data.orderStatus === 77 || data.orderStatus === 0">
                            SO: <strong>{{ data.soNo || '-' }}</strong> | DO: <strong>{{ data.doNo || '-' }}</strong>
                        </span>
                        <span v-else-if="data.orderStatus === 1">
                            Invoice: <strong>{{ data.invoiceNo || '-' }}</strong>
                        </span>
                        <span v-else-if="data.orderStatus === 99"> <strong>Return Order</strong></span>
                        <span v-else>-</span>
                    </div>
                </template>
            </Column>

            <!-- 🟢 Status -->
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="statusMap[data.orderStatus]?.label || 'Unknown'" :severity="statusMap[data.orderStatus]?.severity || 'danger'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
