<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">List Event</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Events...'" :sub-message="'Fetching event data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                dataKey="id"
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['title', 'location', 'publishDate', 'period', 'isSurvey', 'status']"
                class="rounded-table"
            >
            
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

                        <!-- Right: Create Event Button -->
                        <RouterLink to="/marketing/createEvent">
                            <Button type="button" label="Create" />
                        </RouterLink>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Event found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading event data...</p>
                    </div>
                </template>

                <Column field="title" header="Title" style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailEvent/${data.id}`" class="hover:underline font-bold">
                            {{ data.title }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="location" header="Location" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.location }}
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

                <Column field="isSurvey" header="Survey" style="min-width: 6rem">
                    <template #body="{ data }">
                        <span v-if="data.isSurvey" class="font-bold">Yes</span>
                        <span v-else class="text-gray-500">No</span>
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
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
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

        const response = await api.get('event/eventList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((event) => ({
                id: event.id,
                title: event.title || 'Untitled',
                location: event.location || 'N/A', // Fixed: was using publishDate for location
                publishDate: event.publishDate || 'N/A', // Fixed: was using startDate for publishDate
                startDate: event.startDate || 'N/A',
                endDate: event.endDate || 'N/A',
                isSurvey: event.isSurvey || false,
                status: event.status
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching event list:', error);
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

// Rounded table styles
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    
    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    
    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
    
    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }
    
    // For the last row in the table body
    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }
    
    // When table is empty
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>