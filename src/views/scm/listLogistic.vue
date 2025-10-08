<script setup>
import { ref, onBeforeMount } from 'vue';
import { ListLogisticService } from '@/service/listLogistic';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

// State variables
const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

// Initialize filters
function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
        }
    };
}

// Function to determine severity based on status
function getOverallStatusSeverity(status) {
    // status is string "1" or "0"
    return status === '1' ? 'success' : 'danger';
}

// Fetch data when component mounts
onBeforeMount(async () => {
    initFilters1();
    listData.value = await ListLogisticService.getListLogisticData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Logistic</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="orderNo" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu">
            <!-- Header Slot -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search & Settings -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                    <!-- Create Button -->
                    <RouterLink to="/om/createEten">
                        <Button label="Create" type="button" />
                    </RouterLink>
                </div>
            </template>

            <!-- Empty & Loading slots -->
            <template #empty>No orders found.</template>
            <template #loading>Loading orders data. Please wait.</template>

            <!-- Company Name Column -->
            <Column header="Company Name" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailLogistic" class="hover:underline font-bold">
                        {{ data.companyName }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Status Column with Tag -->
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === '1' ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
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
