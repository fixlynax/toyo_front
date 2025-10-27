<template>
    <div class="card">
        <div class="flex items-center justify-between mb-4">
            <div class="text-2xl font-bold text-gray-800">Return List</div>
            <Button icon="pi pi-upload" label="Bulk Update" class="p-button" />
        </div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['requestDate', 'collectRef', 'dealerName', 'mailAddr', 'contactNo', 'dealerLoc', 'state', 'totalTire', 'status']"
        >
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
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>

                    <!-- Right: Sorting Options -->
                    <div class="flex items-center gap-2">
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
                            class="w-40"
                        />
                        <Button icon="pi pi-sort-amount-up" class="p-button-outlined p-button-secondary" v-tooltip="'Ascending'" />
                        <Button icon="pi pi-sort-amount-down" class="p-button-outlined p-button-secondary" v-tooltip="'Descending'" />
                    </div>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No return records found. </template>
            <template #loading> Loading return data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="requestDate" header="Create Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.requestDate }}
                </template>
            </Column>

            <Column field="collectRef" header="Ref No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/scm/detailReturnList" class="hover:underline font-bold text-primary">
                        {{ data.collectRef }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="dealerName" header="Customer Acc No." style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.customerID }}
                </template>
            </Column>
            <Column field="dealerName" header="Customer Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.dealerName }}
                </template>
            </Column>
            <Column field="ctcAddr" header="Collection Address" style="min-width: 8rem">
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
            <Column field="contact" header="3PL" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.PL }}
                </template>
            </Column>
            <Column field="contact" header="Pickup DateTime" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.PL }}
                </template>
            </Column>
            <Column field="contact" header="Collected DateTime" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.PL }}
                </template>
            </Column>

            <Column field="totalTire" header="Piece of Tires" style="min-width: 6rem">
                <template #body="{ data }">
                    <span class="font-bold">{{ data.totalTire }}</span>
                </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Pending' : data.status === 2 ? 'Completed' : 'In Progress'" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListCollectionService } from '@/service/ListCollection';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// =========================
// Fetch data on mount
// =========================
onMounted(async () => {
    loading.value = true;
    listData.value = await ListCollectionService.getListCollectionData();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getStatusSeverity = (status) => {
    return status === 1 ? 'warn' : 'success';
};
</script>
