<script setup>
import { ListCollectionService } from '@/service/ListCollection';
import { onBeforeMount, ref } from 'vue';

// Function to get severity for status
function getStatusSeverity(status) {
    return status === 1 ? 'warn' : 'success';
}

const listData = ref([]);
const loading = ref(true);
const filters = ref({
    city: null,
    state: null,
    status: null,
    search: null
});

const cityOptions = ref(['Kuala Lumpur', 'Petaling Jaya', 'Shah Alam', 'Subang Jaya']);
const stateOptions = ref(['Selangor', 'Kuala Lumpur', 'Johor', 'Penang']);
const statusOptions = ref([
    { label: 'Pending', value: 1 },
    { label: 'Completed', value: 2 },
    { label: 'In Progress', value: 3 }
]);

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListCollectionService.getListCollectionData();
    loading.value = false;
});

const applyFilters = () => {
    // Implement filter logic here
    console.log('Applying filters:', filters.value);
};

const clearFilters = () => {
    filters.value = {
        city: null,
        state: null,
        status: null,
        search: null
    };
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 pb-2">Return List</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 20]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
            <template #header>
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <!-- Left: Quick Search -->
                    <div class="flex items-center gap-2 w-full md:max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters.search" placeholder="Quick Search" class="w-full" @keyup.enter="applyFilters" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Sorting Options -->
                    <div class="flex items-center gap-2 w-full md:w-auto">
                        <span class="text-sm font-medium whitespace-nowrap">Sort by:</span>
                        <Dropdown
                            :options="[
                                { label: 'Request Date', value: 'requestDate' },
                                { label: 'CTC Ref No', value: 'collectRef' },
                                { label: 'Dealer Name', value: 'dealerName' },
                                { label: 'Piece of Tires', value: 'totalTire' },
                                { label: 'Status', value: 'status' }
                            ]"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Field"
                            class="w-full md:w-40"
                        />
                        <Button icon="pi pi-sort-amount-up" class="p-button-outlined p-button-secondary" v-tooltip="'Ascending'" />
                        <Button icon="pi pi-sort-amount-down" class="p-button-outlined p-button-secondary" v-tooltip="'Descending'" />
                    </div>
                </div>
            </template>

            <template #empty> No return records found. </template>
            <template #loading> Loading return data. Please wait. </template>

            <!-- Columns based on criteria -->
            <Column field="requestDate" header="Request Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.requestDate }}
                </template>
            </Column>

            <Column field="collectRef" header="CTC Ref No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailCollection" class="hover:underline font-bold text-primary">
                        {{ data.collectRef }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="dealerName" header="Dealer Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.dealerName }}
                </template>
            </Column>

            <Column field="contact" header="Contact" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.mailAddr }}<br />
                    <small class="text-gray-600">{{ data.contactNo }}</small>
                </template>
            </Column>

            <Column field="location" header="Location" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.dealerLoc }}<br />
                    <small class="text-gray-600">{{ data.state }}</small>
                </template>
            </Column>

            <Column field="totalTire" header="Piece of Tires" style="min-width: 6rem">
                <template #body="{ data }">
                    <span class="font-bold">{{ data.totalTire }}</span>
                </template>
            </Column>

            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Pending' : data.status === 2 ? 'Completed' : 'In Progress'" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
