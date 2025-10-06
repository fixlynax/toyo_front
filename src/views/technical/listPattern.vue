<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Pattern</div>

        <DataTable :value="tyres" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['materialid', 'pattern', 'imageURL']">
            <!-- ========================= -->
            <!-- Header Section -->
            <!-- ========================= -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Sort Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>

                        <!-- Sort Menu -->
                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <!-- Right: Export & Upload Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button" />
                        <Button type="button" label="Create" icon="pi pi-file-import" class="p-button" />
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
            <Column field="imageURL" header="Image" style="min-width: 8rem; text-align: center">
                <template #body="{ data }">
                    <img :src="getImagePath(data.imageURL)" alt="Tyre Image" class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform" @click="openImage(data.imageURL)" />
                </template>
            </Column>

            <Column field="pattern" header="Pattern" style="min-width: 8rem">
                <template #body="{ data }">
                    <span class="font-semibold ml-1">{{ data.pattern }}</span>
                </template>
            </Column>
        </DataTable>

        <!-- ✅ Image Preview Dialog -->
        <Dialog v-model:visible="showImageDialog" modal :style="{ width: '40vw' }" dismissableMask>
            <div class="flex justify-center items-center">
                <img :src="getImagePath(selectedImage)" alt="Preview" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListTyreService } from '@/service/listProduct';
import Dialog from 'primevue/dialog';

// =========================
// State Variables
// =========================
const tyres = ref([]);
const loading = ref(true);

// Filters (for Quick Search)
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
        label: 'Sort by Pattern (Z-A)',
        icon: 'pi pi-tag',
        command: () => sortBy('pattern', 'desc')
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
// Image Preview Logic
// =========================
const showImageDialog = ref(false);
const selectedImage = ref(null);

const openImage = (imagePath) => {
    selectedImage.value = imagePath;
    showImageDialog.value = true;
};

const getImagePath = (path) => {
    if (!path) return '';
    return path.replace(/^public\//, '/');
};

// =========================
// Fetch Data
// =========================
onMounted(async () => {
    loading.value = true;
    tyres.value = await ListTyreService.getListTyre();
    loading.value = false;
});
</script>
