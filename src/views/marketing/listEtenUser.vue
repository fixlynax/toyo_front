<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List User</div>

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
            :globalFilterFields="['etenUserID', 'firstName', 'lastName', 'gender', 'race', 'state', 'level', 'memberSince', 'lastLogin', 'status']"
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

                    <!-- Right: Export Button -->
                    <RouterLink to="/marketing/createEten">
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-danger" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No users found. </template>
            <template #loading> Loading users data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="etenUserID" header="Mem Code" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink to="/marketing/detailEtenUser" class="hover:underline font-bold">
                        {{ data.etenUserID }}
                    </RouterLink>
                </template>
            </Column>
            
            <Column field="name" header="Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.firstName }} {{ data.lastName }}
                </template>
            </Column>
            
            <Column field="gender" header="Gender" style="min-width: 6rem" />
            
            <Column field="race" header="Race" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.race }}
                </template>
            </Column>
            
            <Column field="state" header="State" style="min-width: 6rem" />
            
            <Column field="level" header="Level" style="min-width: 6rem" />
            
            <Column field="memberSince" header="Mem Since" style="min-width: 8rem" />
            
            <Column field="lastLogin" header="Last Login" style="min-width: 8rem" />
            
            <Column field="status" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="data.status === 1 ? 'Active' : 'Inactive'" 
                        :severity="getOverallStatusSeverity(data.status)" 
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { ListEtenUserService } from '@/service/ListEtenUser';

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
    listData.value = await ListEtenUserService.getListEtenUserData();
    loading.value = false;
});

// =========================
// Helper functions for status display
// =========================
const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>