<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List User Role</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['name', 'description']"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon><i class="pi pi-search" /></InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>

                        <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                        <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                    </div>

                    <RouterLink to="/it/createUserAccount">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <template #empty>No roles found.</template>
            <template #loading>Loading role data. Please wait.</template>

            <Column field="name" header="Role Name" style="min-width: 10rem" class="font-bold text-primary-400" />
            <Column field="description" header="Description" style="min-width: 12rem" />
            <Column field="isSuperAdmin" header="Super Admin" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.isSuperAdmin ? 'Yes' : 'No'" :severity="data.isSuperAdmin ? 'info' : 'secondary'" />
                </template>
            </Column>
            <Column field="isSalesPerson" header="Sales Role" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.isSalesPerson ? 'Yes' : 'No'" :severity="data.isSalesPerson ? 'warning' : 'secondary'" />
                </template>
            </Column>
            <Column field="permissionsCount" header="Permissions" style="min-width: 8rem" />
            <Column field="created" header="Created" style="min-width: 10rem" />

            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.status ? 'Active' : 'Inactive'" :severity="data.status ? 'success' : 'danger'" />
                </template>
            </Column>

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

<script setup>
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const listData = ref([]);
const loading = ref(true);

const editUser = (role) => {
    router.push('/it/editUserAccount');
};

const deleteUser = (role) => {
    console.log('Deleting role:', role);
};

// Fetch roles
onBeforeMount(async () => {
    try {
        loading.value = true;
        const response = await api.get('admin/list-user-role');
        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.data)) {
            listData.value = response.data.data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                isSuperAdmin: item.is_super_admin,
                isSalesPerson: item.is_sales_person,
                status: item.status,
                created: item.created,
                permissionsCount: Array.isArray(item.permissions) ? item.permissions.length : 0,
                permissions: item.permissions.map((perm) => ({
                    id: perm.permission_id,
                    functionId: perm.function_id,
                    name: perm.function_name,
                    description: perm.function_description,
                    isWrite: perm.is_write
                }))
            }));
        } else {
            listData.value = [];
            console.warn('Unexpected API response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching role list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Sort menu
const sortMenu = ref();
const sortItems = ref([
    { label: 'Sort by Name (A-Z)', icon: 'pi pi-sort-alpha-down', command: () => sortBy('name', 'asc') },
    { label: 'Sort by Name (Z-A)', icon: 'pi pi-sort-alpha-up', command: () => sortBy('name', 'desc') },
    { label: 'Sort by Created Date', icon: 'pi pi-calendar', command: () => sortBy('created', 'desc') },
    { label: 'Sort by Permission Count', icon: 'pi pi-list', command: () => sortBy('permissionsCount', 'desc') }
]);

const sortBy = (field, order) => {
    listData.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};
</script>
