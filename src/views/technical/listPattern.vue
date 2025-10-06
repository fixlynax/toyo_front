<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Pattern</div>

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
            <Column field="materialid" header="Material ID" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/technical/detailProduct" class="font-semibold text-gray-800 hover:underline">
                        {{ data.materialid }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="pattern" header="Tyre Pattern" style="min-width: 18rem">
                <template #body="{ data }">
                    <span class="font-semibold ml-1">{{ data.pattern }}</span>
                </template>
            </Column>

            <!-- ✅ Image Column (click to enlarge) -->
            <Column field="imageURL" header="Image" style="min-width: 8rem; text-align: center">
                <template #body="{ data }">
                    <img :src="getImagePath(data.imageURL)" alt="Tyre Image" class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform" @click="openImage(data.imageURL)" />
                </template>
            </Column>
            <Column field="Status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.status }}
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
import { ListTyreService } from '@/service/listProduct';
import Dialog from 'primevue/dialog';

// Data
const tyres = ref([]);
const loading = ref(true);

// For image preview dialog
const showImageDialog = ref(false);
const selectedImage = ref(null);

// Fetch data
onMounted(async () => {
    loading.value = true;
    tyres.value = await ListTyreService.getListTyre();
    loading.value = false;
});

// Handle image click
const openImage = (imagePath) => {
    selectedImage.value = imagePath;
    showImageDialog.value = true;
};

// Format image path correctly (remove "public/")
const getImagePath = (path) => {
    if (!path) return '';
    return path.replace(/^public\//, '/');
};
</script>
