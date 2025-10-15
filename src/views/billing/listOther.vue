<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Other</div>

        <DataTable :value="listData" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['username', 'department', 'mobileno', 'email', 'usergroup']">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Quick Search + Sort Button -->
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

                    <!-- Right: Create Button -->
                    <RouterLink to="/it/createUserAccount">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <template #empty> No users found. </template>
            <template #loading> Loading user data. Please wait. </template>

            <!-- Columns -->
            <Column field="username" class="font-bold" header="Name" style="min-width: 10rem" />
            <Column field="department" header="Department" style="min-width: 8rem" />
            <Column field="mobileno" header="Mobile No" style="min-width: 8rem" />
            <Column field="email" header="Email" style="min-width: 12rem" />
            <Column field="usergroup" header="User Group" style="min-width: 8rem" />
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="getUserStatusLabel(data.statusUser)" :severity="getUserStatusSeverity(data.statusUser)" class="font-bold" />
                </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <!-- Edit button navigates to /it/technical -->
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                        <!-- Delete button -->
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteUser(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script setup>
import { ListUserService } from '@/service/ITUser';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

// router
const router = useRouter();

// navigation + actions
const editUser = (user) => {
    // optional: do something with user first
    router.push('/it/editUserAccount'); // navigate to the new route
};

const deleteUser = (user) => {
    // your delete logic
    console.log('Deleting user:', user);
};

// state
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

// sorting helper
const sortBy = (field, order) => {
    listData.value.sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// status label + severity
const getUserStatusLabel = (status) => (status === 1 ? 'Active' : 'Suspend');
const getUserStatusSeverity = (status) => (status === 1 ? 'success' : 'danger');

// fetch data
onBeforeMount(async () => {
    listData.value = await ListUserService.getListUserData();
    loading.value = false;
});
</script>
