<template>
    <Fluid>
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div class="text-2xl font-bold">User Account</div>
            </div>

            <!-- Show LoadingPage during initial page load -->
            <LoadingPage v-if="initialLoading" :message="'Loading Users...'" :sub-message="'Fetching user list'" />

            <!-- Show LoadingPage during table reloads -->
            <LoadingPage v-else-if="loading && !initialLoading" :message="'Refreshing Data...'" :sub-message="'Updating user information'" :is-full-page="false" />

            <!-- Show DataTable when not loading -->
            <DataTable
                v-else
                :value="listData"
                :filters="filters"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                v-model:expandedRows="expandedRows"
                dataKey="id"
                filterDisplay="menu"
                :globalFilterFields="['username', 'email', 'first_name', 'last_name', 'role.name', 'mobilephone']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>

                        <RouterLink to="/it/createUserAccount">
                            <Button type="button" label="Create" icon="pi pi-plus" />
                        </RouterLink>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8">
                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500">No users found.</p>
                    </div>
                </template>

                <!-- Expand/Collapse Column -->
                <Column :expander="true" headerStyle="width: 3rem" />

                <Column field="username" header="Username & Role" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-primary-400">{{ data.username }}</span>
                            <div class="flex gap-2">
                                <Tag v-if="data.role?.is_super_admin" value="Super Admin" severity="primary" />
                                <Tag v-if="data.role?.is_sales_person === 1" value="Sales" severity="info" />
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="full_name" header="Full Name" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <span>{{ data.first_name }} {{ data.last_name }}</span>
                    </template>
                </Column>

                <Column field="mobilephone" header="Mobile No" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.mobilephone || '-' }}
                    </template>
                </Column>

                <Column field="email" header="Email Address" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ data.email || '-' }}
                    </template>
                </Column>

                <Column field="role.name" header="User Role" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        <span>{{ data.role?.name || '-' }}</span>
                    </template>
                </Column>

                <Column field="created" header="Created" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.created) }}
                    </template>
                </Column>

                <Column field="last_login" header="Last Login" style="min-width: 12rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.last_login) }}
                    </template>
                </Column>

                <Column header="Status" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        <Tag :severity="data.status === 1 ? 'success' : 'danger'" :value="data.status === 1 ? 'Active' : 'Inactive'" />
                    </template>
                </Column>

                <Column header="Action" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editUser(data)" />
                            <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="confirmDeleteUser(data)" />
                        </div>
                    </template>
                </Column>

                <!-- Expanded Row Template - Function Permissions -->
                <template #expansion="{ data }">
                    <div>
                        <!-- Permissions List -->
                        <div v-if="data.permissions && data.permissions.length > 0" class="space-y-3">
                            <!-- Group permissions by category if available -->
                            <div v-for="(groupPermissions, groupName) in groupPermissionsByCategory(data.permissions)" :key="groupName" class="border rounded-lg overflow-hidden">
                                <!-- Category Header -->
                                <div class="bg-gray-100 px-4 py-2 border-b">
                                    <div class="flex justify-between items-center">
                                        <h5 class="font-semibold text-gray-700">{{ groupName }}</h5>
                                        <!-- <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded"> {{ groupPermissions.length }} function(s) </span> -->
                                        <div class="flex gap-3 text-sm">
                                            <span class="flex items-center">
                                                <span class="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                                                Read: {{ getPermissionCount(data.permissions, 'read') }}
                                            </span>
                                            <span class="flex items-center">
                                                <span class="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                                                Write: {{ getPermissionCount(data.permissions, 'write') }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Functions List -->
                                <div class="bg-white">
                                    <div class="grid grid-cols-1 md:grid-cols-5 gap-1 p-3">
                                        <div v-for="perm in groupPermissions" :key="perm.function_id" class="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                            <div class="flex-1">
                                                <div class="text-sm font-medium text-gray-800">{{ perm.function_name }}</div>
                                                <div class="text-xs text-gray-500 truncate" :title="perm.function_description || ''">
                                                    {{ perm.function_description || 'No description' }}
                                                </div>
                                            </div>
                                            <Tag :value="perm.is_write ? 'Write' : 'Read'" :severity="perm.is_write ? 'success' : 'info'" size="small" class="ml-2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- If no categories found, show flat list -->
                            <div v-if="Object.keys(groupPermissionsByCategory(data.permissions)).length === 0" class="border rounded-lg overflow-hidden">
                                <div class="bg-gray-100 px-4 py-2 border-b">
                                    <h5 class="font-semibold text-gray-700">All Functions</h5>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-1 p-3">
                                    <div v-for="perm in data.permissions" :key="perm.function_id" class="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-gray-800">{{ perm.function_name }}</div>
                                            <div class="text-xs text-gray-500 truncate" :title="perm.function_description || ''">
                                                {{ perm.function_description || 'No description' }}
                                            </div>
                                        </div>
                                        <Tag :value="perm.is_write ? 'Write' : 'Read'" :severity="perm.is_write ? 'success' : 'info'" size="small" class="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Permissions State -->
                        <div v-else class="text-center py-6">
                            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                <i class="pi pi-lock text-gray-400 text-xl"></i>
                            </div>
                            <p class="text-gray-500 font-medium">No functions assigned to this user</p>
                            <p class="text-gray-400 text-sm mt-1">Edit user to assign functions</p>
                        </div>
                    </div>
                </template>
            </DataTable>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:visible="deleteDialogVisible" header="Confirm Deletion" modal :closable="true" :style="{ width: '450px' }">
            <div class="confirmation-content flex items-center">
                <i class="pi pi-exclamation-triangle mr-3 text-yellow-500" style="font-size: 2rem" />
                <div>
                    <span v-if="selectedUser">
                        Are you sure you want to delete user <strong>"{{ selectedUser.username }}"</strong>?
                        <p class="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                    </span>
                </div>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialogVisible = false" :disabled="deleting" />
                <Button label="Yes" icon="pi pi-check" class="p-button-danger" @click="deleteUser" :loading="deleting" :disabled="deleting" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const router = useRouter();
const toast = useToast();
const listData = ref([]);
const loading = ref(false);
const initialLoading = ref(true);
const deleting = ref(false);

// Expanded rows state
const expandedRows = ref([]);

// Delete dialog
const deleteDialogVisible = ref(false);
const selectedUser = ref(null);

// Function group mapping
const functionGroupMap = {
    1: 'Marketing',
    2: 'OM',
    3: 'IT & Administration',
    4: 'Credit Control',
    5: 'SCM',
    6: 'OM Report',
    7: 'Technical',
    9: 'Members',
    10: 'Member Reports',
    13: 'Product',
    15: 'Maintenance'
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Helper functions
function formatDate(dateString) {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    } catch {
        return '-';
    }
}

const getPermissionCount = (permissions, type) => {
    if (!permissions) return 0;
    if (type === 'read') {
        return permissions.filter((p) => !p.is_write).length;
    } else {
        return permissions.filter((p) => p.is_write).length;
    }
};

const groupPermissionsByCategory = (permissions) => {
    if (!permissions) return {};

    const grouped = {};

    permissions.forEach((permission) => {
        // Try to get the group name from function_group_id
        let groupName = 'General';
        if (permission.function_group_id && functionGroupMap[permission.function_group_id]) {
            groupName = functionGroupMap[permission.function_group_id];
        }

        if (!grouped[groupName]) {
            grouped[groupName] = [];
        }

        grouped[groupName].push(permission);
    });

    // Sort group names alphabetically
    const sortedGroups = {};
    Object.keys(grouped)
        .sort()
        .forEach((key) => {
            sortedGroups[key] = grouped[key];
        });

    return sortedGroups;
};

onMounted(async () => {
    await fetchUsers();
});

const fetchUsers = async (showLoading = true) => {
    if (showLoading) {
        loading.value = true;
    }
    try {
        const res = await api.get('admin/list-user');

        if (res.data.status === 1 && res.data.data) {
            listData.value = res.data.data.map((user) => ({
                ...user,
                full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim()
            }));
        } else {
            listData.value = [];
            toast.add({
                severity: 'warn',
                summary: 'No Data',
                detail: 'No users found',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error fetching users:', err);
        listData.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to fetch users',
            life: 3000
        });
    } finally {
        if (showLoading) {
            loading.value = false;
        }
        initialLoading.value = false;
    }
};

const editUser = (user) => {
    router.push(`/it/editUserAccount/${user.id}`);
};

const confirmDeleteUser = (user) => {
    selectedUser.value = user;
    deleteDialogVisible.value = true;
};

const deleteUser = async () => {
    if (!selectedUser.value) return;

    deleting.value = true;

    try {
        const res = await api.post('admin/delete-user', {
            user_id: selectedUser.value.id
        });

        if (res.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: res.data.message || `"${selectedUser.value.username}" has been deleted successfully.`,
                life: 3000
            });

            // Remove the deleted user from the list
            const index = listData.value.findIndex((user) => user.id === selectedUser.value.id);
            if (index !== -1) {
                listData.value.splice(index, 1);
            }

            // Reset dialog and selection
            deleteDialogVisible.value = false;
            selectedUser.value = null;

            // Collapse any expanded rows
            expandedRows.value = [];
        } else {
            const errorMessage = res.data.error?.message || res.data.message || 'Failed to delete user';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 4000
            });
        }
    } catch (err) {
        console.error('Delete user error:', err);
        const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Network error. Please try again.';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 4000
        });
    } finally {
        deleting.value = false;
    }
};
</script>

<style scoped lang="scss">
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    min-height: 400px;
}

.confirmation-content {
    .pi-exclamation-triangle {
        color: #f59e0b;
    }
}

/* Expand icon styling */
:deep(.p-row-toggler) {
    transition: transform 0.3s ease;
}

:deep(.p-row-toggler.p-icon) {
    color: #3b82f6;
}

:deep(.p-row-toggler:hover) {
    background-color: #f3f4f6;
    border-radius: 4px;
}

:deep(.p-row-toggler.p-row-toggler-open) {
    transform: rotate(90deg);
}

/* Expanded row styling */
:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
    background-color: #f0f9ff !important;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight td) {
    border-bottom: 1px solid #dbeafe !important;
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

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

/* Expanded row permission styling */
:deep(.permission-category) {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 8px;
}

:deep(.permission-category-header) {
    background-color: #f9fafb;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
}

:deep(.permission-item) {
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.2s;
}

:deep(.permission-item:hover) {
    background-color: #f9fafb;
}

:deep(.permission-item:last-child) {
    border-bottom: none;
}
</style>
