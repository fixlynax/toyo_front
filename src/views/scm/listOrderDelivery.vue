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

                        <!-- Right: Filters -->
                        <div class="flex items-center gap-2">
                            <Calendar v-model="dateRange" selectionMode="range" placeholder="Date Range" dateFormat="yy-mm-dd" :maxDate="today" class="w-48" />
                            <InputText v-model="filters.orderNo.value" placeholder="Order No" class="w-32" />
                            <InputText v-model="filters.dealer.value" placeholder="Dealer" class="w-32" />
                            <InputText v-model="filters.location.value" placeholder="Location" class="w-32" />
                            <Dropdown v-model="filters.status.value" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Status" class="w-32" />
                            <Dropdown v-model="filters.deliveryType.value" :options="deliveryTypeOptions" optionLabel="label" optionValue="value" placeholder="Delivery Type" class="w-40" />
                        </div>
                    </div>
                </div>
            </template>

            <template #empty> No orders found. </template>
            <template #loading> Loading orders data. Please wait. </template>

            <!-- Columns -->
            <Column field="deliveryDate" header="Order Date" dataType="date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>
            <Column field="orderNo" header="Order No" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <RouterLink to="/scm/detailOrderDelivery" class="hover:underline font-bold">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="companyName" header="Dealer" style="min-width: 12rem" sortable />
            <Column field="shipTo" header="Location" style="min-width: 10rem" sortable />
            <Column field="deliveryType" header="Delivery Type" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ getDeliveryTypeLabel(data.deliveryType) }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 8rem" sortable>
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
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';

const orders = ref([]);
const loading = ref(true);
const dateRange = ref(null);
const today = new Date();

const statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Completed', value: 1 },
    { label: 'Processing', value: 66 },
    { label: 'Delivery', value: 77 }
];

const deliveryTypeOptions = [
    { label: 'Deliver', value: 'DELIVER' },
    { label: 'Pickup', value: 'SELFCOLLECT' },
    { label: 'Lalamove', value: 'LALAMOVE' }
];

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    orderNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealer: { value: null, matchMode: FilterMatchMode.CONTAINS },
    location: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    deliveryType: { value: null, matchMode: FilterMatchMode.EQUALS }
});

const filteredOrders = computed(() => {
    let filtered = orders.value;

    // Date range filter
    if (dateRange.value && dateRange.value.length === 2) {
        const [start, end] = dateRange.value;
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.deliveryDate);
            return orderDate >= start && orderDate <= end;
        });
    }

    // Other filters
    if (filters.value.orderNo.value) {
        filtered = filtered.filter(order => order.orderNo.toLowerCase().includes(filters.value.orderNo.value.toLowerCase()));
    }
    if (filters.value.dealer.value) {
        filtered = filtered.filter(order => order.companyName.toLowerCase().includes(filters.value.dealer.value.toLowerCase()));
    }
    if (filters.value.location.value) {
        filtered = filtered.filter(order => order.shipTo.toLowerCase().includes(filters.value.location.value.toLowerCase()));
    }
    if (filters.value.status.value !== null) {
        filtered = filtered.filter(order => order.orderStatus === filters.value.status.value);
    }
    if (filters.value.deliveryType.value) {
        filtered = filtered.filter(order => order.deliveryType === filters.value.deliveryType.value);
    }

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
