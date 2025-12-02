<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">List News</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading News...'" :sub-message="'Fetching list announcements'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['title', 'publishDate', 'period', 'audience', 'viewer', 'status']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
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
                            <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                        </div>

                        <!-- Right: Create News Button -->
                        <RouterLink to="/marketing/createNews">
                            <Button type="button" label="Create" />
                        </RouterLink>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No News found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading news data...</p>
                    </div>
                </template>

                <Column field="title" header="Title" sortable style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailNews/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.title }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="publishDate" header="Publish Date" sortable style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ formatDate(data.publishDate) }}
                    </template>
                </Column>

                <Column field="period" header="Period" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.startDate) }}
                        <span class="font-bold"> - </span>
                        {{ formatDate(data.endDate) }}
                    </template>
                </Column>

                <!-- <Column field="audience" header="Audience" sortable style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.audience }}
                    </template>
                </Column> -->

                <Column field="viewer" header="Viewer" sortable style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.view || 0 }}
                    </template>
                </Column>

                <Column field="status" header="Status" sortable style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="getStatusLabel(data.status)" :severity="getStatusSeverity(data.status)" />
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

        const response = await api.get('news/newsList');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((news) => ({
                id: news.id,
                title: news.title || 'Untitled',
                publishDate: news.publishDate,
                startDate: news.startDate,
                endDate: news.endDate,
                audience: news.audience || 'N/A',
                view: news.view || 0,
                status: news.status
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching news list:', error);
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
});

// ... rest of your methods remain the same
const getStatusLabel = (status) => {
    const statusMap = {
        0: 'Draft',
        1: 'Published',
        2: 'Unpublished'
    };
    return statusMap[status] || 'Unknown';
};

const getStatusSeverity = (status) => {
    const severityMap = {
        0: 'info',
        1: 'success',
        2: 'warning'
    };
    return severityMap[status] || 'secondary';
};

function formatDate(dateString) {
    if (!dateString) return '';

    let day, month, year;

    // Detect YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        [year, month, day] = dateString.split('-');
    }
    // Detect DD-MM-YYYY
    else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        [day, month, year] = dateString.split('-');
    }
    else {
        return ''; // unsupported format
    }

    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}


</script>

<style scoped>

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
    
    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius:0;
        }
    }
    
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

</style>
