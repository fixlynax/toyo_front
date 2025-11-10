<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Product</div>

        <DataTable
            :value="tyres"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="materialid"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['materialid', 'pattern', 'origin', 'status']"
        >
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

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <Column field="materialid" header="Material ID" style="min-width: 6rem">
                <template #body="{ data }">
                    <div class="flex flex-col items-start gap-1">
                        <RouterLink :to="`/technical/detailProduct/${data.id}`" class="hover:underline font-bold">
                            {{ data.materialid }}
                        </RouterLink>
                    </div>
                </template>
            </Column>

            <Column field="pattern" header="Pattern" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/technical/detailProduct" class="block text-gray-800 hover:text-gray-600 transition-colors">
                        <div class="font-semibold">{{ data.pattern_name }}</div>
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
                            <span class="w-40 text-gray-800 font-semibold">Section Width:</span>
                            <span>{{ data.sectionwidth }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Tire Series:</span>
                            <span>{{ data.tireseries }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Rim Diameter:</span>
                            <span>{{ data.rimdiameter }}"</span>
                        </div>
                        <div class="flex">
                            <span class="w-40 text-gray-800 font-semibold">Speed Rating:</span>
                            <span>{{ data.speedplyrating }}</span>
                        </div>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';

// Data variables
const tyres = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

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
        command: () => sortBy('pattern_name', 'asc')
    },
    {
        label: 'Sort by Origin',
        icon: 'pi pi-globe',
        command: () => sortBy('origin', 'asc')
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

onMounted(async () => {
    try {
        loading.value = true;

        const response = await api.get('oeTireList');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            tyres.value = response.data.admin_data.map((product) => ({
                materialid: product.materialid,
                twp: product.isTWP === 1,
                warranty: product.isWarranty === 1,
                sell: product.isSell === 1,
                pattern: product.pattern,
                pattern_name: product.pattern_name,
                origin: product.origin,
                sectionwidth: product.sectionwidth,
                tireseries: product.tireseries,
                rimdiameter: product.rimdiameter,
                speedplyrating: product.speedplyrating
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            tyres.value = [];
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        tyres.value = [];
    } finally {
        loading.value = false;
    }
});

const getOverallStatusLabel = (deleted) => {
    return deleted ? 'Inactive' : 'Active';
};

const getOverallStatusSeverity = (deleted) => {
    return deleted ? 'danger' : 'success';
};
</script>
