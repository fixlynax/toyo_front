<template>
    <div class="card">
        <!-- Page Title -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">TWP Tire List</div>

        <DataTable :value="twpTires" dataKey="id" selectionMode="multiple" v-model:selection="selectedTires" :paginator="true" :rows="10" :loading="loading" class="w-full" :rowHover="true">
            <!-- Header Section -->
            <template #header>
                <div class="flex items-center justify-between flex-wrap gap-4 w-full">
                    <!-- Left: Search + Cog -->
                    <div class="flex items-center gap-2 w-full max-w-md flex-1">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Add Button -->
                    <div class="flex gap-2 justify-end flex-shrink-0">
                        <RouterLink to="/technical/addTwpTire">
                            <Button label="Add Tire" icon="pi pi-plus" class="p-button-success" />
                        </RouterLink>
                    </div>
                </div>
            </template>

            <!-- Empty / Loading Messages -->
            <template #empty>No TWP Tire data found.</template>
            <template #loading>Loading TWP Tire data. Please wait...</template>

            <!-- Columns -->
            <Column field="materialid" header="Material ID" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/technical/detailProduct" class="font-semibold text-gray-800 hover:underline">
                        {{ data.materialid }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="pattern" header="Tire Product" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/technical/detailProduct" class="block text-gray-800 hover:text-gray-600 transition-colors">
                        <div class="font-semibold text-lg">{{ data.pattern }}</div>
                        <div class="text-sm text-gray-500">{{ data.subpattern }}</div>
                    </RouterLink>
                </template>
            </Column>

            <Column field="origin" header="Origin" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.origin }}
                </template>
            </Column>

            <Column field="size" header="Size" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Tyre Size Type:</span>
                            <span>{{ data.tyresize }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Tyre Spec:</span>
                            <span>{{ data.tyrespec }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Rim Diameter:</span>
                            <span>{{ data.rimDiameter }}"</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Aspect Ratio:</span>
                            <span>{{ data.aspectRatio }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Section Width:</span>
                            <span>{{ data.sectionWidth }}</span>
                        </div>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ListTyreService } from '@/service/listProduct';

// State
const twpTires = ref([]);
const selectedTires = ref([]);
const loading = ref(true);

// Status helpers
const getOverallStatusLabel = (status) => {
    if (!status) return 'Unknown';
    return status;
};

const getOverallStatusSeverity = (status) => {
    switch (status) {
        case 'Warranty':
            return 'success';
        case 'Non-Warranty':
            return 'danger';
        default:
            return 'secondary';
    }
};

// Load data
onMounted(async () => {
    loading.value = true;
    twpTires.value = await ListTyreService.getListTyreData(); // ✅ Full data for all columns
    loading.value = false;
});
</script>
