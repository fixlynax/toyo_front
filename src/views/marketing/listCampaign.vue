<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Campaign</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Campaigns...'" :sub-message="'Fetching campaign data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                :rowHover="true"
                :loading="tableLoading"
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

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Campaign found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading campaign data...</p>
                    </div>
                </template>

                <Column field="campaignNo" header="Campaign No" style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailCampaign/${data.id}`" class="hover:underline font-bold">
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
                    <template #body="{ data }"> {{ data.startDate }} - {{ data.endDate }} </template>
                </Column>

                <Column field="totalSub" header="Total Sub" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.totalSub }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

// Data variables
const listData = ref([]);
const initialLoading = ref(true); // For initial page load
const tableLoading = ref(false); // For table operations

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('campaign/campaignList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((campaign) => ({
                id: campaign.id,
                campaignNo: campaign.campaignNo || 'N/A',
                title: campaign.title || 'Untitled',
                publishDate: campaign.publishDate || 'N/A',
                startDate: campaign.startDate || 'N/A',
                endDate: campaign.endDate || 'N/A',
                totalSub: campaign.total_participant || 0,
                status: campaign.status
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching campaign list:', error);
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
});

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
