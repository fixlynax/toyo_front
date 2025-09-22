<script setup>
import { ListEtenUserService } from '@/service/ListEtenUser';
import { onBeforeMount, ref } from 'vue';


// Function to get severity for overall status
function getOverallStatusSeverity(status) {
    return status === 1 ? 'success' : 'danger';
}

const listData = ref([]);
const loading = ref(true);

// Fetch data on component mount
onBeforeMount(async () => {
    listData.value = await ListEtenUserService.getListEtenUserData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List User</div>
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
            <Column field="etenUserID" header="Mem Code" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailEtenUser" class=" hover:underline font-bold">
                        {{ data.etenUserID }}
                    </RouterLink>
                </template>
            </Column>
            <Column header="Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.firstName }} {{ data.lastName }}
                </template>
            </Column> 
            <Column field="gender" header="Gender" style="min-width: 6rem" />
            <Column header="Race" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.race }}
                </template>
            </Column> 
            <Column field="state" header="State" style="min-width: 6rem" />
            <Column field="level" header="Level" style="min-width: 6rem" />
            <Column field="memberSince" header="Mem Since" style="min-width: 8rem" />
            <Column field="lastLogin" header="Last Login" style="min-width: 8rem" />

            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
