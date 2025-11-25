<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Group</div>
        <DataTable :value="listData" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" filterDisplay="menu" :globalFilterFields="['usergroup', 'modules', 'statusUser']">
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

                    <!-- Right: Create Group Button -->
                    <RouterLink to="/it/createGroup">
                        <Button type="button" label="Create" icon="pi pi-plus" />
                    </RouterLink>
                </div>
            </template>

            <!-- ========================= -->
            <!-- Empty / Loading Messages -->
            <!-- ========================= -->
            <template #empty> No User Group found. </template>
            <template #loading> Loading user group data. Please wait. </template>

            <!-- ========================= -->
            <!-- Data Columns -->
            <!-- ========================= -->
            <Column field="usergroup" header="User Group" style="min-width: 20rem" class="font-bold text-primary-400">
                <template #body="{ data }">
                    <span class="font-bold">{{ data.usergroup }}</span>
                </template>
            </Column>

            <Column field="description" header="Description" style="min-width: 25rem">
                <template #body="{ data }">
                    <span :class="{ 'text-gray-500 italic': !data.description }">
                        {{ data.description || '- No Description' }}
                    </span>
                </template>
            </Column>

            <Column field="modules" header="Module / Function List" style="min-width: 25rem">
                <template #body="{ data }">
                    <span :class="{ 'text-red-600': !data.modules }">
                        {{ data.modules || '- No Permissions' }}
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
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="deleteGroup(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Edit Group Dialog -->
        <Dialog v-model:visible="editDialogVisible" header="Edit User Role" modal :closable="true" :focusOnShow="false" style="width: 80rem; max-width: 95vw">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left Column: Basic Information -->
                <div class="space-y-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Name</label>
                        <InputText v-model="editForm.name" placeholder="Enter role name" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="editForm.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <Textarea v-model="editForm.description" rows="3" placeholder="Enter role description" class="w-full" />
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="editForm.is_super_admin" :binary="true" inputId="edit_super_admin" />
                            <label for="edit_super_admin" class="font-bold text-gray-700 cursor-pointer"> Super Administrator (Full system access) </label>
                        </div>

                        <div class="flex items-center gap-2">
                            <Checkbox v-model="editForm.is_sales_person" :binary="true" inputId="edit_sales_person" />
                            <label for="edit_sales_person" class="font-bold text-gray-700 cursor-pointer"> Sales Person (Can place orders) </label>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Permissions -->
                <div class="border-l pl-6">
                    <div class="flex justify-between items-center mb-4">
                        <label class="block font-bold text-gray-700">Permissions</label>
                        <div class="flex gap-2">
                            <Button label="Set All Read" class="p-button-outlined p-button-sm" @click="setAllEditPermissions('read')" />
                            <Button label="Set All Write" class="p-button-outlined p-button-sm" @click="setAllEditPermissions('write')" />
                            <Button label="Clear All" class="p-button-outlined p-button-sm" @click="setAllEditPermissions('none')" />
                        </div>
                    </div>
                    
                    <div class="text-sm text-gray-600 mb-4">
                        {{ getEditPermissionsCount }}
                    </div>

                    <div class="space-y-4 max-h-96 overflow-y-auto">
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
                    <Button label="Update" class="p-button" @click="updateGroup" :loading="updating" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();
const listData = ref([]);
const loading = ref(true);
const updating = ref(false);

// Dialogs
const editDialogVisible = ref(false);

// Forms
const editForm = ref({
    id: null,
    name: '',
    description: '',
    status: 1,
    is_super_admin: 0,
    is_sales_person: 0
});

// Permission states
const editPermissionState = reactive({});

// Options for dropdowns
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

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

// Watch super admin checkbox in edit form
watch(
    () => editForm.value.is_super_admin,
    (isSuperAdmin) => {
        if (isSuperAdmin) {
            setAllEditPermissions('write');
        }
    }
);

// Fetch permissions from API
const fetchPermissions = async () => {
    try {
        const response = await api.get('admin/list-function');
        
        if (response.data && Array.isArray(response.data)) {
            const functions = response.data;
            
            // Group functions by function_group_id
            const groupedFunctions = {};
            
            functions.forEach(func => {
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
            
            console.log('Loaded permission groups from admin/list-function:', permissionGroups.value);
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
const fetchGroups = async () => {
    loading.value = true;
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
                modules: group.permissions && group.permissions.length > 0 
                    ? group.permissions.map(p => p.function_name).join(', ')
                    : null,
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
    } finally {
        loading.value = false;
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
    permissions.forEach(permission => {
        if (editPermissionState[permission.function_id] !== undefined) {
            editPermissionState[permission.function_id] = permission.is_write ? 'write' : 'read';
        }
    });
};

// Edit group
const editGroup = async (group) => {
    try {
        // Use the existing group data from the list (no need to fetch again)
        // Populate edit form
        editForm.value = {
            id: group.id,
            name: group.usergroup,
            description: group.description,
            status: group.statusUser,
            is_super_admin: group.is_super_admin,
            is_sales_person: group.is_sales_person
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

// Update group
const updateGroup = async () => {
    updating.value = true;

    try {
        // Validate form
        if (!editForm.value.name) {
            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Role name is required',
                life: 4000
            });
            return;
        }

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
            name: editForm.value.name,
            description: editForm.value.description,
            status: editForm.value.status,
            is_super_admin: editForm.value.is_super_admin ? 1 : 0,
            is_sales_person: editForm.value.is_sales_person ? 1 : 0,
            permissions: permissionsArray
        };

        console.log('Updating user role with payload:', JSON.stringify(payload, null, 2));

        // Use the update-user-role-permission endpoint
        const response = await api.post(`admin/update-user-role-permission/${editForm.value.id}`, payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `User role "${editForm.value.name}" updated successfully!`,
                life: 5000
            });

            // Refresh the list
            await fetchGroups();
            
            // Close dialog
            editDialogVisible.value = false;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to update user role',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error updating user role:', err);
        
        // Handle specific error cases
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
                detail: 'Something went wrong while updating the user role',
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

// Delete group
const deleteGroup = (group) => {
    console.log('Deleting group:', group);
    // Add your delete logic here
};

onMounted(() => {
    // Fetch both groups and permissions
    Promise.all([fetchGroups(), fetchPermissions()]);
});
</script>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-radiobutton .p-radiobutton-box) {
    border-radius: 50%;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

:deep(.p-select) {
    width: 100%;
}
</style>