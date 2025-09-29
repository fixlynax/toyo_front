<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Bulk Update</div>

        <DataTable :value="products" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
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
                    <div class="flex gap-2 justify-end">
                        <Button label="Template" icon="pi pi-download" class="p-button" @click="downloadTemplate" />

                        <input type="file" ref="fileInput" class="hidden" accept=".xlsx,.xls" @change="handleFileUpload" />

                        <Button label="Upload File" icon="pi pi-upload" class="p-button" @click="triggerFileInput" />

                        <!-- <Button 
        label="Update" 
        icon="pi pi-check" 
        class="p-button-primary" 
        @click="updateProducts" 
      /> -->
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

            <!-- Tyre Pattern -->
            <Column field="pattern" header="Tyre Pattern" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/technical/detailProduct" class="font-bold hover:underline">
                        {{ data.pattern }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Tyre Size -->
            <Column field="tyreSize" header="Size" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.tyreSize }}
                </template>
            </Column>

            <Column field="mfgcode" header="MFG Code" style="min-width: 8rem">
                <template #body="{ data }">
                    <span class="text-black-600 font-semibold">
                        {{ data.mfgcode }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ListTyreService } from '@/service/listProduct';

// State
const products = ref([]);
const loading = ref(true);
const fileInput = ref(null);

// Fetch initial product list
onMounted(async () => {
    loading.value = true;
    products.value = await ListTyreService.getListTyre();
    loading.value = false;
});

// Trigger hidden file input
const triggerFileInput = () => {
    fileInput.value.click();
};

// Handle file upload
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('File selected:', file.name);
        // TODO: Process Excel file here
    }
};

// Download template
const downloadTemplate = () => {
    console.log('Download template triggered');
    // TODO: Implement real Excel template download
};

// Update products (bulk action)
const updateProducts = () => {
    console.log('Update products triggered');
    // TODO: Implement real bulk update logic
};
</script>
