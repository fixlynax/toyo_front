<script setup>
import { ref, onBeforeMount } from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';

const listData = ref([]);
const loading = ref(true);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const selectedRows = ref([]);
const filterStatus = ref(null);
const showFilterMenu = ref(false);

function getStatusSeverity(status) {
    const severityMap = {
        0: 'secondary',
        1: 'info',
        2: 'danger',
        3: 'warning',
        4: 'warning',
        5: 'success',
        6: 'danger',
        9: 'secondary'
    };
    return severityMap[status] || 'secondary';
}

function getStatusText(status) {
    const statusMap = {
        0: 'Pending',
        1: 'ETEN Approved',
        2: 'ETEN Rejected',
        3: 'Processing',
        4: 'Schedule',
        5: 'Collected',
        6: 'Toyo Rejected',
        9: 'Deleted'
    };
    return statusMap[status] || 'Unknown';
}

onBeforeMount(async () => {
    try {
        loading.value = true;
        const response = await api.get('collection/list');
        if (response.data.status === 1) {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.id,
                claimRefNo: item.claimRefNo,
                companyName1: item.eten_data?.companyName1 || 'N/A',
                custAccountNo: item.eten_data?.custAccountNo || 'N/A',
                city: item.eten_data?.city || 'N/A',
                collectDate: item.ctc_data?.collectDate || 'N/A',
                collectTime: item.ctc_data?.collectTime || '',
                pickupDate: item.ctc_data?.reachWH || 'N/A',
                createDate: item.ctc_data?.created || 'N/A',
                collectionAddress:
                    [item.eten_data?.addressLine1, item.eten_data?.addressLine2, item.eten_data?.addressLine3, item.eten_data?.addressLine4, item.eten_data?.city, item.eten_data?.postcode, item.eten_data?.state]
                        .filter((part) => part && part.trim() !== '')
                        .join(' ') || 'N/A',
                contactNo: item.eten_data?.phoneNumber || 'N/A',
                status: item.status,
            
            }));
        } else listData.value = [];
    } catch (error) {
        console.error('Error fetching collection list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

function filteredList() {
    if (filterStatus.value === null) return listData.value;
    return listData.value.filter((x) => x.status === filterStatus.value);
}
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Collection</div>

        <DataTable
            v-model:selection="selectedRows"
            selectionMode="checkbox"
            :value="filteredList()"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['claimRefNo', 'companyName1', 'city', 'collectDate', 'collectTime', 'status']"
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
                                    :class="{ 'bg-gray-200': filterStatus === 3 }"
                                    @click="
                                        filterStatus = 3;
                                        showFilterMenu = false;
                                    "
                                >
                                    <i class="pi pi-calendar text-blue-500"></i>
                                    <span>Schedule</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2">
                        <Button type="button" label="Bulk Update " icon="pi pi-upload" />
                    </div>
                </div>
            </template>

            <template #empty> No Collection found. </template>
            <template #loading> Loading Collection data. Please wait. </template>

            <Column field="createDate" header="Create Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.createDate }}
                </template>
            </Column>
            <Column field="collectRef" header="Ref No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailCollection" class="hover:underline font-bold text-primary">
                        {{ data.claimRefNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="customerAccNo" header="Customer Acc No." style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                </template>
            </Column>

            <Column field="customerName" header="Customer Name" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.companyName1 }}
                </template>
            </Column>

            <Column field="collectionAddress" header="Collection Address" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.collectionAddress }}
                </template>
            </Column>

            <Column field="contactNo" header="Contact" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.contactNo }}
                </template>
            </Column>

            <Column field="thirdPartyLogistics" header="3PL" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.thirdPartyLogistics }}
                </template>
            </Column>

            <Column field="pickupDatetime" header="Pickup Datetime" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.pickupDate }}
                </template>
            </Column>

            <Column field="collectedDatetime" header="Collected Datetime" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.collectDate }} {{ data.collectTime }}
                </template>
            </Column>

            <Column field="totalPcs" header="Piece of Tires" style="min-width: 6rem; text-align: center">
                <template #body="{ data }">
                    {{ data.totalPcs }}
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusText(data.status)" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
