<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Product</div>

        <DataTable :value="tyres" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['materialid', 'itemdesc', 'pattern', 'origin', 'size', 'status']">
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Sort Menu Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>

                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <!-- Right: Export & Batch Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button" />
                        <Button type="button" label="Bulk" icon="pi pi-file-import" class="p-button" />
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
            <Column field="materialid" header="Material ID" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink to="/technical/detailProduct" class="font-semibold text-gray-800 hover:underline">
                        {{ data.materialid }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="itemdesc" header="Tire Product" style="min-width: 8rem">
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

            <Column field="status" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.status }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListTyreService } from '@/service/listProduct';

// Data variables
const tyres = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Sort Menu
// =========================
const sortMenu = ref();
const sortItems = ref([
    {
        label: 'Sort by Material ID (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('materialid', 'asc')
    },
    {
        label: 'Sort by Material ID (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('materialid', 'desc')
    },
    {
        label: 'Sort by Pattern (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern', 'asc')
    },
    {
        label: 'Sort by Origin',
        icon: 'pi pi-globe',
        command: () => sortBy('origin', 'asc')
    },
    {
        label: 'Sort by Status',
        icon: 'pi pi-check-circle',
        command: () => sortBy('status', 'asc')
    }
]);

// Sorting helper function
const sortBy = (field, order) => {
    tyres.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    tyres.value = await ListTyreService.getListTyre();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusLabel = (deleted) => {
    return deleted ? 'Inactive' : 'Active';
};

const getOverallStatusSeverity = (deleted) => {
    return deleted ? 'danger' : 'success';
};
</script>
