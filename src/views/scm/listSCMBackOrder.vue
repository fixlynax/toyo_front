<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Back Order</div>

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
            :globalFilterFields="['custAccountNo', 'customerName', 'deliveryDate', 'expiry', 'orderStatus']"
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
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No back orders found. </template>
            <template #loading> Loading back orders data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailSCMBackOrder" class="hover:underline font-bold text-primary-400">
                        {{ data.custAccountNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="customerName" header="Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.customerName }}
                </template>
            </Column>

            <Column field="deliveryDate" header="Order Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.deliveryDate }}
                </template>
            </Column>

            <Column field="expiry" header="Back Order Expiry" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.expiry }}
                </template>
            </Column>

            <Column field="orderStatus" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.orderStatus === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.orderStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListBackOrderService } from '@/service/ListBackOrder';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListBackOrderService.getListBackOrderData();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
