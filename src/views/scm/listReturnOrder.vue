<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Return Order List</div>
        <DataTable :value="filteredReturns" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" filterDisplay="menu" :filters="filters" @filter="onFilter">
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Search and Filters Row -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Left: Search Field -->
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>
                    </div>
                </div>
            </template>

            <template #empty> No return orders found. </template>
            <template #loading> Loading return orders data. Please wait. </template>

            <!-- Columns -->
            <Column field="deliveryDate" header="Order Date" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>
            <Column field="returnRequestNo" header="Return Order No" style="min-width: 10rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailReturnOrder" class="hover:underline font-bold">
                        {{ data.returnRequestNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="customerName" header="Dealer" style="min-width: 12rem" />
            <Column field="location" header="Location" style="min-width: 12rem" />
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.orderStatus)" :severity="getStatusSeverity(data.orderStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { ListReturnOrderService } from '@/service/listReturnOrder';
import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';

const returns = ref([]);
const loading = ref(true);
const dateRange = ref(null);
const today = new Date();

const statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Completed', value: 1 },
    { label: 'Processing', value: 66 },
    { label: 'Delivery', value: 77 }
];

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const filteredReturns = computed(() => {
    let filtered = returns.value;

    // Global search
    if (filters.value.global.value) {
        const search = filters.value.global.value.toLowerCase();
        filtered = filtered.filter(order =>
            order.returnRequestNo.toLowerCase().includes(search) ||
            (order.orderNo && order.orderNo.toLowerCase().includes(search)) ||
            order.customerName.toLowerCase().includes(search) ||
            order.shipTo.toLowerCase().includes(search) ||
            getStatusLabel(order.orderStatus).toLowerCase().includes(search)
        );
    }

    return filtered;
});

onBeforeMount(async () => {
    try {
        returns.value = await ListReturnOrderService.getListReturnOrder();
    } catch (error) {
        console.error('Error loading return orders:', error);
        returns.value = [];
    } finally {
        loading.value = false;
    }
});

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
}

function getStatusLabel(status) {
    switch (status) {
        case 0: return 'Pending';
        case 1: return 'Completed';
        case 66: return 'Processing';
        case 77: return 'Delivery';
        default: return 'Unknown';
    }
}

function getStatusSeverity(status) {
    switch (status) {
        case 0: return 'warn';
        case 1: return 'success';
        case 66: return 'info';
        case 77: return 'primary';
        default: return 'secondary';
    }
}

function onFilter() {
    // Trigger recompute - handled automatically by computed property
}
</script>