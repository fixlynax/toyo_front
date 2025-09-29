<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Product</div>

        <DataTable :value="tyres" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
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
                            <InputText placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Export & Template Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button" />
                        <Button type="button" label="Batch" icon="pi pi-file-edit" class="p-button" />
                    </div>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="pattern" header="Tyre Pattern" style="min-width: 6rem">
                <template #body="{ data }">
                     <RouterLink to="/technical/detailProduct" class="font-bold text-gray-800 hover:underline">
                    {{ data.pattern }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="Size" header="Size" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.size }}
                </template>
            </Column>

            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <span>
                        {{ data.mfgcode }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ListTyreService } from '@/service/listProduct';

// Data variables
const tyres = ref([]);
const loading = ref(true);

// Fetch data on mount
onMounted(async () => {
    loading.value = true;
    tyres.value = await ListTyreService.getListTyre();
    loading.value = false;
});

// Helper functions for status display
const getOverallStatusLabel = (deleted) => {
    return deleted ? 'Inactive' : 'Active';
};

const getOverallStatusSeverity = (deleted) => {
    return deleted ? 'danger' : 'success';
};
</script>
