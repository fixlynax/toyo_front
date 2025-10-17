<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List News</div>

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
            :globalFilterFields="['title', 'publishDate', 'period', 'audience', 'viewer', 'status']"
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

                    <!-- Right: Create News Button -->
                    <RouterLink to="/marketing/createNews">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No News found. </template>
            <template #loading> Loading News data. Please wait. </template>
            
            <Column field="title" header="Title" sortable style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/marketing/detailNews/${data.id}`" class="hover:underline font-bold">
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

            <Column field="audience" header="Audience" sortable style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.audience }}
                </template>
            </Column>

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
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';

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
    try {
        loading.value = true;
        const response = await api.get('news/newsList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((news) => ({
                id: news.id,
                title: news.title || 'Untitled',
                publishDate: news.publishDate,
                startDate: news.startDate,
                endDate: news.endDate, // Fixed typo: was 'endtDate'
                audience: news.audience || 'N/A',
                view: news.view || 0, // Fixed: was 'viewer' in API but 'view' in data
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
        loading.value = false;
    }
});

// =========================
// Helper functions
// =========================
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
        2: 'warning' // Fixed: was 'warn', should be 'warning'
    };
    return severityMap[status] || 'secondary';
};

const getAudienceSeverity = (audience) => {
    const audienceMap = {
        'ALL': 'info',
        'TC': 'success',
        'ETEN': 'warning'
    };
    return audienceMap[audience] || 'secondary';
};

const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
        // Parse DD-MM-YYYY format and return as is, or format if needed
        return dateString;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};
</script>