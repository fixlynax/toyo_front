<script setup>
import { ListEtenService } from '@/service/ListEten';
import { onBeforeMount, ref } from 'vue';


// Function to get severity for overall status
function getOverallStatusSeverity(status) {
    return status === 1 ? 'success' : 'danger';
}

const listData = ref([]);
const loading = ref(true);

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListEtenService.getListEten();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Customer</div>
        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
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

                    <!-- Right: Add eTEN Button -->
                    <RouterLink to="/om/createEten">
                        <Button type="button" label="Create" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <!-- Columns -->
            <Column field="memberCode" header="Mem Code" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink to="/om/detailEten" class=" hover:underline font-bold">
                        {{ data.memberCode }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="custAccountNo" header="Acc No" style="min-width: 6rem" />
            <Column field="companyName1" header="Company Name" style="min-width: 8rem" />
            <Column header="Location" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.city }}, {{ data.state }}
                </template>
            </Column> 
            <Column field="phoneNumber" header="Phone No" style="min-width: 8rem" />
            <Column field="signboardType" header="Signboard" style="min-width: 8rem" />
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Active' : 'Deactive'" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
