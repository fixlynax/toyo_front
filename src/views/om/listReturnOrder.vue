<script setup>
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';
import { ListReturnOrderService } from '@/service/ListReturnOrder';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const customers1 = ref(null);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const products = ref(null);
const expandedRows = ref([]);

onBeforeMount(() => {
    ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    CustomerService.getCustomersLarge().then((data) => {
        customers1.value = data;
        loading1.value = false;
        customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    CustomerService.getCustomersLarge().then((data) => (customers2.value = data));
    CustomerService.getCustomersMedium().then((data) => (customers3.value = data));

    initFilters1();
});

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
}

// Status map for cleaner handling
const STATUS_MAP = {
    0: { label: 'Pending', severity: 'warn' },
    66: { label: 'Processing', severity: 'info' },
    77: { label: 'Delivery', severity: 'success' },
    1: { label: 'Completed', severity: 'primary' }
};

function getOverallStatusSeverity(status) {
    return STATUS_MAP[Number(status)]?.severity || 'danger';
}

function getOverallStatusLabel(status) {
    return STATUS_MAP[Number(status)]?.label || 'Unknown';
}

// Format date as ISO string (YYYY-MM-DD)
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // keeps only YYYY-MM-DD
}

const listData = ref([]);
const loading = ref(true);

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListReturnOrderService.getListReturnOrderData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Return Order</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Add eTEN Button -->
                    <RouterLink to="/om/createEten">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No return orders found. </template>
            <template #loading> Loading return orders. Please wait... </template>

            <!-- Columns -->
            <Column field="returnRequestNo" header="Return Req No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/om/detailReturnOrder" class="hover:underline font-bold">
                        {{ data.returnRequestNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.custAccountNo }} </template>
            </Column>
            <Column field="customerName" header="Dealer Name" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.customerName }} </template>
            </Column>
            <Column header="Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 8rem">
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

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
