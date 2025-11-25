<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User Role</div>

                <!-- Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <!-- Name -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Name</label>
                        <InputText v-model="form.name" placeholder="Enter role name" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <Textarea v-model="form.description" rows="3" placeholder="Enter role description" class="w-full" />
                    </div>

                    <!-- Permissions Dropdown -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Permissions</label>
                        <div class="flex items-center gap-2">
                            <InputText :value="getSelectedPermissionsText" placeholder="Click to set permissions" class="w-full" readonly @click="permissionsDialogVisible = true" />
                            <Button icon="pi pi-cog" class="p-button-outlined" @click="permissionsDialogVisible = true" tooltip="Configure Permissions" />
                        </div>
                        <small class="text-gray-500">
                            {{ getSelectedPermissionsCount }}
                        </small>
                    </div>
                    
                    <!-- Is Super Admin -->
                    <div class="md:col-span-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="form.is_super_admin" :binary="true" inputId="super_admin" />
                            <label for="super_admin" class="font-bold text-gray-700 cursor-pointer"> Super Administrator (Full system access) </label>
                        </div>
                    </div>

                    <!-- Is Sales Person -->
                    <div class="md:col-span-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="form.is_sales_person" :binary="true" inputId="sales_person" />
                            <label for="sales_person" class="font-bold text-gray-700 cursor-pointer"> Sales Person (Can place orders) </label>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Create" class="w-full p-button" @click="submitForm" :loading="submitting" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Permissions Dialog -->
        <Dialog v-model:visible="permissionsDialogVisible" header="Set Permissions" modal :closable="true" :focusOnShow="false" style="width: 60rem; max-width: 90vw">
            <div class="flex flex-col gap-6 max-h-96 overflow-y-auto">
                <!-- Quick Actions -->
                <div class="flex gap-2 mb-4">
                    <Button label="Set All Read" class="p-button-outlined p-button-sm" @click="setAllPermissions('read')" />
                    <Button label="Set All Write" class="p-button-outlined p-button-sm" @click="setAllPermissions('write')" />
                    <Button label="Clear All" class="p-button-outlined p-button-sm" @click="setAllPermissions('none')" />
                </div>

                <!-- Permission Groups -->
                <div v-for="group in permissionGroups" :key="group.group_id" class="border rounded-lg p-4">
                    <div class="font-bold text-lg mb-3 text-gray-800">
                        {{ group.group_name || 'General' }}
                    </div>
                    <div class="grid grid-cols-1 gap-3">
                        <div v-for="func in group.functions" :key="func.id" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ func.name }}</div>
                                <div class="text-sm text-gray-500">{{ func.description }}</div>
                                <div class="text-xs text-gray-400">{{ func.code }}</div>
                            </div>
                            <div class="flex gap-4 items-center">
                                <!-- None -->
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="permissionState[func.id]" :inputId="func.id + '_none'" :name="'perm_' + func.id" value="none" />
                                    <label :for="func.id + '_none'" class="cursor-pointer text-gray-600 text-sm">None</label>
                                </div>

                                <!-- Read -->
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="permissionState[func.id]" :inputId="func.id + '_read'" :name="'perm_' + func.id" value="read" />
                                    <label :for="func.id + '_read'" class="cursor-pointer text-blue-600 text-sm">Read</label>
                                </div>

                                <!-- Write -->
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="permissionState[func.id]" :inputId="func.id + '_write'" :name="'perm_' + func.id" value="write" />
                                    <label :for="func.id + '_write'" class="cursor-pointer text-green-600 text-sm">Write</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between items-center w-full">
                    <div class="text-sm text-gray-600">
                        {{ getSelectedPermissionsCount }}
                    </div>
                    <div class="flex gap-2">
                        <Button label="Close" class="p-button-secondary" @click="permissionsDialogVisible = false" />
                    </div>
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

const form = ref({
    name: '',
    description: '',
    status: 1,
    is_super_admin: 0,
    is_sales_person: 0
});

const permissionsDialogVisible = ref(false);
const submitting = ref(false);
const loadingPermissions = ref(false);

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

// Initialize permission state with 'none' for each permission
const permissionState = reactive({});

// Fetch permissions from API
const fetchPermissions = async () => {
    loadingPermissions.value = true;
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
            
            // Initialize permission state
            permissionGroups.value.forEach((group) => {
                group.functions.forEach((func) => {
                    permissionState[func.id] = 'none';
                });
            });
            
            console.log('Loaded permission groups:', permissionGroups.value);
        } else {
            console.error('Unexpected API response structure:', response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load permissions',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error fetching permissions:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load permissions',
            life: 4000
        });
    } finally {
        loadingPermissions.value = false;
    }
};

// Computed properties
const getActivePermissionsCount = computed(() => {
    return Object.values(permissionState).filter((val) => val !== 'none').length;
});

const getSelectedPermissionsCount = computed(() => {
    const activeCount = getActivePermissionsCount.value;
    const totalCount = permissionGroups.value.reduce((total, group) => total + group.functions.length, 0);
    return `${activeCount} of ${totalCount} permissions selected`;
});

const getSelectedPermissionsText = computed(() => {
    const activeCount = getActivePermissionsCount.value;
    return activeCount > 0 ? `${activeCount} permissions selected` : 'Click to set permissions';
});

// Watch reactive state and sync with form.permissions
watch(
    permissionState,
    (newVal) => {
        form.value.permissions = {};
        Object.keys(newVal).forEach((id) => {
            if (newVal[id] === 'read' || newVal[id] === 'write') {
                form.value.permissions[id] = newVal[id];
            }
        });
    },
    { deep: true }
);

// Watch super admin checkbox
watch(
    () => form.value.is_super_admin,
    (isSuperAdmin) => {
        if (isSuperAdmin) {
            // If super admin, set all permissions to write
            setAllPermissions('write');
        }
    }
);

// Cancel
const cancel = () => router.push('/it/ListGroup');

// Permission management functions
const setAllPermissions = (type) => {
    permissionGroups.value.forEach((group) => {
        group.functions.forEach((func) => {
            permissionState[func.id] = type;
        });
    });
};

// Enhanced validation
const validateForm = () => {
    const errors = [];

    if (!form.value.name) errors.push('Role name is required');
    if (!form.value.description) errors.push('Description is required');

    return errors;
};

// Submit
const submitForm = async () => {
    submitting.value = true;

    try {
        // Validate required fields
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: validationErrors.join('; '),
                life: 5000
            });
            return;
        }

        // Prepare permissions array in the format expected by your API
        const permissionsArray = [];
        permissionGroups.value.forEach((group) => {
            group.functions.forEach((func) => {
                const permissionType = permissionState[func.id];
                if (permissionType !== 'none') {
                    permissionsArray.push({
                        function_id: func.id,
                        function_name: func.name,
                        function_code: func.code,
                        is_write: permissionType === 'write',
                        is_active: true
                    });
                }
            });
        });

        const payload = {
            name: form.value.name,
            description: form.value.description,
            permissions: permissionsArray,
            status: form.value.status,
            is_super_admin: form.value.is_super_admin ? 1 : 0,
            is_sales_person: form.value.is_sales_person ? 1 : 0
        };

        console.log('Creating user role with payload:', JSON.stringify(payload, null, 2));

        // Use the appropriate endpoint for your API
        const response = await api.post('admin/create-user-role', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `User role "${form.value.name}" created successfully!`,
                life: 5000
            });

            // Redirect to user role list
            setTimeout(() => {
                router.push('/it/ListGroup');
            }, 1500);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to create user role',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error creating user role:', err);

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
        } else if (err.code === 'NETWORK_ERROR') {
            toast.add({
                severity: 'error',
                summary: 'Network Error',
                detail: 'Please check your internet connection',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong while creating the user role',
                life: 5000
            });
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    // Fetch permissions when component mounts
    fetchPermissions();
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