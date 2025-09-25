<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">TWP Tire List</h2>
            <div class="flex gap-2">
                <Button label="Add Tire" icon="pi pi-plus" class="p-button-success" @click="addTire" />
                <Button label="Remove Selected" icon="pi pi-trash" class="p-button-danger" :disabled="!selectedTires.length" @click="removeSelectedTires" />
            </div>
        </div>

        <DataTable :value="twpTires" dataKey="id" selectionMode="multiple" v-model:selection="selectedTires" :paginator="true" :rows="10" :loading="loading">
            <template #empty>No TWP Tire data found.</template>
            <template #loading>Loading TWP Tire data. Please wait...</template>

            <!-- Checkbox Column -->
            <Column selectionMode="multiple" style="width: 3rem"></Column>

            <!-- Tire Size -->
            <Column field="tyreSize" header="Tire Size" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.tyreSize }}
                </template>
            </Column>

            <!-- Tire Pattern -->
            <Column field="pattern" header="Tire Pattern" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.pattern }}
                </template>
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
    twpTires.value = await ListTyreService.getListTwpTyres();
    loading.value = false;
});

// Add new tire
const addTire = () => {
    const newId = twpTires.value.length + 1;
    twpTires.value.push({
        id: newId,
        tyreSize: 'NewSize-' + newId,
        pattern: 'NewPattern-' + newId
    });
};

// Remove selected tires
const removeSelectedTires = () => {
    twpTires.value = twpTires.value.filter((tire) => !selectedTires.value.includes(tire));
    selectedTires.value = [];
};
</script>

<style scoped>
.card {
    padding: 1rem;
}
</style>
