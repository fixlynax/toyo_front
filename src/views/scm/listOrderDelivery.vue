<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Delivery List</div>

        <DataTable
            v-model:selection="selectedRows"
            selectionMode="checkbox"
            :value="filteredOrders"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipTo', 'deliveryType', 'deliveryDate', 'orderStatus']"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>

                        <div class="relative">
                            <Button type="button" icon="pi pi-cog" class="p-button" @click="showFilterMenu = !showFilterMenu" />
                            <div v-if="showFilterMenu" class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 z-10">
                                <div
                                    class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                    :class="{ 'bg-gray-200': filterStatus === null }"
                                    @click="
                                        filterStatus = null;
                                        showFilterMenu = false;
                                    "
                                >
                                    <i class="pi pi-list text-gray-600"></i>
                                    <span>All</span>
                                </div>

                                <div
                                    class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                    :class="{ 'bg-gray-200': filterStatus === 0 }"
                                    @click="
                                        filterStatus = 0;
                                        showFilterMenu = false;
                                    "
                                >
                                    <i class="pi pi-clock text-yellow-500"></i>
                                    <span>Pending</span>
                                </div>

                                <div
                                    class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                    :class="{ 'bg-gray-200': filterStatus === 1 }"
                                    @click="
                                        filterStatus = 1;
                                        showFilterMenu = false;
                                    "
                                >
                                    <i class="pi pi-check text-green-500"></i>
                                    <span>Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2">
                        <Button type="button" label="Bulk Update" icon="pi pi-upload" />
                    </div>
                </div>
            </template>

            <template #empty> No Order Delivery found. </template>
            <template #loading> Loading Order Delivery data. Please wait. </template>

            <Column field="created" header="Create Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.created) }}
                </template>
            </Column>

            <Column field="orderNo" header="Order No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailOrderDelivery" class="hover:underline font-bold text-primary">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="custAccountNo" header="Customer Acc No." style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                </template>
            </Column>

            <Column field="companyName" header="Customer Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.companyName }}
                </template>
            </Column>

            <Column field="shipTo" header="Collection Address" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.shipTo }}
                </template>
            </Column>

            <Column field="orderType" header="Order Type" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ getOrderTypeLabel(data.orderType, data.deliveryMethod, data.containerSize) }}
                </template>
            </Column>

            <Column field="contactNo" header="Contact" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.contactNo || '-' }}
                </template>
            </Column>

            <Column field="company3PL" header="3PL" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.company3PL }}
                </template>
            </Column>

            <Column field="pickupDatetime" header="Pickup Datetime" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.pickupDatetime }}
                </template>
            </Column>

            <Column field="collectedDatetime" header="Collected Datetime" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.collectedDatetime }}
                </template>
            </Column>

            <Column field="totalPcs" header="Total Pcs" style="min-width: 6rem; text-align: center">
                <template #body="{ data }">
                    {{ data.totalPcs }}
                </template>
            </Column>

            <Column field="orderStatus" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.orderStatus)" :severity="getStatusSeverity(data.orderStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { ListOrderService } from '@/service/listOrder';
import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import { RouterLink } from 'vue-router';

const listData = ref([]);
const loading = ref(true);
const selectedRows = ref([]);
const showFilterMenu = ref(false);
const filterStatus = ref(null);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Only Delivery orders (deliveryMethod = 0)
const filteredOrders = computed(() => {
    let data = listData.value.filter((x) => x.deliveryMethod === 0);

    if (filterStatus.value !== null) {
        data = data.filter((x) => x.orderStatus === filterStatus.value);
    }

    if (filters.value.global.value) {
        const search = filters.value.global.value.toLowerCase();
        data = data.filter((order) => order.orderNo.toLowerCase().includes(search) || order.companyName.toLowerCase().includes(search) || order.shipTo.toLowerCase().includes(search));
    }
    return data;
});

onBeforeMount(async () => {
    listData.value = await ListOrderService.getListOrder();
    loading.value = false;
});

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
}

// Order Type Display Logic
function getOrderTypeLabel(orderType, deliveryMethod, containerSize) {
    if (deliveryMethod !== 0) return '-';
    switch (orderType) {
        case 1:
            return 'Normal';
        case 2:
            return containerSize ? `Direct Shipping ${containerSize}` : 'Direct Shipping';
        case 3:
            return 'Own-used';
        default:
            return '-';
    }
}

// Status Label and Severity
function getStatusLabel(status) {
    const map = {
        0: 'Pending',
        1: 'Completed',
        66: 'Processing',
        77: 'Delivery'
    };
    return map[status] || 'Unknown';
}

function getStatusSeverity(status) {
    const map = {
        0: 'warn',
        1: 'success',
        66: 'info',
        77: 'primary'
    };
    return map[status] || 'secondary';
}
</script>
