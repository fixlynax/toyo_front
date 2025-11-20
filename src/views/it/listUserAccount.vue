<template>
    <Fluid>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div class="text-2xl font-bold">List User List</div>
            </div>

            <DataTable :value="listData" :loading="loading" :filters="filters" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" filterDisplay="menu" :globalFilterFields="['usergroup', 'description', 'created']" class="rounded-table">
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>

                        <RouterLink to="/it/createUserAccount">
                            <Button type="button" label="Create" icon="pi pi-plus" />
                        </RouterLink>
                    </div>
                </template>

                <Column field="userlist" header="List User & Role" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-primary-400">{{ data.userlist }}</span>
                            <div class="flex gap-2">
                                <Tag :value="data.is_super_admin ? 'Super Admin' : 'User'" :severity="data.is_super_admin ? 'primary' : 'secondary'" />
                                <Tag v-if="data.sales_person" value="Sales" severity="info" />
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="description" header="Description" style="min-width: 12rem">
                    <template #body="{ data }">
                        <span class="">{{ data.description }}</span>
                    </template>
                </Column>
                <Column field="department" header="Department" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.department || '-' }}
                    </template>
                </Column>

                <Column field="mobile" header="Mobile No" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.mobile || '-' }}
                    </template>
                </Column>

                <Column field="email" header="Email Address" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.email || '-' }}
                    </template>
                </Column>

                <Column field="usergroup" header="User Group" style="min-width: 12rem">
                    <template #body="{ data }">
                        <span>{{ data.usergroup || '-' }}</span>
                    </template>
                </Column>

                <Column field="modules" header="Module / Function List" style="min-width: 12rem">
                    <template #body="{ data }">
                        <Button icon="pi pi-eye" class="p-button-text p-button-sm text-blue-600" @click="openModuleDialog(data.modules)" />
                        <span class="ml-2">{{ data.modules.length || '-' }} Modules</span>
                    </template>
                </Column>

                <Column field="created" header="Created" style="min-width: 12rem">
                    <template #body="{ data }">
                        {{ data.created ? new Date(data.created).toLocaleDateString('en-GB') : '-' }}
                    </template>
                </Column>

                <Column header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :severity="data.statusUser === 1 ? 'success' : 'danger'" :value="data.statusUser === 1 ? 'Active' : 'Inactive'" />
                    </template>
                </Column>

                <Column header="Action" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <div class="flex gap-2">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteUser(data)" />
                            </div>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="moduleDialogVisible" header="Module List" modal style="width: 50rem">
            <div class="overflow-x-auto">
                <div class="min-w-full border rounded-lg divide-y divide-gray-200">
                    <!-- Header -->
                    <div class="grid grid-cols-2 bg-gray-100 text-gray-700 font-semibold p-3">
                        <div>Module</div>
                        <div class="text-center">Permission</div>
                    </div>

                    <!-- Module rows -->
                    <div v-for="(m, i) in selectedModules" :key="i" class="grid grid-cols-2 p-3 items-center hover:bg-gray-50">
                        <div class="flex items-center gap-2">
                            <span class="font-bold">-</span>
                            <span>{{ m.name }}</span>
                        </div>
                        <div class="flex justify-center">
                            <Tag :value="m.write ? 'Write' : 'Read'" :severity="m.write ? 'success' : 'info'" class="px-3 py-1 text-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const listData = ref([]);
const loading = ref(true);

const moduleDialogVisible = ref(false);
const selectedModules = ref([]);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

function openModuleDialog(modules) {
    selectedModules.value = modules;
    moduleDialogVisible.value = true;
}

onMounted(async () => {
    await fetchUsers();
});

const fetchUsers = async () => {
    loading.value = true;
    try {
        const res = await api.get('getAdminUserProfile');
        
        if (res.data.status === 1 && res.data.user_profile) {
            const userProfile = res.data.user_profile;
            
            // Transform the single user profile into array format for the table
            listData.value = [{
                id: userProfile.user_id,
                userlist: userProfile.username,
                description: userProfile.full_name || userProfile.role_info?.role_description || '-',
                is_super_admin: userProfile.role_info?.is_super_admin ? 1 : 0,
                sales_person: false, // This field might not be available in the new response
                created: userProfile.created_date,
                modules: extractModulesFromPermissions(userProfile.permissions),
                statusUser: userProfile.user_status ? 1 : 0,
                department: '-', // Not available in new response
                mobile: '-', // Not available in new response
                email: userProfile.email_address || '-',
                usergroup: userProfile.role_info?.role_name || '-'
            }];
        } else {
            listData.value = [];
            toast.add({
                severity: 'warn',
                summary: 'No Data',
                detail: 'No user profile found',
                life: 3000
            });
        }
    } catch (err) {
        listData.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch user profile',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Helper function to extract modules from the new permissions structure
const extractModulesFromPermissions = (permissions) => {
    if (!permissions || !permissions.function_groups) {
        return [];
    }

    const modules = [];
    
    permissions.function_groups.forEach(group => {
        if (group.functions && Array.isArray(group.functions)) {
            group.functions.forEach(func => {
                modules.push({
                    name: func.function_name,
                    write: func.has_write_access === 1
                });
            });
        }
    });

    return modules;
};

const editUser = (user) => {
    router.push(`/it/editGroup/${user.id}`);
};

const deleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete "${user.userlist}"?`)) return;

    try {
        // Note: You might need to update the delete endpoint as well
        const res = await api.delete(`admin/delete-user-role/${user.id}`);

        if (res.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Deleted',
                detail: `"${user.userlist}" has been deleted.`,
                life: 3000
            });
            await fetchUsers();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: res.data.error?.messageEnglish || 'Failed to delete user',
                life: 4000
            });
        }
    } catch (err) {
        console.error(err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.error?.messageEnglish || 'Something went wrong',
            life: 4000
        });
    }
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

// Rounded table styles
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    // For the last row in the table body
    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    // When table is empty
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>