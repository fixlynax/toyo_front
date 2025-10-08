<script setup>
import { ListCollectionService } from '@/service/ListCollection';
// import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

// const filters1 = ref(null);
// const loading1 = ref(null);
// const expandedRows = ref([]);

// onBeforeMount(() => {
//     ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
//     CustomerService.getCustomersLarge().then((data) => {
//         customers1.value = data;
//         loading1.value = false;
//         customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
//     });
//     CustomerService.getCustomersLarge().then((data) => (customers2.value = data));
//     CustomerService.getCustomersMedium().then((data) => (customers3.value = data));

//     initFilters1();
// });

// function initFilters1() {
//     filters1.value = {
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//         balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
//         verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     };
// }

// Function to get severity for overall status
function getOverallStatusSeverity(status) {
    return status === 1 ? 'warn' : 'success';
}

const listData = ref([]);
const loading = ref(true);

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListCollectionService.getListCollectionData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Collection</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Add eTEN Button -->
                    <RouterLink to="/scm/createCollection">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No Collection found. </template>
            <template #loading> Loading News data. Please wait. </template>
            <!-- Columns -->
            <Column field="ref" header="Ref No." style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailCollection" class="hover:underline font-bold">
                        {{ data.collectRef }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="dealerName" header="Dealer" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.dealerName }} </template>
            </Column>
            <Column field="location" header="Location" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.dealerLoc }}
                </template>
            </Column>
            <Column field="collectDate" header="Collection Date" style="min-width: 6rem">
                <template #body="{ data }"> {{ data.collectDate }} {{ data.collectTime }} </template>
            </Column>
            <Column field="totalTire" header="Total Tires" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.totalTire }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Pending' : 'Completed'" :severity="getOverallStatusSeverity(data.status)" />
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
