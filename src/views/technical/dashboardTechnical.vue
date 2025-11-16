<template>
    <!-- TOP STATS GRID -->
    <div class="grid grid-cols-12 gap-6">
        <div v-for="card in statsCards" :key="card.label" class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card hover:shadow-md transition-shadow duration-300">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <span class="block text-sm text-gray-500 mb-2">{{ card.label }}</span>
                        <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ card.value }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-lg" :class="card.iconBg" style="width: 2.75rem; height: 2.75rem">
                        <i :class="['!text-xl', card.icon, card.iconColor]"></i>
                    </div>
                </div>
                <div class="text-sm">
                    <span class="text-primary font-semibold">{{ card.change }}</span>
                    <span class="text-gray-500"> {{ card.footer }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- LIST CLAIM -->
    <div class="card mt-8">
        <div class="flex items-center justify-between border-b pb-3 mb-3">
            <div class="text-xl font-bold text-gray-800">List Claim</div>
        </div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" class="p-datatable-sm" :filters="filters1" filterDisplay="menu">
            
            <!-- STATES -->
            <template #empty>
                <div class="py-6 text-gray-500 text-center">No claims found.</div>
            </template>
            <template #loading>
                <div class="py-6 text-gray-500 text-center">Loading claims...</div>
            </template>

            <!-- COLUMNS -->
            <Column field="refNo" header="Ref No" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <RouterLink to="/technical/detailWarantyClaim" class="hover:underline text-gray-800 font-bold">
                            {{ data.refNo }}
                        </RouterLink>
                        <span class="text-gray-700 text-sm mt-1">🔧 {{ data.claimType }}</span>
                    </div>
                </template>
            </Column>

            <Column field="claimType" header="Claim Type" style="display: none" />

            <Column field="dealerName" header="Dealer Acc No" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="font-semibold text-gray-800">{{ data.dealerName }}</span>
                        <span class="text-gray-700 text-sm mt-1"># {{ data.dealerInfo.custAccountNo }}</span>
                    </div>
                </template>
            </Column>

            <Column field="custAccountNo" header="Cust Account No" style="display: none" />

            <Column field="submitDate" header="Submission Date" style="min-width: 10rem">
                <template #body="{ data }">
                    <span class="text-gray-800">{{ data.submitDate }}</span>
                </template>
            </Column>

            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getOverallStatusLabel(data.status)" :severity="getOverallStatusSeverity(data.status)" class="px-3 py-1 text-xs rounded-md" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { listWarantyClaimService } from '@/service/ListWarrantyClaim';
import { onBeforeMount, ref } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const listData = ref([]);
const loading = ref(true);
const filters1 = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    refNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    claimType: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    custAccountNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    submitDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
});

// STATS CARDS
const statsCards = [
    { label: 'Pending CTC', value: '3560', icon: 'pi pi-shopping-cart', iconBg: 'bg-blue-100 dark:bg-blue-400/10', iconColor: 'text-blue-500', change: '+320', footer: 'CTC completed' },
    { label: 'Pending Claim', value: 'RM 60,500', icon: 'pi pi-dollar', iconBg: 'bg-orange-100 dark:bg-orange-400/10', iconColor: 'text-orange-500', change: '+312', footer: 'Claims completed' },
    { label: 'Pending Scrap', value: '65', icon: 'pi pi-users', iconBg: 'bg-cyan-100 dark:bg-cyan-400/10', iconColor: 'text-cyan-500', change: '+122', footer: 'Scraps completed' },
    { label: 'Pending Invoice', value: '30', icon: 'pi pi-comment', iconBg: 'bg-purple-100 dark:bg-purple-400/10', iconColor: 'text-purple-500', change: '+7', footer: 'Invoices completed' }
];

const getOverallStatusLabel = (status) => {
    switch (status) {
        case 0:
            return 'New';
        case 1:
            return 'Pending CTC';
        case 2:
            return 'Pending Scrap';
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

const getOverallStatusSeverity = (status) => {
    switch (status) {
        case 0:
            return 'info';
        case 1:
        case 2:
        case 3:
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

// FETCH DATA
onBeforeMount(async () => {
    const data = await listWarantyClaimService.getListWarantyData();

    // flatten nested dealer info
    listData.value = data.map(item => ({
        ...item,
        custAccountNo: item.dealerInfo?.custAccountNo || ''
    }));

    loading.value = false;
});
</script>