<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- HEADER -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center gap-2 border-b pb-2 mb-4">
                    <RouterLink to="/scm/returnCollection">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                    </RouterLink>
                    <div class="text-2xl font-bold text-gray-800">CTC Return Details</div>
                </div>

                <!-- CUSTOMER INFO -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div class="md:col-span-2">
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div class="md:col-span-2 mb-4">
                                <span class="block text-sm font-bold text-gray-800">Ref No</span>
                                <p class="font-medium font-semibold text-lg">{{ listData.claim?.claim_ref_no }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Description</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.description }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Pattern</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.pattern }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Plate Serial</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.plateSerial }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Tyre Size</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.tyresize }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Code</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.weekcode || '-' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card flex flex-col w-full">
                <div class="flex items-center gap-2 border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                </div>

                <!-- CUSTOMER INFO -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div class="md:col-span-2">
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div class="md:col-span-2 mb-4">
                                <span class="block text-sm font-bold text-black-700">Company Name</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.companyName1 }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Acc No</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.custAccountNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Email</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.emailAddress }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Phone Number</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.phoneNumber }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Address</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.address }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Pickup Information</div>
                    <Tag :value="getStatusText(listData.status)" :severity="getStatusSeverity(listData.status)" />
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-bold">Delivery Date</td>
                                <td class="px-4 py-2 text-right">{{ listData.scheduleDeliveryDate ? formatDate(listData.scheduleDeliveryDate) : 'Not Assigned' }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-bold">Delivered  Date</td>
                                <td class="px-4 py-2 text-right">{{ listData.deliveryDate ? formatDate(listData.deliveryDate) : 'Not Assigned'}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div  class="flex justify-end mt-3">
                <Button v-if="listData.status === 0 && canUpdate"
                    label="Update Delivery"
                    icon="pi pi-calendar"
                    class="p-button-sm p-button-warning"
                    @click="showScheduleModal = true"
                />
                <Button v-if="listData.status === 1 && canUpdate"
                    label="Update Delivered"
                    icon="pi pi-truck"
                    class="p-button-sm p-button-info"
                    @click="showDeliveredModal = true"
                />
            </div>
            </div>
        </div>
    </div>
    <Dialog
        header="Update Schedule Warranty Return"
        v-model:visible="showScheduleModal"
        modal
        :style="{ width: '400px' }"
    >
        <div class="flex flex-col gap-4">
            <input type="hidden" v-model="form2.warrantyno" />
            <div>
                <label class="font-medium">Schedule Date</label>
                <InputText
                    type="date"
                    v-model="form.scheduledata"
                    class="w-full mt-1"
                />
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <Button label="Cancel" class="p-button-text" @click="showScheduleModal = false" />
                <Button label="Save" class="p-button-success" :loading="loadingSchedule" @click="updateSchedule" />
            </div>

        </div>
    </Dialog>
    <Dialog
        header="Update Delivered Warranty Return"
        v-model:visible="showDeliveredModal"
        modal
        :style="{ width: '400px' }"
    >
        <div class="flex flex-col gap-4">
            <input type="hidden" v-model="form2.warrantyno" />
            <div>
                <label class="font-medium">Delivered Date</label>
                <InputText
                    type="date"
                    v-model="form2.delivereddate"
                    class="w-full mt-1"
                />
            </div>

            <!-- <div>
                <label class="font-medium">Delivered Time</label>
                <InputText
                    type="time"
                    v-model="form2.deliveredtime"
                    class="w-full mt-1"
                />
            </div> -->

            <div class="flex justify-end gap-2 mt-4">
                <Button label="Cancel" class="p-button-text" @click="showDeliveredModal = false" />
                <Button label="Save" class="p-button-success" :loading="loadingDelivered" @click="updateDelivered" />
            </div>

        </div>
    </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('CTC Return'));
const denyAccess = computed(() => menuStore.canTest('CTC Return'));
const route = useRoute();
const listData = ref([]);
const loading = ref(true);
const toast =useToast();
const showScheduleModal = ref(false);
const loadingSchedule = ref(false);
defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});
const form = ref({
    warrantyno: '',
    scheduledata: '' // user selects date
});

const updateSchedule = async () => {
    if (!form.value.scheduledata) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a date', life: 3000 });
        return;
    }
    loadingSchedule.value = true;

    try {
        const payload = new FormData();
        payload.append('warrantyno', form.value.warrantyno);
        payload.append('scheduledate', form.value.scheduledata);
        const res = await api.post('update-schedule-warranty', payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Schedule updated successfully', life: 3000 });
            showScheduleModal.value = false;
            // optionally reload details
            await fetchData();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        loadingSchedule.value = false;
    }
};

const showDeliveredModal = ref(false);
const loadingDelivered = ref(false);

const form2 = ref({
    warrantyno: '', // prefill from your data
    delivereddate: '',
    // deliveredtime: ''
});

const updateDelivered = async () => {
    if (!form2.value.delivereddate) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
        return;
    }

    loadingDelivered.value = true;

    try {
        const payload = new FormData();
        payload.append('warrantyno', form2.value.warrantyno);
        payload.append('delivereddate', form2.value.delivereddate);

        const res = await api.post('update-delivered-warranty', payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Delivered info updated', life: 3000 });
            showDeliveredModal.value = false;
            // optionally reload details
            await fetchData();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: 'API error', life: 3000 });
    } finally {
        loadingDelivered.value = false;
    }
};

const fetchData = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`return/detail/${id}`);
        if ( (response.data.admin_data)) {
            listData.value = response.data.admin_data;
            form.value.warrantyno = listData.value.claim?.claim_ref_no || '';
            form2.value.warrantyno = listData.value.claim?.claim_ref_no || '';
        } else {
            console.error('API returned error or invalid data:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching data list:', error);
        listData.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
}
onMounted(async () => {
    fetchData();
});

function getStatusSeverity(status) {
    const severityMap = {
        0: 'warning',
        1: 'info',
        2: 'success',
    };
    return severityMap[status] || 'secondary';
}

function getStatusText(status) {
    const statusMap = {
        0: 'New',
        1: 'Pending',
        2: 'Completed'
    };
    return statusMap[status] || 'Unknown';
}
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
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
