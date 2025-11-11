<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);


// Map status → severity (PrimeVue Tag colors) - CORRECTED
const getOverallStatusSeverity = (status) => {
    switch (status) {
        case "Pending Dealer": return 'warn';     
        case "Dealer Approved" :return 'success';  
        case "Dealer Rejected": return 'danger';   
        case "Processing": return 'info';     
        case "In Progress": return 'warning';  
        case "Admin Approved": return 'success';  
        case "Admin Rejected": return 'danger';   
        default: return 'secondary';
    }
};

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Fetch data on component mount
onBeforeMount(async () => {
    try {
        loading.value = true;
        const response = await api.get('warranty_claim');
        console.log(response.data);
        if (response.data.status === 1) {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.claim_id,
                refNo: item.claimRefNo,
                dealerName: item.dealer ,
                claimType: item.warrantyType,
                claimDate: item.claim_date,
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
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Claim</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading":filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['refNo', 'dealerName', 'claimType', 'claimDate', 'Status']">
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

                    <!-- Right: Export & Template Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-sucess" />
                        <Button type="button" label="Template" icon="pi pi-download" class="p-button-danger" />
                    </div>
                </div>
            </template>

            <template #empty> No News found. </template>
            <template #loading> Loading News data. Please wait. </template>
            <!-- Columns -->
            <Column field="refNo" header="Ref No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/technical/detailWarantyClaim/${data.id}`" class="hover:underline font-bold text-primary-400">
                        {{ data.refNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="dealerName" header="Dealer Name" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.dealerName }}
                </template>
            </Column>
            <Column field="claimType" header="Claim Type" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.claimType }}
                </template>
            </Column>
            <Column field="claimDate" header="Claim Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.claimDate }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>