<script setup>
import { ListOrderService } from '@/service/listOrder';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// Status Map
const statusMap = {
    0: { label: 'Pending', severity: 'warning' },
    66: { label: 'Processing', severity: 'info' },
    77: { label: 'Delivery', severity: 'secondary' },
    1: { label: 'Completed', severity: 'success' }
};

// Fetch data
onBeforeMount(async () => {
    initFilters1();
    listData.value = await ListOrderService.getListOrderData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Order</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu" q>
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search -->
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

            <!-- Order No -->
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

            <!-- Delivery Date -->
            <Column header="Delivery Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.deliveryDate }}
                </template>
            </Column>

            <!-- Status -->
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
