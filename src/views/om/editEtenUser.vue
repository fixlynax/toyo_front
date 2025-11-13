<template>
    <Fluid>
        <div class="card flex flex-col gap-6 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-4">Edit Eten User</div>

            <!-- User Information Card -->
            <Card class="mb-4">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-user text-primary"></i>
                        <span class="text-xl font-semibold">User Information</span>
                    </div>
                </template>
                <template #content>
                    <!-- Member Code (Readonly) -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                        <label class="block font-semibold text-gray-700 mb-2">Member Code</label>
                        <InputText disabled v-model="memberDetail.etenUserID" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- First Name -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">First Name</label>
                            <InputText v-model="form.first_name" class="w-full" placeholder="Enter first name" :class="{ 'p-invalid': errors.first_name }" />
                            <small class="text-red-500 text-sm" v-if="errors.first_name"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.first_name }} </small>
                        </div>

                        <!-- Last Name -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700">Last Name</label>
                            <InputText v-model="form.last_name" class="w-full" placeholder="Enter last name" />
                        </div>

                        <!-- Email -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Email</label>
                            <InputText v-model="form.email" type="email" class="w-full" placeholder="Enter email" :class="{ 'p-invalid': errors.email }" />
                            <small class="text-red-500 text-sm" v-if="errors.email"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.email }} </small>
                        </div>

                        <!-- Mobile Number -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Mobile Number</label>
                            <div class="flex gap-2">
                                <div class="w-32">
                                    <Dropdown v-model="form.countryCode" :options="countryCodes" optionLabel="label" optionValue="value" class="w-full" placeholder="Code" :class="{ 'p-invalid': errors.countryCode }" />
                                </div>
                                <div class="flex-1">
                                    <InputText v-model="form.mobileNum" class="w-full" placeholder="Enter mobile number" :class="{ 'p-invalid': errors.mobileNum }" />
                                </div>
                            </div>
                            <small class="text-red-500 text-sm" v-if="errors.countryCode || errors.mobileNum">
                                <i class="pi pi-exclamation-circle mr-1"></i>
                                {{ errors.countryCode || errors.mobileNum }}
                            </small>
                        </div>

                        <!-- Password -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700">Password</label>
                            <Password v-model="form.password" :feedback="false" toggleMask class="w-full" placeholder="Enter new password" :class="{ 'p-invalid': errors.password }" :inputClass="'w-full'" />
                            <small class="text-red-500 text-sm" v-if="errors.password"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.password }} </small>
                            <small class="text-gray-500 text-sm flex items-center gap-1">
                                <i class="pi pi-info-circle"></i>
                                Leave blank to keep current password
                            </small>
                        </div>

                        <!-- Confirm Password -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700">Confirm Password</label>
                            <Password v-model="form.confirm_password" :feedback="false" toggleMask class="w-full" placeholder="Confirm new password" :class="{ 'p-invalid': errors.confirm_password }" :inputClass="'w-full'" />
                            <small class="text-red-500 text-sm" v-if="errors.confirm_password"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.confirm_password }} </small>
                        </div>

                        <!-- Master User -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Master User</label>
                            <Dropdown v-model="form.isMaster" :options="masterOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select" :class="{ 'p-invalid': errors.isMaster }" />
                            <small class="text-gray-500 text-sm flex items-center gap-1">
                                <i class="pi pi-info-circle"></i>
                                Master users have access to all modules
                            </small>
                            <small class="text-red-500 text-sm" v-if="errors.isMaster"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.isMaster }} </small>
                        </div>

                        <!-- Status -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Status</label>
                            <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select status" :class="{ 'p-invalid': errors.status }" />
                            <small class="text-red-500 text-sm" v-if="errors.status"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.status }} </small>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Modules Access Card -->
            <Card class="mb-4" v-if="form.isMaster === 0">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-th-large text-primary"></i>
                        <span class="text-xl font-semibold">Modules Access</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="module in moduleOptions" :key="module.value" class="flex items-center">
                            <Checkbox v-model="form.modules" :inputId="module.value" :value="module.value" :binary="false" class="mr-3" />
                            <label :for="module.value" class="text-gray-700 cursor-pointer">
                                {{ module.label }}
                            </label>
                        </div>
                    </div>
                    <small class="text-red-500 text-sm mt-2" v-if="errors.modules"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.modules }} </small>
                    <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <div class="flex items-center gap-2 text-blue-700">
                            <i class="pi pi-info-circle"></i>
                            <span class="text-sm">Select modules that this user should have access to</span>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Master User Notice -->
            <Card class="mb-4" v-if="form.isMaster === 1">
                <template #content>
                    <div class="p-4 bg-yellow-50 rounded border border-yellow-200">
                        <div class="flex items-center gap-3">
                            <i class="pi pi-shield text-yellow-600 text-xl"></i>
                            <div>
                                <h4 class="font-semibold text-yellow-800">Master User Access</h4>
                                <p class="text-yellow-700 text-sm mt-1">This user will have full access to all modules and system functionalities. Only one master user is allowed per dealer account.</p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Action Buttons -->
            <Card>
                <template #content>
                    <div class="flex flex-col md:flex-row justify-end gap-3">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-secondary w-full md:w-auto" @click="handleCancel" :disabled="loading" />
                        <Button label="Update User" icon="pi pi-check" class="w-full md:w-auto" @click="handleUpdate" :loading="loading" />
                    </div>
                </template>
            </Card>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const loadingData = ref(false);

const countryCodes = ref([
    { label: 'Malaysia (+60)', value: '60' },
    { label: 'Singapore (+65)', value: '65' }
]);

const masterOptions = ref([
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
]);

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
]);

const moduleOptions = [
    { label: 'Warranty Management', value: 'mod_warranty' },
    { label: 'Order Management', value: 'mod_order' },
    { label: 'Billing Management', value: 'mod_billing' },
    { label: 'Sales Management', value: 'mod_sale' },
    { label: 'User Management', value: 'mod_user' }
];

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    mobileNum: '',
    countryCode: '60',
    password: '',
    confirm_password: '',
    dealerAccountNo: '',
    shiptoID: null,
    modules: [],
    isMaster: 0,
    status: 1
});

const errors = ref({});
const memberDetail = ref({});
const originalData = ref({});
const originalPassword = ref(''); // Store original password state

// Computed property to check if form has been modified
const isFormModified = computed(() => {
    const original = originalData.value;
    const current = form.value;

    return (
        current.first_name !== original.firstName ||
        current.last_name !== original.lastName ||
        current.email !== original.emailAddress ||
        current.countryCode !== original.countryCode ||
        current.mobileNum !== original.mobileNumber ||
        current.isMaster !== original.isMaster ||
        current.status !== original.status ||
        current.password || // Password is being changed
        JSON.stringify(current.modules) !== JSON.stringify(getOriginalModules(original))
    );
});

// Watch for isMaster changes to handle module access
watch(
    () => form.value.isMaster,
    (newValue) => {
        if (newValue === 1) {
            // If master user, select all modules
            form.value.modules = moduleOptions.map((module) => module.value);
        } else {
            // If switching from master to non-master, clear modules
            // This gives user a clean slate to select modules
            form.value.modules = [];
        }
    }
);

onMounted(() => {
    loadUserData();
});

// Helper function to get original modules from user data
const getOriginalModules = (userData) => {
    if (userData.isMaster === 1) {
        return moduleOptions.map((module) => module.value);
    }

    const selectedModules = [];
    if (userData.allow_warranty === 1) selectedModules.push('mod_warranty');
    if (userData.allow_order === 1) selectedModules.push('mod_order');
    if (userData.allow_billing === 1) selectedModules.push('mod_billing');
    if (userData.allow_sale === 1) selectedModules.push('mod_sale');
    if (userData.allow_user === 1) selectedModules.push('mod_user');
    return selectedModules;
};

const loadUserData = async () => {
    loadingData.value = true;
    try {
        const userId = route.params.id;
        const response = await api.get(`detail_dealer_user/${userId}`);

        if (response.data.status === 1) {
            const userData = response.data.admin_data.userData;
            memberDetail.value = userData;
            originalData.value = { ...userData };

            // Populate form with existing user data
            form.value.first_name = userData.firstName || '';
            form.value.last_name = userData.lastName || '';
            form.value.email = userData.emailAddress || '';
            form.value.countryCode = userData.countryCode || '60';
            form.value.mobileNum = userData.mobileNumber || '';
            form.value.isMaster = userData.isMaster || 0;
            form.value.status = userData.status || 1;
            form.value.dealerAccountNo = userData.dealerAccountNo || '';

            // Set modules based on permissions
            form.value.modules = getOriginalModules(userData);

            // Store that we have an existing password (for validation purposes)
            originalPassword.value = userData.password;

            console.log('Loaded user data:', userData);
            console.log('Set modules:', form.value.modules);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load user data',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while loading user data',
            life: 5000
        });
    } finally {
        loadingData.value = false;
    }
};

const validateForm = () => {
    errors.value = {};

    // First Name validation
    if (!form.value.first_name.trim()) {
        errors.value.first_name = 'First name is required';
    } else if (form.value.first_name.trim().length < 2) {
        errors.value.first_name = 'First name must be at least 2 characters';
    }

    // Email validation
    if (!form.value.email.trim()) {
        errors.value.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email address';
    }

    // Country Code validation
    if (!form.value.countryCode) {
        errors.value.countryCode = 'Country code is required';
    }

    // Mobile Number validation
    if (!form.value.mobileNum.trim()) {
        errors.value.mobileNum = 'Mobile number is required';
    } else if (!/^\d+$/.test(form.value.mobileNum.replace(/\s/g, ''))) {
        errors.value.mobileNum = 'Mobile number must contain only digits';
    } else if (form.value.mobileNum.replace(/\s/g, '').length < 8) {
        errors.value.mobileNum = 'Mobile number is too short';
    }

    // Password validation - only validate if user is changing password
    const isChangingPassword = form.value.password || form.value.confirm_password;
    
    if (isChangingPassword) {
        if (!form.value.password) {
            errors.value.password = 'Password is required when confirming password';
        } else if (form.value.password.length < 6) {
            errors.value.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
            errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (!form.value.confirm_password) {
            errors.value.confirm_password = 'Please confirm your password';
        } else if (form.value.password !== form.value.confirm_password) {
            errors.value.confirm_password = 'Passwords do not match';
        }
    }

    // Master user validation
    if (form.value.isMaster === null || form.value.isMaster === undefined || form.value.isMaster === '') {
        errors.value.isMaster = 'Please specify if this is a master user';
    }

    // Status validation
    if (form.value.status === null || form.value.status === undefined || form.value.status === '') {
        errors.value.status = 'Please select user status';
    }

    // Module validation for non-master users
    if (form.value.isMaster === 0 && (!form.value.modules || form.value.modules.length === 0)) {
        errors.value.modules = 'Please select at least one module for non-master users';
    }

    console.log('Validation errors:', errors.value);
    return Object.keys(errors.value).length === 0;
};

const createFormData = () => {
    const formData = new FormData();

    // Append all form fields
    formData.append('first_name', form.value.first_name.trim());
    formData.append('last_name', form.value.last_name.trim());
    formData.append('email', form.value.email.trim().toLowerCase());
    formData.append('countryCode', form.value.countryCode);
    formData.append('mobileNum', form.value.mobileNum.replace(/\s/g, ''));
    formData.append('dealerAccountNo', form.value.dealerAccountNo);
    formData.append('shiptoID', form.value.shiptoID || '');
    formData.append('isMaster', form.value.isMaster);
    formData.append('status', form.value.status);

    // Handle password - only send if changed, otherwise send current password
    const isChangingPassword = form.value.password && form.value.confirm_password;
    
    if (isChangingPassword) {
        formData.append('password', form.value.password);
        formData.append('confirm_password', form.value.confirm_password);
    } else {
        // For update, we need to handle password differently
        // Since backend requires password field, we need to work around this
        // One approach: send a placeholder and handle in backend
        formData.append('password', 'no_change');
        formData.append('confirm_password', 'no_change');
    }

    // Append module permissions
    formData.append('mod_warranty', form.value.isMaster === 1 ? 1 : form.value.modules.includes('mod_warranty') ? 1 : 0);
    formData.append('mod_order', form.value.isMaster === 1 ? 1 : form.value.modules.includes('mod_order') ? 1 : 0);
    formData.append('mod_billing', form.value.isMaster === 1 ? 1 : form.value.modules.includes('mod_billing') ? 1 : 0);
    formData.append('mod_sale', form.value.isMaster === 1 ? 1 : form.value.modules.includes('mod_sale') ? 1 : 0);
    formData.append('mod_user', form.value.isMaster === 1 ? 1 : form.value.modules.includes('mod_user') ? 1 : 0);

    return formData;
};

const handleUpdate = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix the errors in the form before submitting',
            life: 5000
        });
        return;
    }

    loading.value = true;

    try {
        const formData = createFormData();

        // Debug: Log form data before sending
        console.log('Updating form data:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }

        const userId = route.params.id;
        const response = await api.post(`update_dealer_user/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('API Response:', response);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User updated successfully',
                life: 5000
            });

            router.back();
        } else {
            // Handle specific API errors
            const errorMessage = response.data.error?.message || 'Failed to update user';

            // Check for specific error codes
            if (response.data.error?.code === '419') {
                toast.add({
                    severity: 'warn',
                    summary: 'Master User Exists',
                    detail: 'A master user already exists for this dealer account. Only one master user is allowed.',
                    life: 6000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 5000
                });
            }
        }
    } catch (error) {
        console.error('Error updating user:', error);

        let errorMessage = 'An error occurred while updating user';

        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your connection.';
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    if (isFormModified.value) {
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            router.back();
        }
    } else {
        router.back();
    }
};
</script>

<style scoped>
.required::after {
    content: ' *';
    color: #ef4444;
}

:deep(.p-card) {
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-card .p-card-title) {
    font-size: 1.25rem;
    color: #374151;
}

:deep(.p-password input) {
    width: 100%;
}
</style>