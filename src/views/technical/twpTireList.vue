<template>
    <div class="card">
        <!-- Page Title -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">TWP Tire List</div>

        <DataTable :value="twpTires" dataKey="id" selectionMode="multiple" v-model:selection="selectedTires" :paginator="true" :rows="10" :loading="loading" class="w-full" :rowHover="true">
            <!-- Header Section inside DataTable -->
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

                    <!-- Right: Action Buttons -->
                    <div class="flex gap-2 justify-end flex-shrink-0">
                        <RouterLink to="/technical/addTwpTire">
                            <Button label="Add Tire" icon="pi pi-plus" class="p-button-success" />
                        </RouterLink>
                        <Button label="Remove Selected" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedTires.length" @click="removeSelectedTires" />
                    </div>
                </div>
            </template>

            <!-- Empty / Loading Messages -->
            <template #empty>No TWP Tire data found.</template>
            <template #loading>Loading TWP Tire data. Please wait...</template>

            <!-- Data Columns -->
            <Column selectionMode="multiple" style="width: 3rem" />

            <Column field="pattern" header="Tyre Pattern" style="min-width: 8rem">
                <template #body="{ data }">
                    <!-- <RouterLink to="/technical/detailTWP" class="hover:underline font-bold">-->{{ data.pattern
                    }}<!-- </RouterLink>  -->
                </template>
            </Column>

            <Column field="tyreSize" header="Size" style="min-width: 8rem">
                <template #body="{ data }">{{ data.tyreSize }}</template>
            </Column>
            <Column field="tyreSize" header="MFG Code" style="min-width: 8rem">
                <template #body="{ data }">{{ data.mfgcode }}</template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ListTyreService } from '@/service/listProduct';

const twpTires = ref([]);
const selectedTires = ref([]);
const loading = ref(true);

onMounted(async () => {
    loading.value = true;
    twpTires.value = await ListTyreService.getListTyreData();
    loading.value = false;
});
// Remove selected tires
const removeSelectedTires = () => {
    twpTires.value = twpTires.value.filter((tire) => !selectedTires.value.includes(tire));
    selectedTires.value = [];
};
</script>
