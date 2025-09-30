<script setup>
import { ListUserService } from '@/service/ITUser';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);
const filters = ref(null);

function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        usergroup: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        statusUser: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// Map status → label
const getUserStatusLabel = (status) => {
    if (status === 1) return 'Active';
    if (status === 0) return 'Suspend';
    return 'Unknown';
};

// Map status → severity
const getUserStatusSeverity = (status) => {
    if (status === 1) return 'success';
    if (status === 0) return 'danger';
    return 'secondary';
};

onBeforeMount(async () => {
    listData.value = await ListUserService.getListUserData();
    loading.value = false;
    initFilters();
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List User</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                    </div>

                    <!-- Right: Create User Button -->
                    <RouterLink to="/user/create">
                        <Button type="button" label="Create User" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No users found. </template>
            <template #loading> Loading user data. Please wait. </template>

            <!-- Columns -->
            <Column field="username" header="Name" style="min-width: 10rem" sortable />
            <Column field="department" header="Department" style="min-width: 8rem" sortable />
            <Column field="mobileno" header="Mobile No" style="min-width: 8rem" />
            <Column field="email" header="Email" style="min-width: 12rem" />
            <Column field="usergroup" header="User Group" style="min-width: 8rem" sortable />

            <!-- Status -->
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="getUserStatusLabel(data.statusUser)" :severity="getUserStatusSeverity(data.statusUser)" />
                </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-sm" @click="editUser(data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm" @click="deleteUser(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
