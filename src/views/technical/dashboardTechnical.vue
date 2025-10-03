<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Pending CTC</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">3560</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+320 </span>
                <span class="text-muted-color">CTC have been completed</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Pending Claim</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">RM 60, 500</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+312 </span>
                <span class="text-muted-color">Claim have been completed</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Pending Scrap</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">65</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+122 </span>
                <span class="text-muted-color">Scrap have been completed</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Pending Invoice</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">30</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+7 </span>
                <span class="text-muted-color">Invoice have been completed</span>
            </div>
        </div>
    </div>

    <div class="card mt-8">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Warranty</div>
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
                    <div class="flex flex-col">
                        <RouterLink to="/technical/detailWarantyClaim" class="hover:underline font-bold">
                        <span class="font-bold text-gray-800">{{ data.refNo }}</span></RouterLink>
                        <span class="text-gray-600 text-xs mt-2">🔴 {{ data.warrantyType }}</span>
                    </div>
                </template>
            </Column>
            <Column field="Dealer" header="Dealer Acc No" style="min-width: 6rem">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="font-bold text-gray-800">{{ data.dealerName }}</span>
                        <span class="text-gray-600 text-xs mt-2">👤 {{ data.dealerAccNo}}</span>
                    </div>
                </template>
            </Column>
            <Column field="claimType" header="Claim Type" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.claimType }}
                </template>
            </Column>
            <Column field="SubmitDate" header="Submittion Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.submitDate }}
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

<script setup>
import { listWarantyClaimService } from '@/service/ListWarrantyClaim';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);

// Map status → label
const getOverallStatusLabel = (warrantyType) => {
    switch (warrantyType) {
        case 0:
            return 'New';
        case 1:
            return 'Pending CTC';
        case 2:
            return 'Pending Strap';
        case 3:
            return 'Pending Invoice';
        case 4:
            return 'Waiting Approval';
        case 5:
            return 'Processing';
        case 6:
            return 'Completed';
        default:
            return 'Unknown';
    }
};

// Map status → severity (PrimeVue Tag colors)
const getOverallStatusSeverity = (warrantyType) => {
    switch (warrantyType) {
        case 0:
            return 'info';
        case 1:
            return 'warn';
        case 2:
            return 'warn';
        case 3:
            return 'warn';
        case 4:
            return 'warn';
        case 5:
            return 'secondary';
        case 6:
            return 'success';
        default:
            return 'danger';
    }
};

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await listWarantyClaimService.getListWarantyData();
    loading.value = false;
});
</script>
