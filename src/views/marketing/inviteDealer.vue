<template>
    <div class="card">
        <!-- Page Title -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">🚩 Dealer List</div>

        <DataTable 
            :value="dealerList" 
            dataKey="id" 
            selectionMode="multiple" 
            v-model:selection="selectedDealers" 
            :paginator="true" 
            :rows="10" 
            :loading="loading" 
            class="w-full" 
            :rowHover="true"
        >
            <!-- Header Section inside DataTable -->
            <template #header>
                <div class="flex items-center justify-between flex-wrap gap-4 w-full">
                    <!-- Left: Search + Cog -->
                    <div class="flex items-center gap-2 w-full max-w-md flex-1">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText placeholder="Quick Search Dealer" class="w-full" v-model="search" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Action Buttons -->
                    <div class="flex gap-2 justify-end flex-shrink-0">
                        <RouterLink to="/dealer/addDealer">
                            <Button label="Invite Dealer" icon="pi pi-user-plus" class="p-button-success" />
                        </RouterLink>
                    </div>
                </div>
            </template>

            <!-- Empty / Loading Messages -->
            <template #empty>No dealer data found.</template>
            <template #loading>Loading dealer data. Please wait...</template>

            <!-- Data Columns -->
            <Column selectionMode="multiple" style="width: 3rem" />

            <Column field="name" header="Dealer Name" style="min-width: 20rem">
                <template #body="{ data }">
                    <span class="font-bold text-gray-800">{{ data.name }}</span>
                    <br />
                    <span class="text-gray-600 text-sm">👤 {{ data.id }}</span>
                </template>
            </Column>

            <Column field="state" header="State" style="min-width: 8rem">
                <template #body="{ data }">{{ data.state }}</template>
            </Column>

            <Column field="signboardType" header="Signboard Type" style="min-width: 8rem">
                <template #body="{ data }">{{ data.signboardType }}</template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// mock service (replace with API later)
const dealerList = ref([]);
const selectedDealers = ref([]);
const loading = ref(true);
const search = ref('');

onMounted(() => {
    loading.value = true;
    setTimeout(() => {
        dealerList.value = [
            { id: 'DLR001', name: 'Tack Lim Service Tires', state: 'Kuala Lumpur', signboardType: 'T10' },
            { id: 'DLR002', name: 'ProWheel Auto Sdn Bhd', state: 'Johor', signboardType: 'TAC' },
            { id: 'DLR003', name: 'Speedy Tyres Centre', state: 'Penang', signboardType: 'T20' },
            { id: 'DLR004', name: 'Hock Lee Tyres', state: 'Sabah', signboardType: 'T10' }
        ];
        loading.value = false;
    }, 800);
});
</script>
