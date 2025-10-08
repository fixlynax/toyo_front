<script setup>
import { ref, onBeforeMount } from 'vue';
import { BillingService } from '@/service/ListBilling';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const listData = ref([]);
const filters = ref(null);
const loading = ref(true);

onBeforeMount(async () => {
    listData.value = await BillingService.getBillingList();
    initFilters();
    loading.value = false;
});

function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        dealerId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}
</script>

<template>
    <div class="card">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Account Details</div>

        <!-- Data Table -->
        <DataTable :value="listData" :loading="loading" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :filters="filters" responsiveLayout="scroll">
            <!-- Header -->
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-4 w-full">
                    <IconField class="flex-1 max-w-md">
                        <InputIcon><i class="pi pi-search" /></InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                    </IconField>
                    <Button icon="pi pi-cog" class="p-button" />
                </div>
            </template>

            <!-- States -->
            <template #empty>No billing records found.</template>
            <template #loading>Loading billing data, please wait...</template>

            <!-- Columns -->
            <Column field="docsDate" header="Document DateTime" style="min-width: 12rem" />
            <Column field="company" header="Company" style="min-width: 8rem" />
            <Column field="dealerId" header="Dealer ID" class="font-semibold" style="min-width: 8rem" />
            <Column field="dealerName" header="Dealer Name" style="min-width: 14rem" />

            <!-- Amount Due -->
            <Column field="amtdue" header="Amount Due (RM)" style="min-width: 10rem; text-align: right">
                <template #body="{ data }">
                    <div class="flex justify-between items-center w-full">
                        <span class="text-gray-600">RM</span>
                        <span class="font-semibold text-right min-w-[6rem]" :class="data.amtdue < 0 ? 'text-red-500' : 'text-gray-800'">
                            {{ data.amtdue }}
                        </span>
                    </div>
                </template>
            </Column>

            <!-- Download -->
            <Column header="Download" style="min-width: 6rem; text-align: center">
                <template #body="{ data }">
                    <Button icon="pi pi-download" class="p-button-sm" :severity="data.download ? 'success' : 'secondary'" :disabled="!data.download" v-tooltip.top="data.download ? 'Download Available' : 'Not Ready'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
