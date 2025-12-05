<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List Group</div>

        <!-- Show LoadingPage during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Group...'" :sub-message="'Fetching list Group'" />

        <!-- Show LoadingPage during table reloads -->
        <LoadingPage v-else-if="loading && !initialLoading" :message="'Refreshing Data...'" :sub-message="'Updating group information'" :is-full-page="false" />

        <!-- Show DataTable when not loading -->
        <DataTable
            v-else
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50, 100]"
            dataKey="id"
            :rowHover="true"
            v-model:expandedRows="expandedRows"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['usergroup', 'description', 'statusUser']"
            class="rounded-table"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        >
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
                    </div>

                    <!-- Right: Create Group Button -->
                    <RouterLink to="/it/createGroup">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8">
                    <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500">No User Group found.</p>
                </div>
            </template>

            <!-- Expand/Collapse Column -->
            <Column :expander="true" headerStyle="width: 3rem" />

            <Column field="usergroup" header="User Group" style="min-width: 20rem" class="font-bold text-primary-400">
                <template #body="{ data }">
                    <span class="font-bold">{{ data.usergroup }}</span>
                </template>
            </Column>

            <Column field="description" header="Description" style="min-width: 25rem">
                <template #body="{ data }">
                    <span :class="{ 'text-gray-500 italic': !data.description }">
                        {{ data.description || 'No Description' }}
                    </span>
                </template>
            </Column>

            <Column header="Total Function" style="min-width: 25rem">
                <template #body="{ data }">
                    <span :class="data.permissions && data.permissions.length > 0 ? '' : 'text-red-500'">
                        {{ data.permissions && data.permissions.length > 0 ? data.permissions.length : 'No Permission' }}
                    </span>
                </template>
            </Column>

            <Column field="is_super_admin" header="Super Admin" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.is_super_admin ? 'Yes' : 'No'" :severity="data.is_super_admin ? 'info' : 'secondary'" />
                </template>
            </Column>

            <Column field="is_sales_person" header="Sales Person" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="data.is_sales_person ? 'Yes' : 'No'" :severity="data.is_sales_person ? 'warning' : 'secondary'" />
                </template>
            </Column>

            <Column field="statusUser" header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag :value="data.statusUser === 1 ? 'Active' : 'Inactive'" :severity="data.statusUser === 1 ? 'success' : 'danger'" />
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" @click="editGroup(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="confirmDeleteGroup(data)" />
                    </div>
                </template>
            </Column>

            <!-- Expanded Row Template - Permission Details Only -->
            <template #expansion="{ data }">
                <div>
                    <!-- Permission Categories -->
                    <div v-if="data.permissions && data.permissions.length > 0" class="space-y-4">
                        <!-- Group permissions by category -->
                        <div v-for="(groupPermissions, groupName) in groupPermissionsByCategory(data.permissions)" :key="groupName" class="border rounded-lg overflow-hidden">
                            <!-- Category Header -->
                            <div class="bg-gray-100 px-4 py-2 border-b">
                                <div class="flex justify-between items-center">
                                    <h5 class="font-semibold text-gray-700">{{ groupName }}</h5>
                                    <!-- <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded"> {{ groupPermissions.length }} permission(s) </span> -->
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

                            <!-- Permissions List -->
                            <div class="bg-white">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 p-3">
                                    <div v-for="perm in groupPermissions" :key="perm.function_id" class="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-gray-800">{{ perm.function_name }}</div>
                                            <div class="text-xs text-gray-500 truncate" :title="perm.description || ''">
                                                {{ perm.function_description || 'No description' }}
                                            </div>
                                        </div>
                                        <Tag :value="perm.is_write ? 'Write' : 'Read'" :severity="perm.is_write ? 'success' : 'info'" size="small" class="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- No Permissions State -->
                    <div v-else class="text-center py-6">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            <i class="pi pi-lock text-gray-400 text-xl"></i>
                        </div>
                        <p class="text-gray-500 font-medium">No permissions assigned to this user group</p>
                        <p class="text-gray-400 text-sm mt-1">Click the edit button to add permissions</p>
                    </div>
                </div>
            </template>
        </DataTable>

        <!-- Edit Group Dialog (Simplified - Only Permissions) -->
        <Dialog v-model:visible="editDialogVisible" header="Edit User Role Permissions" modal :closable="true" :focusOnShow="false" style="width: 60rem; max-width: 95vw">
            <div class="grid grid-cols-1">
                <!-- Permissions Section -->
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <label class="block font-bold text-gray-700">Permissions for: {{ editForm.name }}</label>
                            <div class="text-sm text-gray-600">
                                {{ getEditPermissionsCount }}
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <Button label="Set All Read" class="p-button-outlined p-button-sm" @click="setAllEditPermissions('read')" />
                            <Button label="Set All Write" class="p-button-outlined p-button-sm" @click="setAllEditPermissions('write')" />
                            <Button label="Clear All" class="p-button-outlined p-button-sm" @click="setAllEditPermissions('none')" />
                        </div>
                    </div>

                    <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
                        <div v-for="group in permissionGroups" :key="group.group_id" class="border rounded-lg p-3">
                            <div class="font-bold text-md mb-2 text-gray-800">
                                {{ group.group_name || 'General' }}
                            </div>
                            <div class="space-y-2">
                                <div v-for="func in group.functions" :key="func.id" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-800 text-sm">{{ func.name }}</div>
                                        <div class="text-xs text-gray-500">{{ func.description }}</div>
                                    </div>
                                    <div class="flex gap-2 items-center">
                                        <!-- None -->
                                        <div class="flex items-center gap-1">
                                            <RadioButton v-model="editPermissionState[func.id]" :inputId="'edit_' + func.id + '_none'" :name="'edit_perm_' + func.id" value="none" />
                                            <label :for="'edit_' + func.id + '_none'" class="cursor-pointer text-gray-600 text-xs">None</label>
                                        </div>

                                        <!-- Read -->
                                        <div class="flex items-center gap-1">
                                            <RadioButton v-model="editPermissionState[func.id]" :inputId="'edit_' + func.id + '_read'" :name="'edit_perm_' + func.id" value="read" />
                                            <label :for="'edit_' + func.id + '_read'" class="cursor-pointer text-blue-600 text-xs">Read</label>
                                        </div>

                                        <!-- Write -->
                                        <div class="flex items-center gap-1">
                                            <RadioButton v-model="editPermissionState[func.id]" :inputId="'edit_' + func.id + '_write'" :name="'edit_perm_' + func.id" value="write" />
                                            <label :for="'edit_' + func.id + '_write'" class="cursor-pointer text-green-600 text-xs">Write</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2 w-full">
                    <Button label="Cancel" class="p-button-secondary" @click="editDialogVisible = false" />
                    <Button label="Update Permissions" class="p-button" @click="updateGroupPermissions" :loading="updating" />
                </div>
            </template>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:visible="deleteDialogVisible" header="Confirm Deletion" modal :closable="true" :style="{ width: '450px' }">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="selectedGroup">
                    Are you sure you want to delete the user role <strong>"{{ selectedGroup.usergroup }}"</strong>?
                </span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialogVisible = false" />
                <Button label="Yes" icon="pi pi-check" class="p-button-danger" @click="checkRoleHasActiveUsers" :loading="checkingActiveUsers" />
            </template>
        </Dialog>

        <!-- Role has active users dialog -->
        <Dialog v-model:visible="hasActiveUsersDialog" header="Role Has Active Users" modal :closable="true" :style="{ width: '500px' }">
            <div class="confirmation-content flex-col items-start">
                <div class="flex items-center mb-4">
                    <i class="pi pi-exclamation-triangle mr-3 text-yellow-600" style="font-size: 2rem" />
                    <span class="text-gray-700"> This User Role has existing users. You will need to select a new user role to assign to existing users before deleting this role. </span>
                </div>

                <div class="w-full mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Select New Role for Existing Users</label>
                    <Dropdown v-model="selectedNewRoleId" :options="availableRoles" optionLabel="usergroup" optionValue="id" placeholder="Select a role" class="w-full" :class="{ 'p-invalid': !selectedNewRoleId }" />
                    <small class="text-red-500 mt-1 block" v-if="!selectedNewRoleId">Please select a role to proceed</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hasActiveUsersDialog = false" />
                <Button label="Proceed" icon="pi pi-check" class="p-button-warning" @click="assignAndDelete" :loading="assigningRole" />
            </template>
        </Dialog>

        <!-- Final delete confirmation after reassignment -->
        <Dialog v-model:visible="finalDeleteDialog" header="Confirm Final Deletion" modal :closable="true" :style="{ width: '450px' }">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="selectedGroup">
                    Role assignment completed successfully. <br /><br />
                    Do you want to delete the role <strong>"{{ selectedGroup.usergroup }}"</strong> now?
                </span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="finalDeleteDialog = false" />
                <Button label="Yes, Delete" icon="pi pi-check" class="p-button-danger" @click="performFinalDelete" :loading="deleting" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const router = useRouter();
const toast = useToast();
const listData = ref([]);
const loading = ref(false);
const initialLoading = ref(true);
const updating = ref(false);
const deleting = ref(false);
const checkingActiveUsers = ref(false);
const assigningRole = ref(false);

// Expanded rows state
const expandedRows = ref([]);

// Dialogs
const editDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const hasActiveUsersDialog = ref(false);
const finalDeleteDialog = ref(false);

// Selected group for deletion
const selectedGroup = ref(null);
const selectedNewRoleId = ref(null);
const availableRoles = ref([]);

// Forms
const editForm = ref({
    id: null,
    name: ''
});

// Permission states
const editPermissionState = reactive({});

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

// Permission groups (will be populated from API)
const permissionGroups = ref([]);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Computed properties for edit dialog
const getEditPermissionsCount = computed(() => {
    const activeCount = Object.values(editPermissionState).filter((val) => val !== 'none').length;
    const totalCount = permissionGroups.value.reduce((total, group) => total + group.functions.length, 0);
    return `${activeCount} of ${totalCount} permissions selected`;
});

// Helper functions
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
        // Try to get the group name from function_group_id in permission data
        let groupName = 'General';
        if (permission.function_group_id && functionGroupMap[permission.function_group_id]) {
            groupName = functionGroupMap[permission.function_group_id];
        } else if (permission.function_group_name) {
            groupName = permission.function_group_name;
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

// Fetch permissions from API
const fetchPermissions = async () => {
    try {
        const response = await api.get('admin/list-function');

        if (response.data && Array.isArray(response.data)) {
            const functions = response.data;

            // Group functions by function_group_id
            const groupedFunctions = {};

            functions.forEach((func) => {
                if (!groupedFunctions[func.function_group_id]) {
                    groupedFunctions[func.function_group_id] = [];
                }
                groupedFunctions[func.function_group_id].push(func);
            });

            // Convert to permissionGroups format
            permissionGroups.value = Object.entries(groupedFunctions).map(([groupId, functions]) => ({
                group_id: parseInt(groupId),
                group_name: functionGroupMap[groupId] || `Group ${groupId}`,
                functions: functions.sort((a, b) => a.sort - b.sort)
            }));

            // Sort groups by group_id for consistent display
            permissionGroups.value.sort((a, b) => a.group_id - b.group_id);
        }
    } catch (err) {
        console.error('Error fetching permissions from admin/list-function:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load permissions',
            life: 4000
        });
    }
};

// Fetch group data
const fetchGroups = async (showLoading = true) => {
    if (showLoading) {
        loading.value = true;
    }
    try {
        const res = await api.get('admin/list-user-role');

        if (res.data && res.data.status === 1 && Array.isArray(res.data.data)) {
            const raw = res.data.data;

            listData.value = raw.map((group) => ({
                id: group.id,
                usergroup: group.name,
                description: group.description,
                is_super_admin: group.is_super_admin,
                is_sales_person: group.is_sales_person,
                statusUser: group.status ? 1 : 0,
                permissions: group.permissions || [],
                created: group.created
            }));
        } else {
            console.error('Unexpected API response structure:', res.data);
            listData.value = [];
        }
    } catch (err) {
        console.error('Error fetching user roles:', err);
        listData.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load user roles',
            life: 4000
        });
    } finally {
        if (showLoading) {
            loading.value = false;
        }
        initialLoading.value = false;
    }
};

// Initialize edit permission state
const initializeEditPermissionState = (permissions = []) => {
    // Reset all permissions to 'none' first
    permissionGroups.value.forEach((group) => {
        group.functions.forEach((func) => {
            editPermissionState[func.id] = 'none';
        });
    });

    // Set permissions based on existing role permissions
    permissions.forEach((permission) => {
        if (editPermissionState[permission.function_id] !== undefined) {
            editPermissionState[permission.function_id] = permission.is_write ? 'write' : 'read';
        }
    });
};

// Edit group (now only for permissions)
const editGroup = async (group) => {
    try {
        // Populate edit form with minimal info
        editForm.value = {
            id: group.id,
            name: group.usergroup
        };

        // Initialize permission state with current permissions
        initializeEditPermissionState(group.permissions || []);

        // Show edit dialog
        editDialogVisible.value = true;
    } catch (err) {
        console.error('Error loading group details:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load group details',
            life: 4000
        });
    }
};

// Update group permissions only
const updateGroupPermissions = async () => {
    updating.value = true;

    try {
        // Prepare permissions array for the update endpoint
        const permissionsArray = [];
        permissionGroups.value.forEach((group) => {
            group.functions.forEach((func) => {
                const permissionType = editPermissionState[func.id];
                if (permissionType !== 'none') {
                    permissionsArray.push({
                        function_id: func.id,
                        is_write: permissionType === 'write' ? 1 : 0
                    });
                }
            });
        });

        // Prepare payload for update-user-role-permission endpoint
        const payload = {
            user_role_id: editForm.value.id,
            permissions: permissionsArray
        };

        const response = await api.post('admin/update-user-role-permission', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Permissions for "${editForm.value.name}" updated successfully!`,
                life: 5000
            });

            await fetchGroups();
            editDialogVisible.value = false;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to update permissions',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error updating user role permissions:', err);

        if (err.response?.data?.validation_errors) {
            const validationErrors = err.response.data.validation_errors;
            const errorMessages = Object.entries(validationErrors)
                .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                .join('; ');

            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: errorMessages || 'Please check your input data',
                life: 6000
            });
        } else if (err.response?.data?.message) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: err.response.data.message,
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong while updating permissions',
                life: 5000
            });
        }
    } finally {
        updating.value = false;
    }
};

// Permission management functions for edit dialog
const setAllEditPermissions = (type) => {
    permissionGroups.value.forEach((group) => {
        group.functions.forEach((func) => {
            editPermissionState[func.id] = type;
        });
    });
};

// Delete group functions
const confirmDeleteGroup = (group) => {
    selectedGroup.value = group;
    deleteDialogVisible.value = true;
};

// Check if role has active users
const checkRoleHasActiveUsers = async () => {
    if (!selectedGroup.value) return;

    checkingActiveUsers.value = true;

    try {
        const payload = {
            user_role_id: selectedGroup.value.id
        };

        const response = await api.post('admin/check-user-role', payload);

        if (response.data.success === true) {
            // Role has active users - show reassignment dialog
            deleteDialogVisible.value = false;

            // Get available roles (excluding the current one)
            availableRoles.value = listData.value.filter((role) => role.id !== selectedGroup.value.id);

            selectedNewRoleId.value = null;
            hasActiveUsersDialog.value = true;
        } else {
            // Role has no active users - proceed directly to delete
            await performDelete();
        }
    } catch (err) {
        console.error('Error checking active users:', err);

        if (err.response?.status === 404) {
            // If 404, role has no active users (based on API logic)
            await performDelete();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: err.response?.data?.message || 'Failed to check role usage',
                life: 4000
            });
            deleteDialogVisible.value = false;
        }
    } finally {
        checkingActiveUsers.value = false;
    }
};

// Assign users to new role and prepare for deletion
const assignAndDelete = async () => {
    if (!selectedGroup.value || !selectedNewRoleId.value) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a role to assign existing users to',
            life: 4000
        });
        return;
    }

    assigningRole.value = true;

    try {
        const payload = {
            from_role_id: selectedGroup.value.id,
            to_role_id: selectedNewRoleId.value
        };

        const response = await api.post('admin/assign-user-role', payload);

        if (response.data.success === true) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || 'Users reassigned successfully',
                life: 5000
            });

            // Close current dialog and show final delete confirmation
            hasActiveUsersDialog.value = false;
            finalDeleteDialog.value = true;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to reassign users',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error assigning user role:', err);

        if (err.response?.data?.message) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: err.response.data.message,
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong while reassigning users',
                life: 5000
            });
        }
    } finally {
        assigningRole.value = false;
    }
};

// Perform the actual deletion
const performDelete = async () => {
    if (!selectedGroup.value) return;

    deleting.value = true;

    try {
        const payload = {
            user_role_id: selectedGroup.value.id
        };

        const response = await api.post('admin/delete-user-role', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `User role "${selectedGroup.value.usergroup}" deleted successfully!`,
                life: 5000
            });

            await fetchGroups();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to delete user role',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error deleting user role:', err);

        if (err.response?.data?.message) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: err.response.data.message,
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong while deleting the user role',
                life: 5000
            });
        }
    } finally {
        deleting.value = false;
        deleteDialogVisible.value = false;
        selectedGroup.value = null;
        selectedNewRoleId.value = null;
        finalDeleteDialog.value = false;
    }
};

// Final delete after reassignment
const performFinalDelete = async () => {
    finalDeleteDialog.value = false;
    await performDelete();
};

onMounted(() => {
    Promise.all([fetchGroups(), fetchPermissions()]);
});
</script>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    min-height: 400px;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
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

:deep(.p-radiobutton .p-radiobutton-box) {
    border-radius: 50%;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

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

/* Loading container styles */
.loading-container {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
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

:deep(.p-dropdown) {
    width: 100%;
}
</style>
