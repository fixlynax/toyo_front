<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Delivery List</div>
        <DataTable :value="filteredOrders" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" filterDisplay="menu" :filters="filters" @filter="onFilter">
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

            <template #empty> No orders found. </template>
            <template #loading> Loading orders data. Please wait. </template>

            <!-- Columns -->
            <Column field="orderNo" header="Order No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailOrderDelivery" class="hover:underline font-bold">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="deliveryDate" header="Order Date" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>
            <Column field="deliveryType" header="Delivery Type" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ getDeliveryTypeLabel(data.deliveryType) }}
                </template>
            </Column>
            <Column field="shipTo" header="Location" style="min-width: 10rem" />
            <Column field="companyName" header="Dealer" style="min-width: 12rem" />
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.orderStatus)" :severity="getStatusSeverity(data.orderStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue';
import { ListOrderService } from '@/service/listOrder';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';

const orders = ref([]);
const loading = ref(true);


const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    deliveryType: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const filteredOrders = computed(() => {
    let filtered = orders.value;

    // Global search
    if (filters.value.global.value) {
        const search = filters.value.global.value.toLowerCase();
        filtered = filtered.filter(order =>
            order.orderNo.toLowerCase().includes(search) ||
            order.companyName.toLowerCase().includes(search) ||
            order.shipTo.toLowerCase().includes(search) ||
            getDeliveryTypeLabel(order.deliveryType).toLowerCase().includes(search) ||
            getStatusLabel(order.orderStatus).toLowerCase().includes(search)
        );
    }

    return filtered;
});

onBeforeMount(async () => {
    orders.value = await ListOrderService.getListOrder();
    loading.value = false;
});

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function getDeliveryTypeLabel(type) {
    switch (type) {
        case 'DELIVER': return 'Deliver';
        case 'SELFCOLLECT': return 'Pickup';
        case 'LALAMOVE': return 'Lalamove';
        default: return type;
    }
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
    // Trigger recompute
}
</script>