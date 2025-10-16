<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Return Order</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['returnRequestNo', 'custAccountNo', 'customerName', 'deliveryDate', 'orderStatus']"
        >
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Create Return Order Button -->
                    <RouterLink to="/om/createEten">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No return orders found. </template>
            <template #loading> Loading return orders. Please wait... </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="returnRequestNo" header="Return Req No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/om/detailReturnOrder" class="hover:underline font-bold">
                        {{ data.returnRequestNo }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                </template>
            </Column>
            
            <Column field="customerName" header="Dealer Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.customerName }}
                </template>
            </Column>
            
            <Column field="deliveryDate" header="Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>
            
            <Column field="orderStatus" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag
                        :value="getOverallStatusLabel(data.orderStatus)"
                        :severity="getOverallStatusSeverity(data.orderStatus)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListReturnOrderService } from '@/service/listReturnOrder';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Status map for cleaner handling
const STATUS_MAP = {
    0: { label: 'Pending', severity: 'warn' },
    66: { label: 'Processing', severity: 'info' },
    77: { label: 'Delivery', severity: 'success' },
    1: { label: 'Completed', severity: 'primary' }
};

// =========================
// Helper functions
// =========================
const getOverallStatusSeverity = (status) => {
    return STATUS_MAP[Number(status)]?.severity || 'danger';
};

const getOverallStatusLabel = (status) => {
    return STATUS_MAP[Number(status)]?.label || 'Unknown';
};

// Format date as ISO string (YYYY-MM-DD)
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // keeps only YYYY-MM-DD
};

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListReturnOrderService.getListReturnOrderData();
    loading.value = false;
});
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>