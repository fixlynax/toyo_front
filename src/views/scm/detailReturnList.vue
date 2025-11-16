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
                                <span class="block text-sm font-bold text-gray-800">Tire Size</span>
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
                                <span class="block text-sm font-bold text-gray-800">Company Name</span>
                                <p class="font-medium font-semibold text-lg">{{ listData.dealer?.companyName1 }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Acc No</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.custAccountNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Email</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.emailAddress }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Phone Number</span>
                                <p class="font-medium text-lg">{{ listData.dealer?.phoneNumber }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-800">Address</span>
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
                                <td class="px-4 py-2 font-medium">Collect Date</td>
                                <td class="px-4 py-2 text-right">{{ listData.collectDate && listData.collectTime ? formatDate(listData.collectDate) + ' ' + formatTime(listData.collectTime): 'Not Assigned'}}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Receive Date</td>
                                <td class="px-4 py-2 text-right">{{ listData.reachWH ? formatDate(listData.reachWH) : 'Not Assigned' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const listData = ref([]);
const loading = ref(true);

const fetchData = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`return/detail/${id}`);
        if ( (response.data.admin_data)) {
            listData.value = response.data.admin_data;
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
