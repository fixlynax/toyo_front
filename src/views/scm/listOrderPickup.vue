<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Self Order Pickup List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />
            <DataTable
            
                :value="filteredList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['order_no', 'custAccountNo', 'companyName1', 'deliveryType', 'orderstatus']"
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
                            </div>
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

                <Column field="" header="Collector" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div v-if="data.driverInformation">
                            <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                                <div class="flex">
                                    <span>{{ data.driverInformation.driverName }}</span>
                                </div>
                                <div class="flex">
                                    <span>{{ data.driverInformation.driverPhoneNumber }}</span>
                                </div>
                                <div class="flex">
                                    <span>{{ data.driverInformation.driverTruckPlate }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else>Not Assigned</div>
                    </template>
                </Column>

                <Column field="deliveryType" header="Pickup Type" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.deliveryType }}
                    </template>
                </Column>
                <Column field="pickup_datetime" header="Pickup Date" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.driverInformation?.pickup_datetime ? formatDate(data.driverInformation.pickup_datetime) : 'Not Assigned' }}
                    </template>
                </Column>
                <Column field="orderstatus" header="Status" style="min-width: 8rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusLabel2(data.status)" :severity="getStatusSeverity2(data.status)" />
                    </template>
                </Column>
                <Column 
                    v-if="showPickupColumn"
                    field="pickup_datetime" 
                    header="Action" 
                    style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Button 
                                v-if="!data.driverInformation?.pickup_datetime"
                                icon="pi pi-pencil" 
                                class="p-button-sm p-button-text p-button-warning" 
                                @click="confirmUpdatePickup(data)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { RouterLink } from 'vue-router';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue';

const listData = ref([]);
const loading = ref(true);
const selectedRows = ref([]);
const showFilterMenu = ref(false);
const filterStatus = ref(null);
const orderDelList = ref([]);
const filteredList  = ref([]);
const activeTabIndex = ref(0);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showPickupColumn = computed(() => {
    return filteredList.value.some(item => !item.driverInformation?.pickup_datetime);
});

const statusTabs = [
    { label: 'Pending', status: 0  ,code:"PENDING"},
    { label: 'Completed', status: 1 ,code:"COMPLETED" },
];

watch(activeTabIndex, () => {
    filterByTab();
});


const filterByTab = () => {
    const selected = statusTabs[activeTabIndex.value];
    if (!selected) {
        filteredList.value = orderDelList.value;
        return;
    }
    filteredList.value = orderDelList.value.filter(item => (item.status) === selected.code);
};
onMounted(async () => {
    fetchData();
});

const toast = useToast();
const confirmation = useConfirm();

const confirmUpdatePickup = (data) => {
  confirmation.require({
    message: `Do you want to update the pickup for order ${data.order_no} ?`,
    header: 'Update Pickup Date',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: async () => {
      try {
        const payload = new FormData();
        payload.append('orderno', data.order_no);

        const res = await api.post('update-collect-time', payload);

        if (res.data?.status === 1) {
          toast.add({ severity: 'success', summary: 'Updated', detail: 'Pickup date set to now', life: 3000 });
          fetchData(); // refresh table
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
      } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
      }
    },
    reject: () => {
      // optional action on cancel
    }
  });
};


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
            filterByTab();
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
const getStatusLabel2 = (status) => {
    const statusMap = {
        "PENDING": 'Pending',
        // "PENDING": 'Delivery',
        "COMPLETED": 'Completed',
    };
    return statusMap[status] || `Status: ${status}`;
};
const getStatusSeverity2 = (status) => {
    const severityMap = {
        "PENDING": 'info',
        // "PENDING": 'warn',
        "COMPLETED": 'success',
    };
    return severityMap[status] || 'secondary';
};
</script>
