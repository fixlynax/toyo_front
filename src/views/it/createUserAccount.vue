<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User</div>

                <!-- Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <!-- Username -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">User Name</label>
                        <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
                    </div>

                    <!-- Email -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Email</label>
                        <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
                    </div>

                    <!-- Password -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Password</label>
                        <Password v-model="form.password" placeholder="Enter password" class="w-full" :feedback="false" toggleMask />
                    </div>

                    <!-- User Role -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">User Role</label>
                        <Select v-model="form.user_role_id" :options="userRoleOptions" optionLabel="label" optionValue="value" placeholder="Select user role" class="w-full" />
                    </div>

                    <!-- Full Name -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Full Name</label>
                        <InputText v-model="form.full_name" placeholder="Enter full name" class="w-full" />
                    </div>

                    <!-- Mobile Phone -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Mobile Phone</label>
                        <InputText v-model="form.mobilephone" placeholder="Enter mobile phone" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <Textarea v-model="form.description" rows="3" placeholder="Enter user description" class="w-full" />
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
                        <div v-for="func in group.functions" :key="func.function_id" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div class="flex-1">
                                <div class="font-medium text-gray-800">{{ func.function_name }}</div>
                                <div class="text-sm text-gray-500">{{ func.function_description }}</div>
                            </div>
                            <div class="flex gap-4 items-center">
                                <!-- None -->
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="permissionState[func.function_id]" :inputId="func.function_id + '_none'" :name="'perm_' + func.function_id" value="none" />
                                    <label :for="func.function_id + '_none'" class="cursor-pointer text-gray-600 text-sm">None</label>
                                </div>

                                <!-- Read -->
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="permissionState[func.function_id]" :inputId="func.function_id + '_read'" :name="'perm_' + func.function_id" value="read" />
                                    <label :for="func.function_id + '_read'" class="cursor-pointer text-blue-600 text-sm">Read</label>
                                </div>

                                <!-- Write -->
                                <div class="flex items-center gap-2">
                                    <RadioButton v-model="permissionState[func.function_id]" :inputId="func.function_id + '_write'" :name="'perm_' + func.function_id" value="write" />
                                    <label :for="func.function_id + '_write'" class="cursor-pointer text-green-600 text-sm">Write</label>
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
import Password from 'primevue/password';
import Checkbox from 'primevue/checkbox';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

const form = ref({
    username: '',
    email: '',
    password: '',
    user_role_id: null,
    full_name: '',
    mobilephone: '',
    description: '',
    status: 1,
    is_super_admin: 0,
    is_sales_person: 0
});

const permissionsDialogVisible = ref(false);
const submitting = ref(false);
const loadingRoles = ref(false);

// Options for dropdowns
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

// User roles based on your system
const userRoleOptions = ref([
    { label: 'Super Administrator', value: 1 },
    { label: 'Administrator', value: 2 },
    { label: 'OM User', value: 3 },
    { label: 'Credit Control User', value: 4 },
    { label: 'SCM User', value: 5 },
    { label: 'Technical User', value: 6 },
    { label: 'Sales Person', value: 7 }
]);

// Permission structure based on your user profile data
const permissionGroups = ref([
    {
        group_name: 'OM',
        group_id: 2,
        functions: [
            { function_id: 22, function_name: 'Back Order', function_code: '/om/listBackOrder', function_description: 'Process employee payroll' },
            { function_id: 20, function_name: 'Customer', function_code: '/om/listEten', function_description: 'Manage employee records' },
            { function_id: 21, function_name: 'Order', function_code: '/om/listOrder', function_description: 'Manage employee leave requests' },
            { function_id: 19, function_name: 'Order Dashboard', function_code: '/om/omDashboard', function_description: 'Generate financial reports' },
            { function_id: 62, function_name: 'Product List', function_code: '/om/listProduct', function_description: 'OM Material List' },
            { function_id: 23, function_name: 'Return Order', function_code: '/om/listReturnOrder', function_description: 'Return Order' },
            { function_id: 31, function_name: 'Sales Program', function_code: '/om/listSalesProgram', function_description: 'Dealer Billings' }
        ]
    },
    {
        group_name: 'IT & Administration',
        group_id: 3,
        functions: [
            { function_id: 47, function_name: 'Admin User', function_code: '/it/listUserAccount', function_description: 'Dealer Billings' },
            { function_id: 51, function_name: 'Email Setting', function_code: '/it/listMailSetting', function_description: 'Dealer Billings' },
            { function_id: 49, function_name: 'Maintenance Mode', function_code: '/it/maintenanceMode', function_description: 'Dealer Billings' },
            { function_id: 46, function_name: 'Role & Permission', function_code: '/it/ListGroup', function_description: 'Dealer Billings' },
            { function_id: 48, function_name: 'Salesman', function_code: '/it/listSalesAccount', function_description: 'Dealer Billings' },
            { function_id: 52, function_name: 'Terms & Conditions', function_code: '/it/termsCondition', function_description: 'Dealer Billings' }
        ]
    },
    {
        group_name: 'Credit Control',
        group_id: 4,
        functions: [
            { function_id: 53, function_name: 'Account Detail', function_code: '/billing/listAccountDetail', function_description: 'Dealer Billings' },
            { function_id: 59, function_name: 'BCP', function_code: '/billing/BCP', function_description: 'Business Contingency Plan' },
            { function_id: 54, function_name: 'E-Invoice', function_code: '/billing/listBilling', function_description: 'Dealer Billings' },
            { function_id: 60, function_name: 'Messaging', function_code: '/billing/listMessaging', function_description: 'Business Contingency Plan' },
            { function_id: 58, function_name: 'Others', function_code: '/billing/listOther', function_description: 'Dealer Billings' },
            { function_id: 56, function_name: 'Self Bill e-Invoice', function_code: '/billing/listEbilling', function_description: 'Dealer Billings' },
            { function_id: 57, function_name: 'Statement', function_code: '/billing/listStatement', function_description: 'Dealer Billings' }
        ]
    },
    {
        group_name: 'SCM',
        group_id: 5,
        functions: [
            { function_id: 45, function_name: '3PL Account', function_code: '/scm/listLogistic', function_description: 'Dealer Billings' },
            { function_id: 44, function_name: 'Area ETA', function_code: '/scm/listAreaETA', function_description: 'Dealer Billings' },
            { function_id: 39, function_name: 'CTC Collection', function_code: '/scm/listCollection', function_description: 'Dealer Billings' },
            { function_id: 40, function_name: 'CTC Return', function_code: '/scm/returnCollection', function_description: 'Dealer Billings' },
            { function_id: 41, function_name: 'Order Delivery', function_code: '/scm/listOrderDelivery', function_description: 'Dealer Billings' },
            { function_id: 61, function_name: 'Order Pickup', function_code: '/scm/listOrderPickup', function_description: 'Dealer Billings' },
            { function_id: 43, function_name: 'Return Order Collection', function_code: '/scm/listReturnOrder', function_description: 'Dealer Billings' }
        ]
    },
    {
        group_name: 'OM Report',
        group_id: 6,
        functions: [
            { function_id: 29, function_name: 'Back Order', function_code: '/om/reportBackOrder', function_description: 'Dealer Warranty Claim' },
            { function_id: 28, function_name: 'Direct Shipment', function_code: '/om/reportDirectShipment', function_description: 'Sales Report' },
            { function_id: 30, function_name: 'Own Collection', function_code: '/om/reportOwnCollection', function_description: 'Dealer Orders' },
            { function_id: 24, function_name: 'Sales Forecast', function_code: '/om/reportSF', function_description: 'View warranty and claims' }
        ]
    },
    {
        group_name: 'Technical',
        group_id: 7,
        functions: [
            { function_id: 14, function_name: 'Appointment', function_code: '/technical/listAppoitment', function_description: 'Manage email operations' },
            { function_id: 15, function_name: 'Warranty Claim', function_code: '/technical/listClaim', function_description: 'View and manage system logs' }
        ]
    },
    {
        group_name: 'Product',
        group_id: 13,
        functions: [
            { function_id: 18, function_name: 'OE Tire List', function_code: '/technical/listOETire', function_description: 'Process customer payments' },
            { function_id: 17, function_name: 'Pattern List', function_code: '/technical/listPattern', function_description: 'Create and track invoices' },
            { function_id: 16, function_name: 'Product List', function_code: '/technical/listProduct', function_description: 'Manage customer billing' }
        ]
    },
    {
        group_name: 'Maintenance',
        group_id: 15,
        functions: [
            { function_id: 35, function_name: 'Disable DS', function_code: '/om/listDisableOrderDS', function_description: 'Dealer Billings' },
            { function_id: 34, function_name: 'Disable Normal Order', function_code: '/om/listDisableOrderNS', function_description: 'Dealer Billings' },
            { function_id: 38, function_name: 'Material Exception', function_code: '/om/listMaterialException', function_description: 'Dealer Billings' },
            { function_id: 37, function_name: 'Month End Closing', function_code: '/om/listMonthEndClosing', function_description: 'Dealer Billings' }
        ]
    }
]);

// Initialize permission state with 'none' for each permission
const permissionState = reactive({});
permissionGroups.value.forEach((group) => {
    group.functions.forEach((func) => {
        permissionState[func.function_id] = 'none';
    });
});

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
const cancel = () => router.push('/it/listUserAccount');

// Permission management functions
const setAllPermissions = (type) => {
    permissionGroups.value.forEach((group) => {
        group.functions.forEach((func) => {
            permissionState[func.function_id] = type;
        });
    });
};

// Enhanced validation
const validateForm = () => {
    const errors = [];

    if (!form.value.username) errors.push('Username is required');
    if (!form.value.email) errors.push('Email is required');
    if (!form.value.password) errors.push('Password is required');
    if (!form.value.user_role_id) errors.push('User Role is required');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.value.email && !emailRegex.test(form.value.email)) {
        errors.push('Please enter a valid email address');
    }

    // Password strength validation
    if (form.value.password && form.value.password.length < 6) {
        errors.push('Password should be at least 6 characters long');
    }

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
                const permissionType = permissionState[func.function_id];
                if (permissionType !== 'none') {
                    permissionsArray.push({
                        function_id: func.function_id,
                        function_name: func.function_name,
                        function_code: func.function_code,
                        is_write: permissionType === 'write',
                        is_active: true
                    });
                }
            });
        });

        const payload = {
            name: form.value.username,
            email: form.value.email,
            password: form.value.password,
            user_role_id: form.value.user_role_id,
            full_name: form.value.full_name,
            mobilephone: form.value.mobilephone,
            description: form.value.description,
            permissions: permissionsArray,
            status: form.value.status,
            is_super_admin: form.value.is_super_admin ? 1 : 0,
            is_sales_person: form.value.is_sales_person ? 1 : 0
        };

        console.log('Creating user with payload:', JSON.stringify(payload, null, 2));

        // Use the appropriate endpoint for your API
        const response = await api.post('admin/create-user-role', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `User "${form.value.username}" created successfully!`,
                life: 5000
            });

            // Redirect to user list
            setTimeout(() => {
                router.push('/it/listUserAccount');
            }, 1500);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to create user',
                life: 4000
            });
        }
    } catch (err) {
        console.error('Error creating user:', err);

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
                detail: 'Something went wrong while creating the user',
                life: 5000
            });
        }
    } finally {
        submitting.value = false;
    }
};

onMounted(() => {
    // You can fetch actual roles from API if needed
    // fetchUserRoles();
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

:deep(.p-password) {
    width: 100%;
}

:deep(.p-password input) {
    width: 100%;
}
</style>
