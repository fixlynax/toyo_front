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

                    <!-- Right: Create News Button -->
                    <RouterLink to="/marketing/createNews">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No News found. </template>
            <template #loading> Loading News data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="title" header="Title" sortable style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailNews" class="hover:underline font-bold">
                        {{ data.title }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="publishDate" header="Publish Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.publishDate }}
                </template>
            </Column>
            
            <Column field="period" header="Period" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.startDate }}
                    <span class="font-bold"> - </span>
                    {{ data.endDate }}
                </template>
            </Column>

            <Column field="audience" header="Audience" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.audience }}
                </template>
            </Column>
            
            <Column field="viewer" header="Viewer" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.view }}
                </template>
            </Column>
            
            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="getOverallStatusLabel(data.status)" 
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
import { ListNewsService } from '@/service/ListNews';

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
    listData.value = await ListNewsService.getListNewsData();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusLabel = (status) => {
    if (status === 0) return 'Draft';
    if (status === 1) return 'Published';
    if (status === 2) return 'Unpublished';
    return 'Unknown';
};

const getOverallStatusSeverity = (status) => {
    if (status === 0) return 'info';
    if (status === 1) return 'success';
    if (status === 2) return 'warn';
    return 'secondary';
};
</script>