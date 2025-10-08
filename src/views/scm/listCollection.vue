<script setup>
import { ListCollectionService } from '@/service/ListCollection';
// import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

// Function to get severity for overall status
function getOverallStatusSeverity(status) {
    return status === 1 ? 'warn' : 'success';
}

const listData = ref([]);
const loading = ref(true);

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListCollectionService.getListCollectionData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Collection</div>
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
                </div>
            </template>

            <template #empty> No Collection found. </template>
            <template #loading> Loading News data. Please wait. </template>
            <!-- Columns -->
            <Column field="ref" header="Ref No." style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailCollection" class="hover:underline font-bold text-primary">
                        {{ data.collectRef }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="dealerName" header="Dealer" style="min-width: 8rem">
                <template #body="{ data }"> {{ data.dealerName }} </template>
            </Column>
            <Column field="location" header="Location" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.dealerLoc }}
                </template>
            </Column>
            <Column field="collectDate" header="Collection Date" style="min-width: 6rem">
                <template #body="{ data }"> {{ data.collectDate }} {{ data.collectTime }} </template>
            </Column>
            <Column field="totalTire" header="Total Tires" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.totalTire }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Pending' : 'Completed'" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
