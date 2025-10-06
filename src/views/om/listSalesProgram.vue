<script setup>
import { ListSalesProgramService } from '@/service/listSalesProgram';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

// Status Map
const statusMap = {
    0: { label: 'Inactive', severity: 'danger' },
    1: { label: 'Active', severity: 'success' }
};

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

onBeforeMount(async () => {
    initFilters1();
    listData.value = await ListSalesProgramService.getListSalesProgram();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">List Sales Program</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="programId" :rowHover="true" :loading="loading" :filters="filters1" filterDisplay="menu">
            <!-- Header -->
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

                    <!-- Create Button -->
                    <RouterLink to="/om/createSalesProgram">
                        <Button type="button" label="Add New" icon="pi pi-plus" class="p-button-success" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No sales programs found. </template>
            <template #loading> Loading sales programs data. Please wait. </template>

            <!-- Program ID -->
            <Column field="programId" header="Program ID" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/om/detailSalesProgram" class="hover:underline font-bold">
                        {{ data.programId }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Program Name -->
            <Column field="title" header="Program Name" style="min-width: 12rem" />

            <!-- Period -->
            <Column header="Period" style="min-width: 12rem">
                <template #body="{ data }"> {{ data.startDate }} → {{ data.endDate }} </template>
            </Column>

            <!-- Status -->
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="statusMap[data.status]?.label || 'Unknown'" :severity="statusMap[data.status]?.severity || 'secondary'" />
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
