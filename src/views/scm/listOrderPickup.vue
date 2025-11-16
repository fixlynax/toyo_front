<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Self Order Pickup List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <DataTable
            
                :value="filteredListfunc()"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['order_no', 'custAccountNo', 'companyName1', 'orderDesc', 'phoneNumber', 'orderstatus']"
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

                <template #empty> No Order Pickup found. </template>
                <template #loading> Loading Order Pickup data. Please wait. </template>

                <Column field="created" header="Create Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.created) }}
                    </template>
                </Column>

                <Column field="order_no" header="Order No" style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailOrderPickup/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.order_no }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="custAccountNo" header="Customer Acc No." style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.eten_user.custAccountNo }}
                    </template>
                </Column>

                <Column field="companyName1" header="Customer Name" style="min-width: 12rem">
                    <template #body="{ data }">
                    {{` ${data.eten_user.companyName1} ${data.eten_user.companyName2} ${data.eten_user.companyName3} ${data.eten_user.companyName4} ` }}
                    </template>
                </Column>

                <Column field="addressLine1" header="Collection Address" style="min-width: 12rem">
                    <template #body="{ data }">
                         {{` ${data.eten_user.addressLine1} ${data.eten_user.addressLine2} ${data.eten_user.addressLine3} ${data.eten_user.addressLine4}, ${data.eten_user.city} ${data.eten_user.postcode} ${data.eten_user.state} ` }}
                    </template>
                </Column>

                <Column field="orderDesc" header="Order Type" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.orderDesc }}
                    </template>
                </Column>

                <Column field="phoneNumber" header="Contact" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.eten_user.phoneNumber || '-' }}
                    </template>
                </Column>


                <Column field="pickupDatetime" header="Pickup Date" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.pickupDatetime }}
                    </template>
                </Column>

                <Column field="collectedDatetime" header="Delivery Date" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.collectedDatetime }}
                    </template>
                </Column>

                <Column field="orderstatus" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusLabel(data.orderstatus)" :severity="getStatusSeverity(data.orderstatus)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { RouterLink } from 'vue-router';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const listData = ref([]);
const loading = ref(true);
const selectedRows = ref([]);
const showFilterMenu = ref(false);
const filterStatus = ref(null);
const orderDelList = ref([]);
const filteredList  = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
function filteredListfunc() {
    if (filterStatus.value === null) return orderDelList.value;
    return orderDelList.value.filter((x) => x.orderstatus === filterStatus.value);
}

onMounted(async () => {
    fetchData();
});

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    }
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    }
function formatDateFull(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    }
const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('order-pickup/list');
        console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
                    orderDelList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            orderDelList.value = [];
            filteredList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        orderDelList.value = [];
        filteredList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};


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
