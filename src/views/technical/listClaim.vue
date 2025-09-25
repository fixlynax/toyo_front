<script setup>
import { listWarantyClaimService } from '@/service/ListWarrantyClaim';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);

// Map status → label
const getOverallStatusLabel = (status) => {
    switch (status) {
        case 0: return 'Pending';
        case 1: return 'ETEN Approved';
        case 2: return 'ETEN Rejected';
        case 3: return 'Processing';
        case 4: return 'Toyo Approved';
        case 5: return 'Toyo Rejected';
        case 9: return 'Deleted';
        default: return 'Unknown';
    }
};

// Map status → severity (PrimeVue Tag colors)
const getOverallStatusSeverity = (status) => {
    switch (status) {
        case 0: return 'warn';     // Pending
        case 1: return 'success';  // ETEN Approved
        case 2: return 'danger';   // ETEN Rejected
        case 3: return 'info';     // Processing
        case 4: return 'success';  // Toyo Approved
        case 5: return 'danger';   // Toyo Rejected
        case 9: return 'secondary';// Deleted
        default: return 'secondary';
    }
};

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await listWarantyClaimService.getListWarantyData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Claim</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Cog Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Quick Search" class="w-full" />
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
                    <RouterLink to="/technical/detailWarantyClaim" class="hover:underline font-bold">
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
                    <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
