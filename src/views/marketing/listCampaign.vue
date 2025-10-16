<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Campaign</div>

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
            :globalFilterFields="['campaignNo', 'title', 'publishDate', 'period', 'totalSub', 'status']"
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

                    <!-- Right: Create Campaign Button -->
                    <RouterLink to="/marketing/createCampaign">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No Campaign found. </template>
            <template #loading> Loading Campaign data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="campaignNo" header="Campaign No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailCampaign" class="hover:underline font-bold">
                        {{ data.campaignNo }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="title" header="Title" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.title }}
                </template>
            </Column>
            
            <Column field="publishDate" header="Publish Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.publishDate }}
                </template>
            </Column>
            
            <Column field="period" header="Period" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.startDate }} - {{ data.endDate }}
                </template>
            </Column>

            <Column field="totalSub" header="Total Sub" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.totalSub }}
                </template>
            </Column>
            
            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="data.status === 1 ? 'Active' : 'Inactive'" 
                        :severity="getOverallStatusSeverity(data.status)" 
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListCampaignService } from '@/service/ListCampaign';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListCampaignService.getListCampaignData();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>