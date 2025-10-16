<script setup>
import { onBeforeMount, ref } from 'vue';
import { BillingService } from '@/service/ListBilling';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const filters1 = ref(null);
const listData = ref([]);
const loading = ref(true);

onBeforeMount(async () => {
    listData.value = await BillingService.getBillingList();
    loading.value = false;
    initFilters1();
});

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        docsNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Other</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters1">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
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

            <template #empty> No Billing found. </template>
            <template #loading> Loading billing data. Please wait. </template>

            <Column field="docsDate" header="Document Date" style="min-width: 8rem">
                <template #body="{ data }">{{ data.docsDate }}</template>
            </Column>
            <Column field="docsNo" header="Document No" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.docsNo }}
                </template>
            </Column>

            <!-- <Column field="docsType" header="Type" style="min-width: 8rem">
                <template #body="{ data }">{{ data.docsType }}</template>
            </Column> -->

            <Column field="referenceDocsNo" header="Reference Doc" style="min-width: 8rem">
                <template #body="{ data }">{{ data.referenceDocsNo }}</template>
            </Column>

            <Column field="dealerName" header="Dealer Name" style="min-width: 10rem">
                <template #body="{ data }">{{ data.dealerName }}</template>
            </Column>

            <Column header="Download" style="min-width: 6rem; text-align: center">
                <template #body="{ data }">
                    <Button icon="pi pi-download" class="p-button-sm" :severity="data.download ? 'success' : 'secondary'" :disabled="!data.download" v-tooltip.top="data.download ? 'Download Available' : 'Not Ready'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
