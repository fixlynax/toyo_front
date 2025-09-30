<script setup>
import { ListUserService } from '@/service/ITUser';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Sort menu
const sortMenu = ref();
const sortItems = ref([
    {
        label: 'Sort by Name (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('username', 'asc')
    },
    {
        label: 'Sort by Name (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('username', 'desc')
    },
    {
        label: 'Sort by Department',
        icon: 'pi pi-briefcase',
        command: () => sortBy('department', 'asc')
    },
    {
        label: 'Sort by Status',
        icon: 'pi pi-check-circle',
        command: () => sortBy('statusUser', 'desc')
    }
]);

const sortBy = (field, order) => {
    listData.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// Map status → label
const getUserStatusLabel = (status) => (status === 1 ? 'Active' : 'Suspend');
const getUserStatusSeverity = (status) => (status === 1 ? 'success' : 'danger');

onBeforeMount(async () => {
    listData.value = await ListUserService.getListUserData();
    loading.value = false;
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List User</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['username', 'department', 'mobileno', 'email', 'usergroup']">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Quick Search + Sort Button -->
                    <div class="flex items-center gap-2">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-64" />
                        </IconField>

                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <!-- Right: Create Button -->
                    <RouterLink to="/user/create">
                        <Button type="button" label="Create User" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No users found. </template>
            <template #loading> Loading user data. Please wait. </template>

            <!-- Columns -->
            <Column field="username" header="Name" style="min-width: 10rem" />
            <Column field="department" header="Department" style="min-width: 8rem" />
            <Column field="mobileno" header="Mobile No" style="min-width: 8rem" />
            <Column field="email" header="Email" style="min-width: 12rem" />
            <Column field="usergroup" header="User Group" style="min-width: 8rem" />
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="getUserStatusLabel(data.statusUser)" :severity="getUserStatusSeverity(data.statusUser)" />
                </template>
            </Column>
            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteUser(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
