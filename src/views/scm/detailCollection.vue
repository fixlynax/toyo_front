<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- HEADER -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center gap-2 border-b pb-2 mb-4">
                    <RouterLink to="/scm/listCollection">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                    </RouterLink>
                    <div class="text-2xl font-bold text-gray-800">CTC Collection Details</div>
                </div>

                <!-- CUSTOMER INFO -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                    <div class="md:col-span-2">
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                            <div class="md:col-span-2 mb-4">
                                <span class="block text-sm font-semibold text-gray-800">Ref No</span>
                                <p class="font-medium font-semibold text-primary text-lg">{{ listData.claim?.claim_ref_no }}</p>
                            </div>
                             <div>
                            <span class="block text-sm text-gray-800">Description</span>
                             <p class="font-medium text-lg">{{ listData.claim?.tire?.description }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-gray-800">Pattern</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.pattern }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-gray-800">Plate Serial</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.plateSerial }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-gray-800">Tyre Size</span>
                                <p class="font-medium text-lg">{{ listData.claim?.tire?.tyresize }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-gray-800">Code</span>
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
                                <span class="block text-sm text-black-700">Company Name</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.companyName1 }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-black-700">Acc No</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.custAccountNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-black-700">Email</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.emailAddress }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-black-700">Phone Number</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.phoneNumber }}</p>
                            </div>
                            <div>
                                <span class="block text-sm text-black-700">Address</span>
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
                                <td class="px-4 py-2">Collect Date</td>
                                <td class="px-4 py-2 text-right">{{ listData.collectDate ? formatDate(listData.collectDate): 'Not Assigned'}}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2">Receive Date</td>
                                <td class="px-4 py-2 text-right">{{ listData.reachWH ? formatDate(listData.reachWH) : 'Not Assigned' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="(listData.status === 0 || listData.status === 1) && canUpdate" class="flex justify-end mt-3">
                    <Button 
                        label="Update Date" 
                        icon="pi pi-pencil"
                        class="p-button-warning p-button-sm"
                        @click="showUpdateModal = true"
                    />
                </div>
            </div>
        </div>
    </div>
    <Dialog 
        header="Update CTC Collection Details" 
        v-model:visible="showUpdateModal" 
        modal 
        :style="{ width: '400px' }"
    >
        <div class="flex flex-col gap-4">
            
            <div v-if="listData.status === 0"  >
                <label class="font-medium">Collect Date</label>
                <InputText 
                    type="date" 
                    v-model="form.collectDatetime"
                    class="w-full mt-1"
                />
            </div>

            <div v-if="listData.status === 1"  >
                <label class="font-medium">Reach WH Date</label>
                <InputText 
                    type="date" 
                    v-model="form.reachWHDatetime"
                    class="w-full mt-1"
                />
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <Button label="Cancel" class="p-button-text" @click="showUpdateModal = false" />
                <Button label="Save" class="p-button-success" @click="updateCTCDetails" :loading="loadingUpdate" />
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
defineProps({
  id: {
    type: [String, Number],
    required: false
  }
});
const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('CTC Collection'));

const route = useRoute();
const listData = ref([]);
const loading = ref(true);
const toast = useToast();
const showUpdateModal = ref(false);
const loadingUpdate = ref(false);

const form = ref({
    collectDatetime: '',
    reachWHDatetime: ''
});

function toLocalDateTimeString(dt) {
    if (!dt) return null;
    const d = new Date(dt);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const updateCTCDetails = async () => {
    if (!form.value.collectDatetime && !form.value.reachWHDatetime) {
    toast.add({ severity: 'warn', summary: 'Warning', detail: 'Please select date', life: 3000 });
    return;
  }
    loadingUpdate.value = true;
    const id = route.params.id
    try {
        const payload = new FormData();
        payload.append('ctcID', id);
        payload.append('collectDatetime',form.value.collectDatetime ? toLocalDateTimeString(form.value.collectDatetime): '');
        payload.append('reachWHDatetime', form.value.reachWHDatetime? toLocalDateTimeString(form.value.reachWHDatetime): '');

        const res = await api.post('collection/updateCTC', payload);

        if (res.data?.status === 1) {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'CTC details updated', life: 3000 });
            showUpdateModal.value = false;

            // optionally reload data
            await fetchData();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed to update ctc details', life: 3000 });
        }
    } catch (err) {
        console.error(err);
        toast.add({ severity: 'error', summary: 'Error', detail: res.data?.message || 'Failed to update ctc details', life: 3000 });
    } finally {
        loadingUpdate.value = false;
    }
};

const fetchData = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`collection/detail/${id}`);
        if ( (response.data.admin_data)) {
            listData.value = response.data.admin_data;
        } else {
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
function formatTime(dateTimeString) {
    if (!dateTimeString) return '';
    const [, timePart] = dateTimeString.split(' ');
    if (!timePart) return '';

    let [hours, minutes, seconds] = timePart.split(':');
    hours = parseInt(hours, 10);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
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
