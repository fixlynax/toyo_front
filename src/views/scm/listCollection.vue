<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Collection</div>

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
            :globalFilterFields="['collectRef', 'dealerName', 'dealerLoc', 'collectDate', 'collectTime', 'totalTire', 'status']"
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
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No Collection found. </template>
            <template #loading> Loading collection data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="collectRef" header="Ref No." style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailCollection" class="hover:underline font-bold text-primary">
                        {{ data.collectRef }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="dealerName" header="Dealer" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.dealerName }}
                </template>
            </Column>
            
            <Column field="dealerLoc" header="Location" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.dealerLoc }}
                </template>
            </Column>
            
            <Column field="collectDate" header="Collection Date" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.collectDate }} {{ data.collectTime }}
                </template>
            </Column>
            
            <Column field="totalTire" header="Total Tires" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.totalTire }}
                </template>
            </Column>
            
            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="data.status === 1 ? 'Pending' : 'Completed'" 
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
import { ListCollectionService } from '@/service/ListCollection';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'warn' : 'success';
};

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListCollectionService.getListCollectionData();
    loading.value = false;
});
</script>