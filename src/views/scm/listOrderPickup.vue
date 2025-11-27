<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Self Order Pickup List</div>

        <LoadingPage v-if="loading" message="Loading Order Delivery Details..." />
        <div v-else>
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />
            <div class="flex items-center gap-3 mb-4 ml-4">
                <!-- LEFT SIDE -->

                    <Calendar
                        v-model="dateRange"
                        selectionMode="range"
                        dateFormat="dd/mm/yy"
                        placeholder="Select date range"
                        style="width: 390px;"
                    />
                    <Button label="Clear" class="p-button-sm p-button-danger" @click="clearDate" />
                    <Button label="Filter" class="p-button-sm" @click="applyFilter" />

            </div>
            <DataTable
            
                :value="orderDelList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['do_no', 'eten_user.custAccountNo', 'eten_user.companyName1', 'eten_user.companyName2', 'eten_user.companyName3', 'eten_user.companyName4', 'eten_user.storageLocation', 'deliveryType', 'orderstatus']"
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

                        </div>

                    </div>
                </template>

                <template #empty> No Order Pickup found. </template>
                <template #loading> Loading Order Pickup data. Please wait. </template>

                <Column field="created" header="Create Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.created) }}
                    </template>
                </Column>

                <Column field="do_no" header="SAP DO No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/scm/detailOrderPickup/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.do_no ? data.do_no : '-'}}
                        </RouterLink>
                    </template>
                </Column>
                <Column field="eten_user.companyName1" header="Customer Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                    <span class="font-bold">{{` ${data.eten_user.companyName1} ${data.eten_user.companyName2} ${data.eten_user.companyName3} ${data.eten_user.companyName4} ` }}</span>
                    <br>
                     {{ data.eten_user.custAccountNo }}
                    </template>
                </Column>
                <Column field="eten_user.storageLocation" header="Storage Location" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{  data.eten_user.storageLocation ? data.eten_user.storageLocation : '-'  }}
                    </template>
                </Column>
                <Column field="driverInformation.driverName" header="Collector" style="min-width: 12rem" sortable>
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
                <Column field="deliveryType" header="Pickup Type" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.deliveryType }}
                    </template>
                </Column>
                <Column field="driverInformation.pickup_datetime" header="Pickup Date" style="min-width: 10rem" sortable>
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
                    v-if="showPickupColumn && canUpdate"
                    field="" 
                    header="Action" 
                    style="min-width: 10rem">
                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Button 
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
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Order Pickup'));
const denyAccess = computed(() => menuStore.canTest('Order Pickup'));

const loading = ref(true);
const orderDelList = ref([]);
const activeTabIndex = ref(0);
const dateRange = ref(null);

const formatDateDMY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const showPickupColumn = computed(() => {
    return orderDelList.value.some(item => !item.driverInformation?.pickup_datetime);
});

const statusTabs = [
    { label: 'Pending',submitLabel: 'PENDING' },
    { label: 'Completed', submitLabel: 'COMPLETED'}
];

watch(activeTabIndex, () => {
    const tab = statusTabs[activeTabIndex.value];
    if (tab.submitLabel === 'COMPLETED') {
        orderDelList.value = [];
        return;
    }
    fetchData();
});

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
const applyFilter = () => {
    const tab = statusTabs[activeTabIndex.value];
    if (tab.submitLabel === 'COMPLETED') {

    // Must have BOTH start & end date
    if (!dateRange.value?.[0] || !dateRange.value?.[1]) {
      // Show message (toast, alert, etc.)
      toast.add({
        severity: 'warn',
        summary: 'Date Range Required',
        detail: 'Please select a full date range for Completed records.',
        life: 3000
      });
      return; // STOP here, do NOT call API
    }
  }
  const dateRangeStr = dateRange.value?.[0] && dateRange.value?.[1]? `${formatDateDMY(dateRange.value[0])} - ${formatDateDMY(dateRange.value[1])}`: null// returns "dd/mm/yyyy - dd/mm/yyyy" or null
  const body = {
    tab: tab.submitLabel,
    date_range: dateRangeStr
  };

  fetchData(body);
};
const clearDate = () => {
  dateRange.value = null; // or []
};
const fetchData = async (body = null) => {
    try {
        loading.value = true;
            const payload = body || {
            tab: statusTabs[activeTabIndex.value].submitLabel
        };
        const response = await api.postExtra('order-pickup/list',payload);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
                    orderDelList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.created) - new Date(a.created);
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            orderDelList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        orderDelList.value = [];
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
