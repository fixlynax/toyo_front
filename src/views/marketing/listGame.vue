<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Game</div>

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
            :globalFilterFields="['gameNo', 'gameName', 'title', 'type', 'publishDate', 'status']"
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

                    <!-- Right: Create Game Button -->
                    <RouterLink to="/marketing/CreateGame">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No Games found. </template>
            <template #loading> Loading Games data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="gameNo" header="Game No" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink :to="`/marketing/detailGame/${data.id}`" class="hover:underline font-bold">
                        {{ data.gameNo }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="gameName" header="Game Name" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.title }}
                </template>
            </Column>
            
            <Column field="type" header="Type" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.type }}
                </template>
            </Column>
            
            <Column field="publishDate" header="Publish Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.publishDate }}
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
        const response = await api.get('game/gameList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((game) => ({
                id: game.id,
                gameNo: game.gameNo || 'Untitled',
                title: game.title,
                type: game.type,
                publishDate: game.publishDate, 
                status: game.status
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching game list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
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