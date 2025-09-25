<template>
    <div class="card">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Bulk Update Product</div>

        <div class="mt-4 flex flex-col gap-4">
            <!-- Top Action Buttons -->
            <div class="flex gap-2 justify-end">
                <Button label="Download Template" icon="pi pi-download" class="p-button-success" @click="downloadTemplate" />
                <input type="file" ref="fileInput" class="hidden" accept=".xlsx,.xls" @change="handleFileUpload" />
                <Button label="Upload File" icon="pi pi-upload" class="p-button-info" @click="triggerFileInput" />
                <Button label="Update" icon="pi pi-check" class="p-button-primary" @click="updateProducts" />
            </div>

            <!-- Table Preview -->
            <DataTable :value="products" :paginator="true" :rows="10" dataKey="id" :loading="loading">
                <template #empty>No product data found.</template>
                <template #loading>Loading product data. Please wait...</template>

                <Column field="pattern" header="Pattern" style="min-width: 10rem" />
                <template #body="{ data }">
                    {{ data.pattern }}
                </template>
                <Column field="size" header="Size" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.size }}
                    </template>
                </Column>
                <Column field="size" header="Origin" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.origin }}
                    </template>
                </Column>
                <Column header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <span :class="{ 'font-bold': data.status === 'Waranty' }">
                            {{ data.status }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ListTyreService } from '@/service/listProduct';

// State
const products = ref([]);
// Load initial data
onMounted(async () => {
    products.value = await ListTyreService.getListTyre();
    loading.value = false;
});
</script>
