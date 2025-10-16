<script setup>
import { ref, onBeforeMount } from 'vue';
import api from '@/service/api'; // Import your api client

// Function to get severity for status
function getStatusSeverity(status) {
    const severityMap = {
        0: 'secondary', // pending
        1: 'info', // eten approved
        2: 'danger', // eten rejected
        3: 'warning', // processing
        4: 'warning', // in progress
        5: 'success', // toyo approved
        6: 'danger', // toyo rejected
        9: 'secondary' // deleted
    };
    return severityMap[status] || 'secondary';
}

// Function to get status text
function getStatusText(status) {
    const statusMap = {
        0: 'Pending',
        1: 'ETEN Approved',
        2: 'ETEN Rejected',
        3: 'Processing',
        4: 'In Progress',
        5: 'Toyo Approved',
        6: 'Toyo Rejected',
        9: 'Deleted'
    };
    return statusMap[status] || 'Unknown';
}

const listData = ref([]);
const loading = ref(true);

// Fetch data on component mount
onBeforeMount(async () => {
    try {
        loading.value = true;
        const response = await api.get('collection/list');

        console.log('Admin data:', response.data.admin_data);

        if (response.data.status === 'success') {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.id,
                claimRefNo: item.claimRefNo,
                companyName1: item.eten_data?.companyName1 || 'N/A',
                city: item.eten_data?.city || 'N/A',
                collectDate: item.ctc_data?.collectDate || 'N/A',
                collectTime: item.ctc_data?.collectTime || '',
                status: item.status // Using the main status from warranty entry
            }));
        } else {
            console.error('API returned error:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching collection list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Collection</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['collectRef', 'dealerName', 'dealerLoc', 'collectDate', 'collectTime', 'totalTire', 'status']"
        >
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No Collection found. </template>
            <template #loading> Loading News data. Please wait. </template>
            <!-- Columns -->
            <Column field="ref" header="Ref No." style="min-width: 8rem">
                <template #body="{ data }">
                    <!-- Pass the id as parameter -->
                    <RouterLink :to="`/scm/detailCollection/${data.id}`" class="hover:underline font-bold text-primary">
                        {{ data.claimRefNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="dealerName" header="Dealer" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.dealerName }} </template>
            </Column>
            <Column field="location" header="Location" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.city }}
                </template>
            </Column>
            
            <Column field="collectDate" header="Collection Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.collectDate }} {{ data.collectTime }}
                </template>
            </Column>
            <Column field="totalTire" header="Total Tires" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.totalTire }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Pending' : 'Completed'" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListCollectionService } from '@/service/ListCollection';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'warn' : 'success';
};

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListCollectionService.getListCollectionData();
    loading.value = false;
});
</script>