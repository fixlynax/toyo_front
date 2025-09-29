<template>
    <div class="card">
        <!-- Page Title -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">🚩 Dealer List</div>

        <DataTable :value="dealerList" dataKey="id" selectionMode="multiple" v-model:selection="selectedDealers" :paginator="true" :rows="10" :loading="loading" class="w-full" :rowHover="true">
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
                        <RouterLink to="marketing/detailCampaign">
                            <Button label="Invite" icon="pi pi-user-plus" class="p-button-success" />
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
            {
                id: 'E010001',
                name: 'Faster Tire Shop',
                signboardType: 'TST',
                state: 'Penang'
            },
            {
                id: 'E010002',
                name: 'Classic Auto Tires',
                signboardType: 'TPC',
                state: 'Kuala Lumpur'
            },
            {
                id: 'E010003',
                name: 'Twikle Tires & Service',
                signboardType: 'Non',
                state: 'Melaka'
            },
            {
                id: 'E010004',
                name: 'AutoPro Tire Service',
                signboardType: 'T10',
                state: 'Johor'
            },
            {
                id: 'E010005',
                name: 'Speedy Tire Shop',
                signboardType: 'TST',
                state: 'Penang'
            },
            {
                id: 'E010006',
                name: 'Premium Auto Tires',
                signboardType: 'TPC',
                state: 'Perak'
            },
            {
                id: 'E010007',
                name: 'Star Tires & Service',
                signboardType: 'Non',
                state: 'Sabah'
            },
            {
                id: 'E010008',
                name: 'AutoMax Tire Service',
                signboardType: 'T10',
                state: 'Johor'
            }
        ];
        loading.value = false;
    }, 800);
});
</script>
